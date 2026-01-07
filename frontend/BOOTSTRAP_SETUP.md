# Bootstrap & React Frontend Setup

## 🎨 Overview

This frontend has been fully set up with **Bootstrap 5** and **React Bootstrap** for a modern, responsive UI.

## 📦 Installed Packages

- **react**: ^19.2.3 - React library
- **react-dom**: ^19.2.3 - React DOM rendering
- **react-router-dom**: ^7.11.0 - Client-side routing
- **bootstrap**: ^5.x - Bootstrap CSS framework
- **react-bootstrap**: ^2.x - React components built on Bootstrap

## 🚀 Getting Started

### Installation

```bash
cd frontend
npm install
```

### Running Development Server

```bash
npm start
```

The app will open at `http://localhost:3000` (or the next available port).

### Building for Production

```bash
npm run build
```

## 🎯 Component Structure

### Pages
1. **Home** (`src/pages/Home.js`) - Landing page with feature cards
2. **Inventory** (`src/pages/Inventory.js`) - Product management
3. **Billing** (`src/pages/Billing.js`) - POS system with cart

### Components
- **Header** (`src/components/Header.js`) - Responsive navigation bar

## 🎨 Key Features

### Home Page
- Welcome hero section
- Feature cards layout (4-column responsive grid)
- Call-to-action buttons
- Professional styling with Bootstrap utilities

### Inventory Management
- Search functionality
- Add product form with validation
- Responsive data table with sorting
- Stock status badges (Low/Medium/In Stock)
- Category filtering with badges
- Edit/Delete actions

### Billing & POS System
- Product search with instant filtering
- Shopping cart with quantity management
- Automatic calculations:
  - Subtotal
  - Discount percentage
  - GST (configurable)
  - Grand total
- Professional receipt display
- Quick add/remove from cart

### Header/Navigation
- Responsive navbar with hamburger menu on mobile
- Brand logo with emoji
- Navigation links with icons
- Dark theme with hover effects

## 🎭 Styling Approach

### Bootstrap Classes Used
- **Grid System**: Container, Row, Col for responsive layouts
- **Components**: Card, Table, Button, Badge, Form, Nav, etc.
- **Utilities**: Spacing (p, m), text alignment, display properties
- **Responsive**: md, lg breakpoints for mobile optimization

### Custom CSS (src/App.css & src/index.css)
- Table hover effects
- Card animations
- Button transitions
- Navbar custom styling
- Scrollbar customization
- Mobile responsiveness

## 📱 Responsive Design

The UI is fully responsive using Bootstrap's breakpoints:
- **Mobile** (< 576px): Single column, hamburger menu
- **Tablet** (≥ 576px, < 768px): 2-column layouts
- **Desktop** (≥ 768px): Full multi-column layouts

## 🎨 Color Scheme

- **Primary**: Blue (#007bff)
- **Success**: Green (#28a745)
- **Danger**: Red (#dc3545)
- **Warning**: Orange (#ffc107)
- **Dark**: #282c34
- **Background**: #f5f6fa

## 📚 Bootstrap React Documentation

For detailed component documentation, visit:
https://react-bootstrap.github.io/

## 🔧 Available Scripts

```bash
npm start      # Run development server
npm run build  # Build for production
npm test       # Run tests
npm run eject  # Eject configuration (irreversible)
```

## 🚦 Development Tips

1. **Use React Bootstrap Components**: Prefer `<Button>`, `<Card>`, etc. from react-bootstrap
2. **Bootstrap Classes**: Combine with className for additional styling
3. **Responsive Images**: Use `img-fluid` class for responsive images
4. **Icons**: Use emoji or integrate Font Awesome for better icons
5. **Forms**: Use Bootstrap Form components for consistency

## 📦 Future Enhancements

- Add Font Awesome icons for better UI
- Implement dark mode toggle
- Add data persistence with localStorage
- Connect to backend API
- Add product image uploads
- Implement authentication
- Add more analytics charts

## 🐛 Troubleshooting

### Bootstrap CSS not loading?
Ensure `import 'bootstrap/dist/css/bootstrap.min.css';` is in `src/index.js`

### Component styling issues?
Make sure you're importing components from `react-bootstrap` not `bootstrap`

### Port already in use?
The app will automatically use the next available port, or specify:
```bash
PORT=3001 npm start
```
