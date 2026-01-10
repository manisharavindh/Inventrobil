// Inventory Context - Client-side state management for Jinja2 templates
// This mimics the React InventoryContext functionality

const STORAGE_KEY = 'inventrobil_inventory';
const BILLING_KEY = 'inventrobil_billing';

// Initial sample data
const INITIAL_PRODUCTS = [
  { id: 1, name: 'PVC Pipe 1/2 inch', category: 'Plumbing', stock: 50, price: 10.99, sku: 'PVC001' },
  { id: 2, name: 'Copper Wire 2.5mm', category: 'Electronics', stock: 5, price: 15.50, sku: 'COP001' },
  { id: 3, name: 'Switch Socket', category: 'Electronics', stock: 20, price: 5.50, sku: 'SWT001' },
  { id: 4, name: 'PVC Pipe 1 inch', category: 'Plumbing', stock: 35, price: 18.99, sku: 'PVC002' },
  { id: 5, name: 'Electrical Box', category: 'Electronics', stock: 8, price: 8.75, sku: 'ELB001' },
];

class InventoryManager {
  constructor() {
    this.products = [];
    this.billingHistory = [];
    this.isLoading = true;
    this.init();
  }

  init() {
    this.loadData();
  }

  loadData() {
    try {
      const storedProducts = localStorage.getItem(STORAGE_KEY);
      const storedBilling = localStorage.getItem(BILLING_KEY);

      if (storedProducts) {
        this.products = JSON.parse(storedProducts);
      } else {
        this.products = [...INITIAL_PRODUCTS];
        this.saveProducts();
      }

      if (storedBilling) {
        this.billingHistory = JSON.parse(storedBilling);
      }
    } catch (error) {
      console.error('Error loading data from localStorage:', error);
      this.products = [...INITIAL_PRODUCTS];
    } finally {
      this.isLoading = false;
    }
  }

  saveProducts() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.products));
    } catch (error) {
      console.error('Error saving products to localStorage:', error);
    }
  }

  saveBilling() {
    try {
      localStorage.setItem(BILLING_KEY, JSON.stringify(this.billingHistory));
    } catch (error) {
      console.error('Error saving billing history to localStorage:', error);
    }
  }

  addProduct(product) {
    const newProduct = {
      id: Math.max(...this.products.map((p) => p.id), 0) + 1,
      ...product,
      stock: parseInt(product.stock),
      price: parseFloat(product.price),
    };
    this.products.push(newProduct);
    this.saveProducts();
    return newProduct;
  }

  updateProduct(id, updatedProduct) {
    this.products = this.products.map((product) =>
      product.id === id
        ? {
            ...product,
            ...updatedProduct,
            stock: parseInt(updatedProduct.stock || product.stock),
            price: parseFloat(updatedProduct.price || product.price),
          }
        : product
    );
    this.saveProducts();
  }

  deleteProduct(id) {
    this.products = this.products.filter((product) => product.id !== id);
    this.saveProducts();
  }

  updateStock(id, newStock) {
    this.products = this.products.map((product) =>
      product.id === id ? { ...product, stock: Math.max(0, newStock) } : product
    );
    this.saveProducts();
  }

  addBillingRecord(record) {
    const billingRecord = {
      id: Date.now(),
      timestamp: new Date().toISOString(),
      ...record,
    };
    this.billingHistory.unshift(billingRecord);
    this.saveBilling();
    return billingRecord;
  }

  exportInventory() {
    return {
      exportDate: new Date().toISOString(),
      totalProducts: this.products.length,
      products: this.products,
    };
  }

  importInventory(data) {
    if (!data.products || !Array.isArray(data.products)) {
      throw new Error('Invalid inventory data format');
    }
    this.products = data.products;
    this.saveProducts();
  }

  getProduct(id) {
    return this.products.find((product) => product.id === id);
  }

  getAllProducts() {
    return [...this.products];
  }

  getBillingHistory() {
    return [...this.billingHistory];
  }
}

// Initialize the inventory manager globally
const inventoryManager = new InventoryManager();
