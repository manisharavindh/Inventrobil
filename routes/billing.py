from flask import Blueprint, render_template, request, jsonify, session, send_file
from extensions import db
from models import Product, BillingRecord, BillingItem
from utils import cashier_required, get_user_permissions, generate_invoice_pdf
from datetime import datetime

billing_bp = Blueprint('billing', __name__)

@billing_bp.route('/billing')
@cashier_required
def billing_page():
    """Render billing & POS page"""
    permissions = get_user_permissions(session['user']['role'])
    products = Product.query.all()
    # History: newest first
    history = BillingRecord.query.order_by(BillingRecord.timestamp.desc()).all()
    
    return render_template('billing.html', 
        user=session['user'],
        permissions=permissions,
        products=[p.to_dict() for p in products],
        billing_history=[h.to_dict() for h in history]
    )

@billing_bp.route('/api/billing', methods=['POST'])
@cashier_required
def add_billing_record():
    """Add a billing record"""
    data = request.json
    
    try:
        # 1. Update stock
        for item in data['items']:
            product = Product.query.get(item['id'])
            if product:
                if product.stock < item['quantity']:
                     return jsonify({'error': f'Insufficient stock for {product.name}'}), 400
                product.stock -= item['quantity']
        
        # 2. Create Billing Record
        timestamp_id = int(datetime.now().timestamp() * 1000)
        
        record = BillingRecord(
            timestamp_id=timestamp_id,
            timestamp=datetime.now(),
            subtotal=data['subtotal'],
            discount_percent=data['discountPercent'],
            discount_amount=data['discountAmount'],
            gst_rate=data['gstRate'],
            gst_amount=data['gstAmount'],
            total=data['total'],
            created_by=session['user']['username']
        )
        db.session.add(record)
        db.session.flush() # Get ID
        
        # 3. Create Items
        billing_items_list = []
        for item in data['items']:
            # We fetch again or use the one from loop above. 
            # Note: item['id'] is Product ID from frontend
            # We need to snapshot name/price in case product changes later?
            # Original code just stored what frontend sent or linked?
            # Original: 'items': data['items'] stored directly.
            # We should be robust.
            
            p = Product.query.get(item['id'])
            p_name = p.name if p else "Unknown Product"
            p_price = p.price if p else 0
            
            p_unit = p.unit if p else 'pc'
            
            b_item = BillingItem(
                billing_id=record.id,
                product_id=item['id'],
                product_name=p_name,
                quantity=item['quantity'],
                price=p_price,
                unit=p_unit
            )
            db.session.add(b_item)
            # Reconstruct for response to match old format
            billing_items_list.append({
                'id': item['id'],
                'name': p_name,
                'category': p.category if p else '',
                'stock': p.stock if p else 0,
                'price': p_price,
                'sku': p.sku if p else '',
                'quantity': item['quantity']
            })

        db.session.commit()
        
        # Return format must match original exactly
        response_record = record.to_dict()
        # Override items with the full details frontend might expect if it renders them immediately
        # The to_dict() returns a simplified item list. 
        # Check original: it returned 'items': data['items'] (which has full product details usually)
        response_record['items'] = data['items'] # Echo back what was sent + ID updates if any
        response_record['id'] = timestamp_id
        
        # DEMO USER: Save to session because DB transaction will be rolled back
        if session.get('user') and session['user'].get('username') == 'demo':
            session['demo_invoice'] = {
                'record': response_record,
                'items': data['items']
            }

        return jsonify(response_record), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 400

@billing_bp.route('/api/billing', methods=['GET'])
@cashier_required
def get_billing_history():
    """Get billing history"""
    history = BillingRecord.query.order_by(BillingRecord.timestamp.desc()).all()
    return jsonify([h.to_dict() for h in history])

@billing_bp.route('/api/billing/invoice/<int:record_id>', methods=['GET'])
@cashier_required
def download_invoice(record_id):
    """Generate and download invoice PDF"""
    
    # DEMO USER: Retrieve from session
    if session.get('user') and session['user'].get('username') == 'demo':
        demo_data = session.get('demo_invoice')
        # Check if we have data and it matches the requested ID
        # Note: record_id is an integer (timestamp_id)
        if demo_data and int(demo_data['record']['id']) == record_id:
             from types import SimpleNamespace
             
             r_data = demo_data['record']
             
             # Map camelCase keys back to snake_case for SimpleNamespace attribute access 
             # because generate_invoice_pdf expects snake_case attributes
             mapped_data = r_data.copy()
             mapped_data['discount_percent'] = r_data.get('discountPercent', 0)
             mapped_data['discount_amount'] = r_data.get('discountAmount', 0)
             mapped_data['gst_rate'] = r_data.get('gstRate', 0)
             mapped_data['gst_amount'] = r_data.get('gstAmount', 0)
             
             # Create a mock object expected by generate_invoice_pdf
             r_obj = SimpleNamespace(**mapped_data)
             
             # Restore datetime object (to_dict converts to string)
             if isinstance(r_obj.timestamp, str):
                 try:
                     r_obj.timestamp = datetime.fromisoformat(r_obj.timestamp)
                 except ValueError:
                     r_obj.timestamp = datetime.now() # Fallback

             # Record needs 'created_by' which is in to_dict as 'created_by'
             # It also needs 'id' which is in to_dict (timestamp_id)
             # generate_invoice_pdf uses record.id, which maps to mapped_data['id'] (timestamp_id)
             
             items = demo_data['items']
             # generate_invoice_pdf can handle dict items (checked in utils.py)
             
             pdf_buffer = generate_invoice_pdf(r_obj, items)
             
             return send_file(
                pdf_buffer,
                as_attachment=True,
                download_name=f'invoice_{record_id}.pdf',
                mimetype='application/pdf'
            )
        # If not found in session, fall through? Or return 404?
        # If we fall through, DB query will fail (because of rollback).
        # So we might as well fall through and let it 404 naturally if logic fails.
        # But if logic is correct, we return here.

    # record_id here is actually the timestamp_id passed from frontend
    record = BillingRecord.query.filter_by(timestamp_id=record_id).first_or_404()
    # Items are linked by the DB primary key, not timestamp_id
    items = BillingItem.query.filter_by(billing_id=record.id).all()
    
    pdf_buffer = generate_invoice_pdf(record, items)
    
    return send_file(
        pdf_buffer,
        as_attachment=True,
        download_name=f'invoice_{record_id}.pdf',
        mimetype='application/pdf'
    )

