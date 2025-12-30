# E-Shop React Application

This project is a React-based e-shop application that implements various functionalities for managing products, users, orders, and more. The application is structured to maintain a clear separation of concerns, with components and files organized logically.

## Project Structure

```
e-shop-react-app
├── public
│   └── index.html
├── files
│   ├── categories.txt
│   ├── discounts.txt
│   ├── products.txt
│   └── users.txt
├── include
│   ├── Administrator.h
│   ├── Cart.h
│   ├── Customer.h
│   ├── Eshop.h
│   ├── General.h
│   ├── Order.h
│   ├── Product.h
│   └── User.h
├── samples
│   ├── sample_admin_1.txt
│   ├── sample_admin_2.txt
│   ├── sample_admin_3.txt
│   ├── sample_customer_1.txt
│   ├── sample_customer_2.txt
│   └── sample_customer_3.txt
├── src
│   ├── main.jsx
│   ├── App.jsx
│   ├── index.css
│   ├── components
│   │   ├── Administrator.jsx
│   │   ├── Cart.jsx
│   │   ├── Customer.jsx
│   │   ├── Eshop.jsx
│   │   ├── General.jsx
│   │   ├── Order.jsx
│   │   ├── Product.jsx
│   │   └── User.jsx
│   └── include_jsx
│       ├── Administrator_h.jsx
│       ├── Cart_h.jsx
│       ├── Customer_h.jsx
│       ├── Eshop_h.jsx
│       ├── General_h.jsx
│       ├── Order_h.jsx
│       ├── Product_h.jsx
│       └── User_h.jsx
├── package.json
├── vite.config.js
├── .gitignore
└── README.md
```

## Features

- **User Management**: Admins can manage users, including adding, removing, and updating user information.
- **Product Management**: Admins can manage products, including adding, removing, and updating product details.
- **Order Processing**: Users can place orders, and admins can view and manage order history.
- **Discounts and Categories**: The application supports discounts and categorization of products for better organization.

## Getting Started

1. Clone the repository:
   ```
   git clone <repository-url>
   ```

2. Navigate to the project directory:
   ```
   cd e-shop-react-app
   ```

3. Install dependencies:
   ```
   npm install
   ```

4. Start the development server:
   ```
   npm run dev
   ```

5. Open your browser and go to `http://localhost:3000` to view the application.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any improvements or bug fixes.

## License

This project is licensed under the MIT License. See the LICENSE file for details.