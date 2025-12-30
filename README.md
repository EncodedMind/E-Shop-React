# E-Shop React Application

A modern, full-stack e-commerce web application built with **React (Vite)** and **Express.js**, featuring admin and customer functionality with an intelligent discount system.

## 📋 Table of Contents
- [Features](#features)
- [Project Structure](#project-structure)
- [Tech Stack](#tech-stack)
- [Quick Start](#quick-start)
- [Administrator Functions](#administrator-functions)
- [Customer Functions](#customer-functions)
- [Discount System](#discount-system)
- [API Endpoints](#api-endpoints)

---

## ✨ Features

### For Administrators
- ✅ Add new products with full details
- ✅ Edit product attributes (title, description, price, quantity, category, subcategory)
- ✅ Remove products from the store
- ✅ Search products by title or category
- ✅ View unavailable products (out of stock)
- ✅ View top 5 most frequently ordered products

### For Customers
- ✅ Search products by title, category, or view all
- ✅ Add products to shopping cart
- ✅ Update product quantities in cart
- ✅ Remove products from cart
- ✅ Complete orders with automatic discount calculation
- ✅ View complete order history with itemized details
- ✅ Eligible for dynamic discounts based on purchase patterns

---

## 📁 Project Structure

```
e-shop-react-app/
├── client/                          # React (Vite) Frontend
│   ├── src/
│   │   ├── pages/
│   │   │   ├── AdminPage.jsx        # Admin dashboard
│   │   │   ├── Home.jsx             # Welcome page
│   │   │   ├── Login.jsx            # Login/Register page
│   │   │   ├── UserPage.jsx         # Customer dashboard
│   │   │   ├── admin/               # Admin sub-pages
│   │   │   │   ├── AddProduct.jsx
│   │   │   │   ├── EditProduct.jsx
│   │   │   │   ├── RemoveProduct.jsx
│   │   │   │   ├── SearchProduct.jsx
│   │   │   │   ├── Top5Products.jsx
│   │   │   │   └── UnavailableProducts.jsx
│   │   │   └── customer/            # Customer sub-pages
│   │   │       ├── AddProductToCart.jsx
│   │   │       ├── CompleteOrder.jsx
│   │   │       ├── RemoveProductFromCart.jsx
│   │   │       ├── SearchProduct.jsx
│   │   │       ├── UpdateProductInCart.jsx
│   │   │       ├── ViewCart.jsx
│   │   │       └── ViewOrderHistory.jsx
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── package.json
│   └── vite.config.js
│
├── server/                          # Node.js + Express Backend
│   ├── src/
│   │   ├── routes/
│   │   │   ├── users.js             # User authentication
│   │   │   ├── products.js          # Product CRUD
│   │   │   ├── orders.js            # Order management
│   │   │   ├── cart.js              # Shopping cart
│   │   │   ├── productOrders.js     # Product order tracking
│   │   │   ├── discountUsage.js     # Discount tracking
│   │   │   ├── health.js            # Health check
│   │   └── index.js                 # Express app setup
│   ├── data/
│   │   ├── users.json               # User accounts
│   │   ├── products.json            # Product catalog
│   │   ├── categories.json          # Product categories
│   │   ├── discounts.json           # Discount thresholds
│   │   ├── product_orders.json      # Order frequency tracking
│   │   ├── cart/                    # User shopping carts
│   │   ├── discount_usage/          # User discount tracking
│   │   └── order_history/           # User order histories
│   ├── package.json
│   └── .env                         # Environment variables
│
├── start-app.sh                     # One-command startup script
└── README.md                        # This file
```

---

## 🛠 Tech Stack

**Frontend:**
- React 18.x
- Vite (fast development server)
- Modern JavaScript (ES6+)

**Backend:**
- Node.js
- Express.js
- JSON file-based storage

**Features:**
- RESTful API architecture
- Per-user data isolation
- Real-time cart & order management

---

## 🚀 Quick Start

### Option 1: Automated Startup (Recommended)
```bash
cd e-shop-react-app
./start-app.sh
```
This script will:
- Check for Node.js and npm
- Install dependencies (if needed)
- Start backend on `http://localhost:4000`
- Start frontend on `http://localhost:5173`

### Option 2: Manual Startup

**Terminal 1 - Backend:**
```bash
cd server
npm install
npm start
```

**Terminal 2 - Frontend:**
```bash
cd client
npm install
npm start
```

The app will open at `http://localhost:5173`

---

## 👨‍💼 Administrator Functions

Administrators can access the following features from the Admin Dashboard:

### 1. Add Product
Administrators can add new products by providing:
- Product title
- Description
- Category and subcategory
- Price
- Initial quantity
- Measurement type (e.g., Kg, pieces, liters)

### 2. Edit Product
Modify any attribute of existing products:
- Title
- Description
- Price
- Quantity
- Category/Subcategory

The administrator selects the attribute they want to modify. The system creates a copy of the existing product, changes the selected attribute, removes the old product, and adds the updated version.

### 3. Remove Product
Delete products from the catalog (removes from inventory completely).

### 4. Search Products
Search by:
- Product title (exact match)
- Category (view all products in a category)
- View all products in the store

### 5. View Unavailable Products
Display all products with zero or near-zero quantity in stock, helping administrators identify items that need restocking.

### 6. View Top 5 Products
See the 5 most frequently ordered products ranked by order frequency, not quantity. This helps identify best-sellers and popular items.

---

## 👤 Customer Functions

Customers have access to the following features:

### 1. Search Products
Find products by:
- Product title
- Category
- View entire catalog

### 2. Add Products to Cart
Add desired products to shopping cart with:
- Automatic stock availability validation
- Quantity selection
- Real-time stock updates
- Support for duplicate products (increments quantity instead of adding duplicate entry)

### 3. Update Cart Quantity
Modify the quantity of items already in the cart:
- Increase or decrease quantity
- Automatic validation against available stock
- Error messages if requested quantity exceeds available stock

### 4. Remove from Cart
Remove unwanted products from the shopping cart and restore their stock.

### 5. Complete Order
Place orders with:
- Automatic discount calculation based on purchase history
- Itemized receipt with applied discounts
- Order total display
- Cart is automatically cleared after successful order
- Order history is updated immediately

### 6. View Order History
Access complete order history including:
- Order date and ID
- Items in each order with quantities and prices
- Total cost per order with discounts applied
- Historical pricing information

---

## 💰 Discount System

The e-shop features an intelligent, multi-tiered discount system that rewards customer loyalty:

### 1. **Product Loyalty Discount (10% off)**

**Trigger:** Customer purchases the same product in 3 **consecutive** orders

**How it works:**
- System tracks order history for each product
- If a product appears in the last 3 orders consecutively, customer gets 10% discount on that product in their next eligible order
- Discount is automatically applied during checkout
- Can only be used once per product, then resets

**Example:**
```
Order 1: Buy Tomato ✓
Order 2: Buy Tomato ✓
Order 3: Buy Tomato ✓
Order 4: Tomato qualifies for 10% discount! ✓
         Next purchase of Tomato won't have this discount
```

### 2. **Category Bulk Purchase Discount (5% off)**

**Trigger:** Customer buys ≥ minimum quantity of a category in one order

**How it works:**
- Each category has a minimum purchase quantity threshold defined in `discounts.json` (e.g., Food: 5 units)
- If the customer meets the threshold in their current cart for a category, they get 5% off all items in that category
- Discount applies only to that order for items meeting the threshold
- Can only be used once per category, then resets

**Example:**
```
Current Order: Buy 7 units of vegetables (threshold: 5)
→ All vegetable items get 5% discount in this order! ✓
→ Discount is marked as used
```

### 3. **Favorite Product Discount (15% off)**

**Trigger:** Customer has 5+ completed orders and buys their most-purchased product

**How it works:**
- System analyzes all past orders to find the customer's favorite product (highest total quantity purchased)
- Only customers with 5+ completed orders become eligible
- 15% discount applies to their favorite product when purchased
- Can only be used **once in the customer's lifetime**, then becomes unavailable forever
- The favorite product is recalculated based on cumulative purchases across all orders

**Favorite Product Calculation:**
```
Total products purchased across all orders:
- Tomato: 45 units
- Lettuce: 20 units
- Carrot: 15 units

→ Tomato is the favorite product (45 > 20 > 15)
→ Customer becomes eligible for 15% off on Tomato (one time only)
```

### Discount Application Rules

- **One per item:** During checkout, if multiple discounts apply to a single item, **one is randomly selected**
- **Tracking:** Each discount has usage tracking to prevent reuse
- **Eligibility display:** Applied discounts are shown in the order review before confirmation
- **Persistence:** Used discounts are marked as consumed and won't apply again
- **Order matters:** Discounts are checked in the order: Product Loyalty → Category Bulk → Favorite Product

---

## 🔌 API Endpoints

### Health Check
```
GET /api/health
```
Returns server status.

### Products
```
GET /api/products                    # Get all products
GET /api/products/categories         # Get all categories
GET /api/products/discounts          # Get discount thresholds
POST /api/products                   # Add product (admin)
PUT /api/products/:title             # Update product (admin)
DELETE /api/products/:title          # Delete product (admin)
```

### Users
```
GET /api/users                       # Get all users
POST /api/users                      # Register/Login
```

### Orders
```
GET /api/orders/:username            # Get user's order history
POST /api/orders/:username           # Create new order
```

### Shopping Cart
```
GET /api/cart/:username              # Get user's cart
PUT /api/cart/:username              # Update user's cart
```

### Product Orders (Tracking)
```
GET /api/product-orders              # Get all order counts
POST /api/product-orders/increment   # Increment product order count
```

### Discount Usage
```
GET /api/discount-usage/:username    # Get user's discount tracking
PUT /api/discount-usage/:username    # Update discount usage
```

---

## 📝 Data Models

### User
```json
{
  "username": "user1",
  "password": "hashed_password",
  "role": "customer" | "admin"
}
```

### Product
```json
{
  "title": "Tomato",
  "description": "A healthy vegetable",
  "category": "Food",
  "subcategory": "Vegetable",
  "price": 2.50,
  "quantity": 100,
  "measurementType": "Kg"
}
```

### Order
```json
{
  "id": 1767114456950,
  "date": "2025-12-30T17:07:36.950Z",
  "items": [
    {
      "title": "Tomato",
      "amount": 10,
      "price": 2.50,
      "category": "Food"
    }
  ],
  "totalCost": 25.00
}
```

### Discount Usage
```json
{
  "usedProductDiscounts": ["Tomato", "Carrot"],
  "usedCategoryDiscounts": ["Food"],
  "favoriteDiscountUsed": true
}
```

---

## 🔐 Authentication

The app uses simple username/password authentication:
- **Login:** Existing users can log in with credentials
- **Register:** New users can create an account
- **Role Assignment:** Users specify their role during registration (Admin/Customer)
- **Session:** Username stored in `localStorage` for active session
- **Logout:** Users can log out and switch accounts

---

## 📂 Sample Data

The `server/data/` directory includes sample data to get started:
- 3 sample users (user1, user2, user3) for testing
- Pre-loaded products with categories and subcategories
- Discount thresholds configured per category
- Sample order history for demonstration

To reset the data, simply delete files in `server/data/` and restart the server.

---

## 🐛 Troubleshooting

**Port 4000 or 5173 already in use?**
```bash
# The start-app.sh script will automatically kill existing processes
# Or manually find and kill the process:
lsof -ti:4000 | xargs kill -9
lsof -ti:5173 | xargs kill -9
```

**Dependencies not installing?**
```bash
# Clear npm cache and try again
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

**Backend not connecting?**
- Ensure backend is running on port 4000
- Check server console for errors
- Verify API URLs in client code use `http://localhost:4000`
- Check if the health endpoint responds: `curl http://localhost:4000/api/health`

**CORS Issues?**
- Backend should be configured to accept requests from `http://localhost:5173`
- Check Express CORS middleware settings in `server/src/index.js`

---

## 📄 License

MIT