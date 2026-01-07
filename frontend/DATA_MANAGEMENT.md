# Dynamic Data Management System - Documentation

## 🎯 Overview

The Inventrobil Web frontend now features a **complete dynamic data management system** with localStorage persistence. All data is stored locally on the browser and will be automatically synced to the database once the backend is implemented.

## 📊 Architecture

### Context-Based State Management

The application uses React Context API to manage global application state:

```
InventoryContext
├── State
│   ├── products (array)
│   ├── billingHistory (array)
│   └── isLoading (boolean)
├── Operations
│   ├── Product CRUD
│   ├── Stock Management
│   ├── Billing Records
│   └── Import/Export
```

### File Structure

```
src/
├── context/
│   └── InventoryContext.js     # Global state management
├── pages/
│   ├── Home.js                 # Dashboard with live statistics
│   ├── Inventory.js            # Product management with export/import
│   └── Billing.js              # POS system with checkout
├── components/
│   └── Header.js               # Navigation
└── App.js                      # Main app with provider
```

## 💾 localStorage Implementation

### Storage Keys

```javascript
// Inventory data storage key
'inventrobil_inventory'

// Billing history storage key
'inventrobil_billing'
```

### Automatic Persistence

Data is automatically saved to localStorage whenever state changes:

1. **Inventory Changes**: When products are added, updated, or deleted
2. **Billing Records**: When transactions are completed
3. **Initial Load**: If no data exists, sample data is loaded

### Data Format

#### Inventory Data
```json
{
  "id": 1,
  "name": "Product Name",
  "category": "Plumbing",
  "stock": 50,
  "price": 10.99,
  "sku": "SKU001"
}
```

#### Billing Record
```json
{
  "id": 1704067200000,
  "timestamp": "2024-01-01T12:00:00.000Z",
  "items": [
    {
      "id": 1,
      "name": "Product Name",
      "quantity": 2,
      "price": 10.99
    }
  ],
  "subtotal": 21.98,
  "discountPercent": 10,
  "discountAmount": 2.198,
  "gstRate": 18,
  "gstAmount": 3.5568,
  "total": 23.3348
}
```

## 🔄 API Methods (useInventory Hook)

### Usage

```javascript
import { useInventory } from '../context/InventoryContext';

function MyComponent() {
  const {
    // State
    products,
    billingHistory,
    isLoading,
    
    // Product operations
    addProduct,
    updateProduct,
    deleteProduct,
    updateStock,
    getProduct,
    getAllProducts,
    
    // Billing operations
    addBillingRecord,
    getBillingHistory,
    
    // Import/Export
    exportInventory,
    importInventory,
  } = useInventory();
}
```

### Product Operations

#### Add Product
```javascript
addProduct({
  name: 'PVC Pipe',
  category: 'Plumbing',
  stock: 50,
  price: 10.99,
  sku: 'PVC001'
});
```

#### Update Product
```javascript
updateProduct(productId, {
  name: 'Updated Name',
  stock: 45,
  price: 11.99
});
```

#### Delete Product
```javascript
deleteProduct(productId);
```

#### Update Stock (Billing)
```javascript
updateStock(productId, newStockQuantity);
```

#### Get Single Product
```javascript
const product = getProduct(productId);
```

#### Get All Products
```javascript
const allProducts = getAllProducts();
```

### Billing Operations

#### Add Billing Record
```javascript
addBillingRecord({
  items: cartItems,
  subtotal: 100,
  discountPercent: 10,
  discountAmount: 10,
  gstRate: 18,
  gstAmount: 16.2,
  total: 106.2
});
```

#### Get Billing History
```javascript
const history = getBillingHistory();
```

### Import/Export Operations

#### Export Inventory
```javascript
const data = exportInventory();
// Returns object with metadata and all products
```

#### Import Inventory
```javascript
importInventory({
  exportDate: "2024-01-01T12:00:00Z",
  totalProducts: 5,
  products: [...]
});
```

## 📥 Export/Import Features

### Export Functionality

**Location**: Inventory Page > "📥 Export JSON" button

**What it does**:
- Exports all products as a JSON file
- Includes export date and product count
- Downloads as `inventory_YYYY-MM-DD.json`

**Example exported file**:
```json
{
  "exportDate": "2024-01-15T10:30:00.000Z",
  "totalProducts": 5,
  "products": [
    {
      "id": 1,
      "name": "PVC Pipe 1/2 inch",
      "category": "Plumbing",
      "stock": 50,
      "price": 10.99,
      "sku": "PVC001"
    }
  ]
}
```

### Import Functionality

**Location**: Inventory Page > "📤 Import JSON" button

**How to use**:
1. Click "📤 Import JSON" button
2. Select a previously exported JSON file
3. Confirm import - all products are replaced

**Validation**:
- Validates JSON format
- Checks for required `products` array
- Shows error notifications on failure

## 🔄 Backend Integration (Future)

### Recommended Changes for Backend

