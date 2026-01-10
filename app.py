"""
InventroBil Web - Flask Server-Side Application
1-to-1 copy of the React frontend using Jinja2 templates
"""

from flask import Flask, render_template, request, jsonify
from datetime import datetime
import json
import os

app = Flask(__name__, 
    template_folder='templates',
    static_folder='static'
)

# In-memory storage (replace with database in production)
products = [
    { 'id': 1, 'name': 'PVC Pipe 1/2 inch', 'category': 'Plumbing', 'stock': 50, 'price': 10.99, 'sku': 'PVC001' },
    { 'id': 2, 'name': 'Copper Wire 2.5mm', 'category': 'Electronics', 'stock': 5, 'price': 15.50, 'sku': 'COP001' },
    { 'id': 3, 'name': 'Switch Socket', 'category': 'Electronics', 'stock': 20, 'price': 5.50, 'sku': 'SWT001' },
    { 'id': 4, 'name': 'PVC Pipe 1 inch', 'category': 'Plumbing', 'stock': 35, 'price': 18.99, 'sku': 'PVC002' },
    { 'id': 5, 'name': 'Electrical Box', 'category': 'Electronics', 'stock': 8, 'price': 8.75, 'sku': 'ELB001' },
]

billing_history = []

# ============= PAGE ROUTES =============

@app.route('/')
def home():
    """Render home page with dashboard stats"""
    total_products = len(products)
    low_stock_count = sum(1 for p in products if p['stock'] < 10)
    total_transactions = len(billing_history)
    total_revenue = sum(record['total'] for record in billing_history)
    
    return render_template('home.html',
        total_products=total_products,
        low_stock_count=low_stock_count,
        total_transactions=total_transactions,
        total_revenue=total_revenue
    )

@app.route('/inventory')
def inventory():
    """Render inventory management page"""
    return render_template('inventory.html', products=products)

@app.route('/billing')
def billing():
    """Render billing & POS page"""
    return render_template('billing.html', 
        products=products,
        billing_history=billing_history
    )

# ============= API ROUTES =============

@app.route('/api/products', methods=['GET'])
def get_products():
    """Get all products"""
    return jsonify(products)

@app.route('/api/product', methods=['POST'])
def add_product():
    """Add a new product"""
    global products
    data = request.json
    
    new_product = {
        'id': max([p['id'] for p in products], default=0) + 1,
        'name': data['name'],
        'category': data['category'],
        'stock': int(data['stock']),
        'price': float(data['price']),
        'sku': data['sku']
    }
    
    products.append(new_product)
    return jsonify(new_product), 201

@app.route('/api/product/<int:product_id>', methods=['PUT'])
def update_product(product_id):
    """Update an existing product"""
    global products
    data = request.json
    
    product = next((p for p in products if p['id'] == product_id), None)
    if not product:
        return jsonify({'error': 'Product not found'}), 404
    
    product.update({
        'name': data.get('name', product['name']),
        'category': data.get('category', product['category']),
        'stock': int(data.get('stock', product['stock'])),
        'price': float(data.get('price', product['price'])),
        'sku': data.get('sku', product['sku'])
    })
    
    return jsonify(product)

@app.route('/api/product/<int:product_id>', methods=['DELETE'])
def delete_product(product_id):
    """Delete a product"""
    global products
    products = [p for p in products if p['id'] != product_id]
    return jsonify({'success': True})

@app.route('/api/billing', methods=['POST'])
def add_billing_record():
    """Add a billing record"""
    global products, billing_history
    data = request.json
    
    # Update stock for each item
    for item in data['items']:
        product = next((p for p in products if p['id'] == item['id']), None)
        if product:
            product['stock'] -= item['quantity']
    
    # Create billing record
    record = {
        'id': int(datetime.now().timestamp() * 1000),
        'timestamp': datetime.now().isoformat(),
        'items': data['items'],
        'subtotal': data['subtotal'],
        'discountPercent': data['discountPercent'],
        'discountAmount': data['discountAmount'],
        'gstRate': data['gstRate'],
        'gstAmount': data['gstAmount'],
        'total': data['total']
    }
    
    billing_history.insert(0, record)
    return jsonify(record), 201

@app.route('/api/billing', methods=['GET'])
def get_billing_history():
    """Get billing history"""
    return jsonify(billing_history)

@app.route('/api/export', methods=['GET'])
def export_inventory():
    """Export inventory as JSON"""
    return jsonify({
        'exportDate': datetime.now().isoformat(),
        'totalProducts': len(products),
        'products': products
    })

@app.route('/api/import', methods=['POST'])
def import_inventory():
    """Import inventory from JSON"""
    global products
    data = request.json
    
    if not data.get('products') or not isinstance(data['products'], list):
        return jsonify({'error': 'Invalid inventory data format'}), 400
    
    products = data['products']
    return jsonify({'success': True, 'imported': len(products)})

# ============= ERROR HANDLERS =============

@app.errorhandler(404)
def not_found(error):
    return render_template('home.html'), 404

@app.errorhandler(500)
def server_error(error):
    return jsonify({'error': 'Internal server error'}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)
