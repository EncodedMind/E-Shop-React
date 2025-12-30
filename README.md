# E-Shop React Application

A modern, full-stack e-commerce web application built with **React (Vite)** and **Express.js**, featuring admin and customer functionality with an intelligent discount system.

## Table of Contents
- [Features](#features)
- [Project Structure](#project-structure)
- [Tech Stack](#tech-stack)
- [Quick Start](#quick-start)

---

## Features

### For Administrators
- Add new products with full details
- Edit product attributes
- Remove products from the store
- Search products by title, category, or view all
- View unavailable products (out of stock)
- View top 5 most frequently ordered products

### For Customers
- Search products by title, category, or view all
- Add products to shopping cart
- Update product quantities in cart
- Remove products from cart
- Complete orders with automatic discount calculation
- View complete order history with itemized details
- Eligible for dynamic discounts based on purchase patterns

---

## Project Structure

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

## Tech Stack

**Frontend:**
- React 18.x
- Vite (fast development server)
- Modern JavaScript (ES6+)

**Backend:**
- Node.js
- Express.js
- JSON file-based storage

---

## Quick Start

### Option 1: Automated Startup (Recommended)
```bash
cd e-shop-react-app
./start-app.sh
```
This script will:
- Check for Node.js and npm
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

## Discount System

The e-shop features a discount system that rewards customer loyalty:

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
