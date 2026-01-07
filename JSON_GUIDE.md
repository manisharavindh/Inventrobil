# JSON Export/Import Guide

## 📋 Complete Example: Exported Inventory File

### File Name Format
```
inventory_YYYY-MM-DD.json

Example: inventory_2024-01-15.json
```

### Complete JSON Structure

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
    },
    {
      "id": 2,
      "name": "Copper Wire 2.5mm",
      "category": "Electronics",
      "stock": 5,
      "price": 15.50,
      "sku": "COP001"
    },
    {
      "id": 3,
      "name": "Switch Socket",
      "category": "Electronics",
      "stock": 20,
      "price": 5.50,
      "sku": "SWT001"
    },
    {
      "id": 4,
      "name": "PVC Pipe 1 inch",
      "category": "Plumbing",
      "stock": 35,
      "price": 18.99,
      "sku": "PVC002"
    },
    {
      "id": 5,
      "name": "Electrical Box",
      "category": "Electronics",
      "stock": 8,
      "price": 8.75,
      "sku": "ELB001"
    }
  ]
}
```

## 📋 Field Descriptions

### Root Level

| Field | Type | Description | Example |
|-------|------|-------------|---------|
| `exportDate` | string | ISO 8601 timestamp of export | "2024-01-15T10:30:00.000Z" |
| `totalProducts` | number | Count of products in file | 5 |
| `products` | array | Array of product objects | [...] |

### Product Object

| Field | Type | Required | Min | Max | Description | Example |
|-------|------|----------|-----|-----|-------------|---------|
| `id` | number | ✅ | 1 | ∞ | Unique product ID | 1 |
| `name` | string | ✅ | 1 char | 255 chars | Product name | "PVC Pipe 1/2 inch" |
| `category` | string | ✅ | - | - | "Plumbing" or "Electronics" | "Plumbing" |
| `stock` | number | ✅ | 0 | ∞ | Units in stock | 50 |
| `price` | number | ✅ | 0.00 | ∞ | Unit price | 10.99 |
| `sku` | string | ✅ | 1 char | 50 chars | Unique SKU code | "PVC001" |

## 🔄 Using the Export File

### Create Manual Backup
```bash
# Save export file to version control
git add inventory_2024-01-15.json
git commit -m "Backup inventory as of Jan 15"
```

### Share Data with Team
```
Send inventory_2024-01-15.json to team
Team member imports on their system
All products synced
```

### Migrate to Production
```
1. Export from dev: inventory_dev.json
2. Import on production server
3. All products ready
4. Connect to database
```

## 📥 Importing JSON

### Requirements
- Valid JSON format
- Must have `products` array
- Each product needs required fields
- File size < 10MB (browser limit)

### Validation Errors

#### Invalid JSON Format
```
❌ Error: Unexpected token < in JSON at position 0

Fix: Ensure file is valid JSON
- Download from export button only
- Don't edit manually
- Check file extension is .json
```

#### Missing Products Array
```
❌ Error: Cannot read property 'products' of undefined

Fix: File must have structure:
{
  "exportDate": "...",
  "totalProducts": 5,
  "products": [...]  ← Required
}
```

#### Missing Required Fields
```
❌ Import may fail silently

Fix: Ensure each product has:
- id (number)
- name (string)
- category (string)
- stock (number)
- price (number)
- sku (string)
```

## 💾 Storage & Backup Strategy

### Daily Backup (Recommended)
```
Monday:   inventory_2024-01-15.json (5 products)
Tuesday:  inventory_2024-01-16.json (5 products + 1 new)
Wednesday: inventory_2024-01-17.json (6 products, 1 sold)
Thursday: inventory_2024-01-18.json (6 products - 1 deleted)
Friday:   inventory_2024-01-19.json (6 products, sales)
```

### Weekly Archive
```
2024-01/
├── Week-1/
│   ├── inventory_2024-01-08.json
│   ├── inventory_2024-01-09.json
│   └── ...
├── Week-2/
│   └── inventory_2024-01-15.json
└── ...
```

### Version Control
```
# In git repository
backups/
├── inventory_2024-01-15.json
├── inventory_2024-01-22.json
├── inventory_2024-02-01.json
└── .gitignore (optional - if sensitive)
```

## 🔍 Reading/Editing JSON Manually

### Visual JSON Editors
- **Visual Studio Code** (free)
  - Install "JSON Viewer" extension
  - Right-click → "Format Document"
  
- **Online**: jsoncrack.com
  - Visualize structure
  - Navigate easily
  - Read-only

### Manual Editing (Advanced)

#### Add a New Product
```json
{
  "exportDate": "2024-01-15T10:30:00.000Z",
  "totalProducts": 6,
  "products": [
    ... existing products ...,
    {
      "id": 6,
      "name": "New Product",
      "category": "Plumbing",
      "stock": 10,
      "price": 12.99,
      "sku": "NEW001"
    }
  ]
}
```

#### Update Product Price
```json
// Find product with sku "PVC001"
{
  "id": 1,
  "name": "PVC Pipe 1/2 inch",
  "category": "Plumbing",
  "stock": 50,
  "price": 11.99,        // Changed from 10.99
  "sku": "PVC001"
}
```

#### Remove a Product
```json
// Delete entire product object from array
// Update totalProducts count

