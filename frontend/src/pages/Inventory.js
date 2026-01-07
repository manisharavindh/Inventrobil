import React, { useState, useRef } from 'react';
import {
  Container,
  Row,
  Col,
  Form,
  Table,
  Button,
  Badge,
  Card,
  InputGroup,
  Modal,
  Alert,
} from 'react-bootstrap';
import { useInventory } from '../context/InventoryContext';

const Inventory = () => {
  const {
    products,
    addProduct,
    updateProduct,
    deleteProduct,
    exportInventory,
    importInventory,
  } = useInventory();

  const [search, setSearch] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertVariant, setAlertVariant] = useState('success');
  const fileInputRef = useRef(null);

  const [newProduct, setNewProduct] = useState({
    name: '',
    category: 'Plumbing',
    stock: '',
    price: '',
    sku: '',
  });

  const [editProduct, setEditProduct] = useState(null);

  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(search.toLowerCase()) ||
      product.sku.toLowerCase().includes(search.toLowerCase())
  );

  const showNotification = (message, variant = 'success') => {
    setAlertMessage(message);
    setAlertVariant(variant);
    setShowAlert(true);
    setTimeout(() => setShowAlert(false), 3000);
  };

  const handleAddProduct = (e) => {
    e.preventDefault();
    if (newProduct.name && newProduct.stock && newProduct.price && newProduct.sku) {
      try {
        addProduct(newProduct);
        setNewProduct({
          name: '',
          category: 'Plumbing',
          stock: '',
          price: '',
          sku: '',
        });
        setShowAddForm(false);
        showNotification(`✅ Product "${newProduct.name}" added successfully!`);
      } catch (error) {
        showNotification(`❌ Error adding product: ${error.message}`, 'danger');
      }
    }
  };

  const handleStartEdit = (product) => {
    setEditingId(product.id);
    setEditProduct({ ...product });
  };

  const handleUpdateProduct = (e) => {
    e.preventDefault();
    if (editProduct) {
      try {
        updateProduct(editingId, editProduct);
        setEditingId(null);
        setEditProduct(null);
        showNotification('✅ Product updated successfully!');
      } catch (error) {
        showNotification(`❌ Error updating product: ${error.message}`, 'danger');
      }
    }
  };

  const handleDeleteProduct = (id, name) => {
    if (window.confirm(`Are you sure you want to delete "${name}"?`)) {
      try {
        deleteProduct(id);
        showNotification(`✅ Product "${name}" deleted successfully!`);
      } catch (error) {
        showNotification(`❌ Error deleting product: ${error.message}`, 'danger');
      }
    }
  };

  const handleExportInventory = () => {
    try {
      const data = exportInventory();
      const jsonString = JSON.stringify(data, null, 2);
      const blob = new Blob([jsonString], { type: 'application/json' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `inventory_${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      showNotification(`✅ Inventory exported successfully! (${products.length} products)`);
    } catch (error) {
      showNotification(`❌ Error exporting inventory: ${error.message}`, 'danger');
    }
  };

  const handleImportInventory = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target?.result);
        importInventory(data);
        showNotification(`✅ Inventory imported successfully! (${data.products.length} products)`);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      } catch (error) {
        showNotification(
          `❌ Error importing inventory: Invalid JSON file`,
          'danger'
        );
      }
    };
    reader.readAsText(file);
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const getStockBadge = (stock) => {
    if (stock < 10) return <Badge bg="danger">Low Stock</Badge>;
    if (stock < 20) return <Badge bg="warning" text="dark">Medium</Badge>;
    return <Badge bg="success">In Stock</Badge>;
  };

  return (
    <Container>
      {showAlert && (
        <Alert variant={alertVariant} dismissible onClose={() => setShowAlert(false)} className="mb-3">
          {alertMessage}
        </Alert>
      )}

      <Row className="mb-4">
        <Col md={6}>
          <h2 className="mb-0">Inventory Management</h2>
        </Col>
        <Col md={6} className="text-end">
          <Button
            variant="success"
            className="me-2"
            size="sm"
            onClick={handleExportInventory}
          >
            Export JSON
          </Button>
          <Button
            variant="info"
            className="me-2"
            size="sm"
            onClick={handleImportClick}
          >
            Import JSON
          </Button>
          <Button
            variant={showAddForm ? 'danger' : 'primary'}
            onClick={() => setShowAddForm(!showAddForm)}
            size="sm"
          >
            {showAddForm ? 'Cancel' : 'Add Product'}
          </Button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImportInventory}
            accept=".json"
            style={{ display: 'none' }}
          />
        </Col>
      </Row>

      {showAddForm && (
        <Card className="mb-4 border-primary">
          <Card.Body>
            <h5 className="mb-3">Add New Product</h5>
            <Form onSubmit={handleAddProduct}>
              <Row>
                <Col md={6} className="mb-3">
                  <Form.Group>
                    <Form.Label>Product Name</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Enter product name"
                      value={newProduct.name}
                      onChange={(e) =>
                        setNewProduct({ ...newProduct, name: e.target.value })
                      }
                      required
                    />
                  </Form.Group>
                </Col>
                <Col md={6} className="mb-3">
                  <Form.Group>
                    <Form.Label>SKU</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Enter SKU"
                      value={newProduct.sku}
                      onChange={(e) =>
                        setNewProduct({ ...newProduct, sku: e.target.value })
                      }
                      required
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col md={4} className="mb-3">
                  <Form.Group>
                    <Form.Label>Category</Form.Label>
                    <Form.Select
                      value={newProduct.category}
                      onChange={(e) =>
                        setNewProduct({ ...newProduct, category: e.target.value })
                      }
                    >
                      <option>Plumbing</option>
                      <option>Electronics</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={4} className="mb-3">
                  <Form.Group>
                    <Form.Label>Stock</Form.Label>
                    <Form.Control
                      type="number"
                      placeholder="Enter stock quantity"
                      value={newProduct.stock}
                      onChange={(e) =>
                        setNewProduct({ ...newProduct, stock: e.target.value })
                      }
                      required
                    />
                  </Form.Group>
                </Col>
                <Col md={4} className="mb-3">
                  <Form.Group>
                    <Form.Label>Price ($)</Form.Label>
                    <Form.Control
                      type="number"
                      placeholder="Enter price"
                      value={newProduct.price}
                      onChange={(e) =>
                        setNewProduct({ ...newProduct, price: e.target.value })
                      }
                      step="0.01"
                      required
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Button variant="success" type="submit" className="me-2">
                Save Product
              </Button>
            </Form>
          </Card.Body>
        </Card>
      )}

      <Row className="mb-4">
        <Col md={6}>
          <InputGroup>
            <InputGroup.Text>🔍</InputGroup.Text>
            <Form.Control
              placeholder="Search by product name or SKU..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </InputGroup>
        </Col>
        <Col md={6} className="text-end text-muted">
          Showing {filteredProducts.length} of {products.length} products
        </Col>
      </Row>

      <Row>
        <Col md={12}>
          <Card className="shadow-sm">
            <Table hover responsive className="mb-0">
              <thead className="table-dark">
                <tr>
                  <th>Product Name</th>
                  <th>Category</th>
                  <th>SKU</th>
                  <th>Stock</th>
                  <th>Price</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.length > 0 ? (
                  filteredProducts.map(product => (
                    <tr key={product.id}>
                      <td className="fw-bold">{product.name}</td>
                      <td>
                        <Badge bg={product.category === 'Plumbing' ? 'info' : 'warning'} text="dark">
                          {product.category}
                        </Badge>
                      </td>
                      <td className="font-monospace">{product.sku}</td>
                      <td>{product.stock} units</td>
                      <td className="fw-bold">${product.price.toFixed(2)}</td>
                      <td>{getStockBadge(product.stock)}</td>
                      <td>
                        <Button
                          variant="outline-primary"
                          size="sm"
                          className="me-1"
                          onClick={() => handleStartEdit(product)}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="outline-danger"
                          size="sm"
                          onClick={() => handleDeleteProduct(product.id, product.name)}
                        >
                          Delete
                        </Button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="text-center py-4 text-muted">
                      No products found
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          </Card>
        </Col>
      </Row>

      {/* Edit Modal */}
      <Modal show={editingId !== null} onHide={() => setEditingId(null)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Product</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {editProduct && (
            <Form onSubmit={handleUpdateProduct}>
              <Form.Group className="mb-3">
                <Form.Label>Product Name</Form.Label>
                <Form.Control
                  type="text"
                  value={editProduct.name}
                  onChange={(e) =>
                    setEditProduct({ ...editProduct, name: e.target.value })
                  }
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>SKU</Form.Label>
                <Form.Control
                  type="text"
                  value={editProduct.sku}
                  onChange={(e) =>
                    setEditProduct({ ...editProduct, sku: e.target.value })
                  }
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Category</Form.Label>
                <Form.Select
                  value={editProduct.category}
                  onChange={(e) =>
                    setEditProduct({ ...editProduct, category: e.target.value })
                  }
                >
                  <option>Plumbing</option>
                  <option>Electronics</option>
                </Form.Select>
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Stock</Form.Label>
                <Form.Control
                  type="number"
                  value={editProduct.stock}
                  onChange={(e) =>
                    setEditProduct({ ...editProduct, stock: e.target.value })
                  }
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Price ($)</Form.Label>
                <Form.Control
                  type="number"
                  value={editProduct.price}
                  onChange={(e) =>
                    setEditProduct({ ...editProduct, price: e.target.value })
                  }
                  step="0.01"
                />
              </Form.Group>
              <Button variant="primary" type="submit" className="w-100">
                Update Product
              </Button>
            </Form>
          )}
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default Inventory;