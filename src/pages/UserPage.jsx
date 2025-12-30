import React, { useState } from "react";
import SearchProduct from "./customer/SearchProduct";
import AddProductToCart from "./customer/AddProductToCart";
import UpdateProductInCart from "./customer/UpdateProductInCart";
import RemoveProductFromCart from "./customer/RemoveProductFromCart";
import CompleteOrder from "./customer/CompleteOrder";
import ViewOrderHistory from "./customer/ViewOrderHistory";
import ViewCart from "./customer/ViewCart";
import Logout from "./customer/Logout";

const UserPage = ({ onLogout, username }) => {

    const [action, setAction] = useState("menu");

    return (
        <div>
            <h2>Welcome {username}!</h2>

            <div>
                <button onClick={() => setAction("search")}>Search Product</button>
                <button onClick={() => setAction("add")}>Add Product to Cart</button>
                <button onClick={() => setAction("update")}>Update Product in Cart</button>
                <button onClick={() => setAction("remove")}>Remove Product from Cart</button>
                <button onClick={() => setAction("complete")}>Complete Order</button>
                <button onClick={() => setAction("orderhistory")}>View Order History</button>
                <button onClick={() => setAction("cart")}>View Cart</button>
                <button onClick={() => setAction("logout")}>Logout</button>
            </div>

            <div>
                {action === "search" && <SearchProduct />}
                {action === "add" && <AddProductToCart />}
                {action === "update" && <UpdateProductInCart />}
                {action === "remove" && <RemoveProductFromCart />}
                {action === "complete" && <CompleteOrder />}
                {action === "orderhistory" && <ViewOrderHistory />}
                {action === "cart" && <ViewCart />}
                {action === "logout" && <Logout onLogout={onLogout} />}
            </div>
        </div>
    );
};

export default UserPage;