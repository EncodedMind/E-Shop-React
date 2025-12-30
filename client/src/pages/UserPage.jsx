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
        <div className="page-container">
            <div className="content-wrapper">
                <div className="container">
                    <div className="card">
                        <div className="card-header">
                            <h2>Customer Dashboard</h2>
                            <p className="text-secondary">Welcome back, <strong>{username}</strong>!</p>
                        </div>
                        <div className="card-body">
                            <div className="nav">
                                <button className={action === "search" ? "nav-button active" : "nav-button"} onClick={() => setAction("search")}>Search Product</button>
                                <button className={action === "add" ? "nav-button active" : "nav-button"} onClick={() => setAction("add")}>Add to Cart</button>
                                <button className={action === "update" ? "nav-button active" : "nav-button"} onClick={() => setAction("update")}>Update Cart</button>
                                <button className={action === "remove" ? "nav-button active" : "nav-button"} onClick={() => setAction("remove")}>Remove from Cart</button>
                                <button className={action === "cart" ? "nav-button active" : "nav-button"} onClick={() => setAction("cart")}>View Cart</button>
                                <button className={action === "complete" ? "nav-button active" : "nav-button"} onClick={() => setAction("complete")}>Complete Order</button>
                                <button className={action === "orderhistory" ? "nav-button active" : "nav-button"} onClick={() => setAction("orderhistory")}>Order History</button>
                                <button className="button-danger button-sm" onClick={() => setAction("logout")}>Logout</button>
                            </div>
                        </div>
                    </div>

                    <div className="mt-lg">
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
            </div>
        </div>
    );
};

export default UserPage;