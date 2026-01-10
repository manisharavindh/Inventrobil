# InventroBil Web - Jinja2 Server-Side Version

This is a 1-to-1 copy of the React frontend converted to Jinja2 templates for server-side rendering.

## Directory Structure

```
jj2/
├── templates/
│   ├── base.html          # Base template with layout
│   ├── header.html        # Navigation header component
│   ├── home.html          # Home page
│   ├── inventory.html     # Inventory management page
│   └── billing.html       # Billing & POS page
├── static/
│   ├── css/
│   │   ├── index.css      # Global styles (equivalent to index.css)
│   │   ├── app.css        # App styles (equivalent to App.css)
│   │   └── inventory.css  # Inventory page styles
│   └── js/
│       └── inventory-context.js  # Client-side state management
└── public/
    └── index.html         # HTML entry point
```

## Features

- **Home Page**: Dashboard with statistics (total products, low stock items, transactions, revenue)
- **Inventory Management**: Add, edit, delete, search products; import/export JSON
- **Billing & POS**: Shopping cart with products, quantity management, discounts, GST calculations
- **Data Persistence**: LocalStorage for products and billing history
- **Responsive Design**: Bootstrap 5 for responsive UI
- **State Management**: Client-side JavaScript state management via `inventory-context.js`

## Technologies

- Jinja2 Templates
- Bootstrap 5
- Vanilla JavaScript (ES6+)
- LocalStorage API

## API Endpoints (Required Backend)

The templates expect the following API endpoints to be implemented:

- `GET /` - Render home page
- `GET /inventory` - Render inventory page
- `GET /billing` - Render billing page
- `GET /api/products` - Get all products
- `POST /api/product` - Add new product
- `PUT /api/product/<id>` - Update product
- `DELETE /api/product/<id>` - Delete product
- `POST /api/billing` - Add billing record
- `GET /api/export` - Export inventory as JSON
- `POST /api/import` - Import inventory from JSON

## Implementation Notes

This Jinja2 version maintains 100% feature parity with the React version:
- All UI elements are identical
- Same styling and animations
- Same functionality and user interactions
- Same data structure for products and billing records
- Same localStorage persistence strategy

## Sample Data

The app comes with 5 sample products:
1. PVC Pipe 1/2 inch (Plumbing)
2. Copper Wire 2.5mm (Electronics)
3. Switch Socket (Electronics)
4. PVC Pipe 1 inch (Plumbing)
5. Electrical Box (Electronics)
