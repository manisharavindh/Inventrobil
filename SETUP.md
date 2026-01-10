# Setup Guide for InventroBil Jinja2 Server-Side Version

## Quick Start

### 1. Install Dependencies
```bash
cd jj2
pip install -r requirements.txt
```

### 2. Run the Flask Server
```bash
python app.py
```

The application will be available at `http://localhost:5000`

## Project Structure

```
jj2/
├── app.py                 # Main Flask application
├── requirements.txt       # Python dependencies
├── public/
│   └── index.html        # Static HTML entry point
├── templates/            # Jinja2 templates
│   ├── base.html         # Base template with layout
│   ├── header.html       # Navigation header
│   ├── home.html         # Home/Dashboard page
│   ├── inventory.html    # Inventory management page
│   └── billing.html      # Billing & POS page
└── static/               # Static files
    ├── css/
    │   ├── index.css     # Global styles
    │   ├── app.css       # App styles
    │   └── inventory.css # Inventory-specific styles
    └── js/
        └── inventory-context.js  # Client-side state management
```

## Features

### 1. Home Page (Dashboard)
- Shows total products count
- Displays low stock items count
- Shows number of transactions
- Displays total revenue

### 2. Inventory Management
- **View Products**: See all products in a table with search
- **Add Products**: Add new products with name, SKU, category, stock, and price
- **Edit Products**: Modify existing product details in a modal
- **Delete Products**: Remove products with confirmation
- **Search**: Filter products by name or SKU
- **Export/Import**: Export inventory to JSON and import from JSON files

### 3. Billing & POS
- **Product Search**: Find products to add to cart
- **Shopping Cart**: Add items, adjust quantities
- **Calculations**: Automatic subtotal, discount, GST (18%), and total calculations
- **Checkout**: Complete purchases and update stock
- **History**: View transaction history

## API Endpoints

The Flask app provides the following REST API endpoints:

### Products
- `GET /api/products` - Get all products
- `POST /api/product` - Add new product
- `PUT /api/product/<id>` - Update product
- `DELETE /api/product/<id>` - Delete product

### Billing
- `GET /api/billing` - Get billing history
- `POST /api/billing` - Add billing record

### Import/Export
- `GET /api/export` - Export inventory as JSON
- `POST /api/import` - Import inventory from JSON

## Data Persistence

The app uses two approaches:

1. **Server-side**: Products stored in memory (Python list)
2. **Client-side**: Browser localStorage for cart and session data

To make it persistent across server restarts, modify `app.py` to use a database like SQLite or PostgreSQL.

## Customization

### Change Initial Products
Edit the `products` list in `app.py`:
```python
products = [
    { 'id': 1, 'name': 'Your Product', 'category': 'Category', 'stock': 50, 'price': 10.99, 'sku': 'SKU001' },
    # ... add more products
]
```

### Change Port
Modify the last line in `app.py`:
```python
if __name__ == '__main__':
    app.run(debug=True, port=8000)  # Change 5000 to your desired port
```

### Modify Styling
Edit CSS files in `static/css/`:
- `index.css` - Global styles
- `app.css` - Main app styles
- `inventory.css` - Inventory page specific styles

### Add Database Support
Replace the in-memory `products` and `billing_history` lists with database queries using SQLAlchemy or your preferred ORM.

## Comparison with React Version

This Jinja2 version is a **1-to-1 copy** of the React frontend with these key differences:

| Aspect | React Version | Jinja2 Version |
|--------|--------------|----------------|
| Rendering | Client-side (CSR) | Server-side (SSR) |
| Templates | JSX | Jinja2 |
| State Management | React Context API | Client-side JS + Server |
| Routing | React Router | Flask routes |
| Backend | Node.js/Express | Python/Flask |
| Data Flow | Props + Context | Template variables + Fetch API |

The UI, styling, and functionality are **identical** between both versions.

## Troubleshooting

### Port Already in Use
```bash
# Find process using port 5000
lsof -i :5000
# Kill the process
kill -9 <PID>
```

### Import Errors
Make sure you're in the correct directory and have installed requirements:
```bash
cd jj2
pip install -r requirements.txt
```

### Templates Not Found
Ensure the Flask app is run from the `jj2` directory:
```bash
cd jj2
python app.py
```

## Next Steps

1. Connect to a real database (SQLite, PostgreSQL, MySQL)
2. Add user authentication
3. Add product images
4. Implement receipt printing
5. Add sales reports and analytics
6. Deploy to a hosting service (Heroku, PythonAnywhere, AWS, etc.)

## License

Same as the original React project.