"totalProducts": 4,  // Was 5, now 4
"products": [
  // Remove one object from array
  product1, product2, product3, product4
  // product5 removed
]
```

⚠️ **Warning**: Manual editing can break the file. Use import feature instead!

## 🛠️ Troubleshooting Import Issues

### File Won't Import

**Problem**: Nothing happens when clicking Import

**Solution**:
1. Ensure file is .json extension
2. Check file isn't corrupted
3. Try re-exporting and importing
4. Try different browser

**Problem**: "Invalid JSON file" error

**Solution**:
1. Open file in text editor
2. Check for missing/extra characters
3. Validate at jsonlint.com
4. Re-save as UTF-8 encoding

**Problem**: Products imported but with wrong data

**Solution**:
1. Export to get correct format
2. Use that as template
3. Edit values carefully
4. Validate structure

## 📊 Real-World Scenarios

### Scenario 1: Daily Backup
```
9 AM: Start day
5 PM: Click "📥 Export JSON"
     → File: inventory_2024-01-15.json
     → Move to backups folder
     → Sleep peacefully! 😴
```

### Scenario 2: Restore from Backup
```
Monday 9 AM: System crash, lost all data
Monday 10 AM: Reinstall app
Monday 10:30 AM: Click "📤 Import JSON"
              → Select: inventory_2024-01-13.json
              → Click Open
              → All data restored!
Monday 11 AM: Resume business 🎉
```

### Scenario 3: Sync Multiple Locations
```
Head Office:
├── Export: inventory_main.json (100 products)

Branch Office:
├── Receives file
├── Click "📤 Import JSON"
├── Select: inventory_main.json
└── Now has same 100 products ✅

Updates sync back via import/export until backend ready
```

### Scenario 4: Upgrade to Production
```
Dev Inventory (10 test products)
├── Export: inventory_dev.json
└── Delete test products

Prod Inventory (100 real products)
├── Import: real_inventory.json
└── Add 100 products ✅

Live for business! 🚀
```

## 🔗 Integration with Git

### Store Backups in Git
```bash
# Initialize backups folder
mkdir -p backups
echo "backups/*.json" >> .gitignore  # Optional

# Add backup
cp inventory_2024-01-15.json backups/
git add backups/inventory_2024-01-15.json
git commit -m "Backup inventory from Jan 15 (100 products)"

# Push to GitHub
git push origin main
```

### Recover from GitHub
```bash
git clone https://github.com/user/inventrobil-web.git
cd inventrobil-web/backups
# Locate and download any backup file
# Import to app
```

## 📱 Portable Inventory

### Share Between Devices
```
Device 1 (Office):
├── Add 10 products
├── Export: office_inventory.json

Device 2 (Shop):
├── Import: office_inventory.json
├── Add 5 products  
├── Export: shop_inventory.json

Device 1 Again:
├── Import: shop_inventory.json
├── Now has all 15 products ✅
```

## 🎓 Learning Path

### Beginner
1. ✅ Use export button - saves .json file
2. ✅ Use import button - loads .json file
3. ✅ Keep backups in a folder

### Intermediate  
1. ✅ Organize backups by date
2. ✅ Store in git repository
3. ✅ Understand JSON structure
4. ✅ Share between users

### Advanced
1. ✅ Manually edit JSON
2. ✅ Validate with JSON tools
3. ✅ Automate backups
4. ✅ Custom import scripts

## ✨ Best Practices

### ✅ Do These
- [x] Export at end of each day
- [x] Keep backups for 30+ days
- [x] Store in version control
- [x] Test imports occasionally
- [x] Name files with dates
- [x] Keep organized folders

### ❌ Don't Do These
- [ ] Edit JSON manually (unless advanced)
- [ ] Store only on device (back it up!)
- [ ] Forget to export before upgrades
- [ ] Mix different inventory files
- [ ] Share without checking content
- [ ] Delete backup without testing

## 🆘 Emergency Recovery

### Data Loss Scenario
```
OH NO! All data in app is gone!

Step 1: Check backups
  └─ Do you have exported JSON files?
     
Step 2: If YES
  ├─ Open app
  ├─ Click "📤 Import JSON"
  ├─ Select latest backup
  └─ ✅ Data restored!
  
Step 3: If NO
  ├─ Go to localStorage
  ├─ In DevTools → Application → Storage
  ├─ Look for 'inventrobil_inventory'
  ├─ Copy data
  └─ Manually recreate (last resort)
```

---

**Pro Tip**: Export before any major changes. Always have backups! 💾