When backend is ready, minimal changes needed:

1. **Replace localStorage calls** with API calls:
   ```javascript
   // Before (localStorage)
   localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
   
   // After (API)
   const response = await fetch('/api/inventory', {
     method: 'POST',
     body: JSON.stringify(products)
   });
   ```

2. **Update Context Methods**:
   ```javascript
   const addProduct = useCallback(async (product) => {
     const response = await fetch('/api/products', {
       method: 'POST',
       headers: { 'Content-Type': 'application/json' },
       body: JSON.stringify(product)
     });
     const newProduct = await response.json();
     setProducts(prev => [...prev, newProduct]);
   }, []);
   ```

3. **Keep UI Components Unchanged**:
   - All components use the same `useInventory` hook
   - UI logic doesn't need to change
   - Only the data source changes

## 🎯 Key Features

### ✅ Dynamic Data Binding
- All components automatically update when data changes
- No manual state syncing required
- Real-time notifications for user actions

### ✅ Data Persistence
- All changes auto-saved to localStorage
- Data survives browser refresh
- No data loss on page reload

### ✅ Inventory Management
- Add, edit, delete products
- Search and filter products
- Stock tracking with low-stock alerts
- Category-based filtering

### ✅ Billing System
- Dynamic product list
- Shopping cart with quantity control
- Auto-stock validation
- Automatic calculations (subtotal, discount, GST, total)
- Transaction history tracking

### ✅ Dashboard
- Live product count
- Low stock items count
- Today's transaction count
- Total revenue calculation

### ✅ Error Handling
- Try-catch blocks for operations
- User-friendly error messages
- Toast notifications for feedback

### ✅ Data Import/Export
- Export full inventory as JSON
- Import previously exported data
- Backup and restore functionality

## 📋 Sample Workflow

### 1. Adding a Product
```
User clicks "➕ Add Product" 
→ Form appears 
→ User fills details 
→ Clicks "Save Product"
→ addProduct() called
→ Product added to state
→ Automatically saved to localStorage
→ Notification shown to user
→ Form cleared
```

### 2. Making a Sale
```
User searches for product
→ Clicks "➕ Add" to add to cart
→ Updates quantity as needed
→ Applies discount and GST auto-calculated
→ Clicks "✅ Checkout"
→ Stock updated for each product
→ Billing record created
→ Cart cleared
→ Notification shown
→ Transaction tracked in history
```

### 3. Exporting Data
```
User clicks "📥 Export JSON"
→ exportInventory() called
→ Creates JSON with all products
→ Browser downloads file
→ File saved as inventory_DATE.json
```

### 4. Importing Data
```
User clicks "📤 Import JSON"
→ File picker opens
→ User selects JSON file
→ File validated
→ Products imported
→ Notification shown
→ Stock updated
```

## 🔒 Data Integrity

### Validation
- Product names required
- SKU must be unique per product
- Stock and price must be non-negative
- Cart quantity validates against available stock
- Discount cannot exceed 100%

### Stock Management
- Stock decreases only on successful checkout
- Prevents overselling in billing
- Reflects real-time availability
- Low-stock alerts (< 10 units)

## 📊 Performance Considerations

### Optimizations
- Context batches updates
- Lazy loading of history data
- Filtered product lists only compute on search change
- localStorage only written on actual changes
- Alert notifications auto-dismiss

### Scalability
- Ready for thousands of products
- Handles unlimited transaction history
- localStorage supports up to 5-10MB per origin
- Easy migration to database

## 🐛 Troubleshooting

### Data Not Persisting?
1. Check if localStorage is enabled
2. Verify browser storage quota
3. Check console for errors
4. Try clearing browser cache

### Import Not Working?
1. Ensure JSON file format is correct
2. File must have `products` array
3. Check console for validation errors
4. Re-export if unsure about format

### Stock Not Updating?
1. Verify product exists in inventory
2. Check checkout process completed
3. Refresh page to see latest stock
4. Check localStorage for data

## 📚 Code Examples

### Access Inventory in Any Component
```javascript
import { useInventory } from '../context/InventoryContext';

function MyComponent() {
  const { products, addProduct } = useInventory();
  
  return (
    <div>
      <p>Total Products: {products.length}</p>
      <button onClick={() => addProduct({...})}>
        Add Product
      </button>
    </div>
  );
}
```

### Real-time Statistics
```javascript
const { products, getBillingHistory } = useInventory();
const totalRevenue = getBillingHistory()
  .reduce((sum, record) => sum + record.total, 0);
const lowStockCount = products
  .filter(p => p.stock < 10).length;
```

## ✨ Future Enhancements

- [ ] Sync with backend API
- [ ] User authentication
- [ ] Multi-user support
- [ ] Product images
- [ ] Advanced analytics
- [ ] CSV export option
- [ ] Scheduled backups
- [ ] Audit logs
- [ ] Multi-language support
- [ ] Mobile app version
