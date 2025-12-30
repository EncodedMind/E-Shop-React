import React, { useState } from "react";
import AddProduct from "./admin/AddProduct";
import EditProduct from "./admin/EditProduct";
import RemoveProduct from "./admin/RemoveProduct";
import SearchProduct from "./admin/SearchProduct";
import UnavailableProducts from "./admin/UnavailableProducts";
import Top5Products from "./admin/Top5Products";
import Logout from "./admin/Logout";

const AdminPage = ({ onLogout, username }) => {

    const [action, setAction] = useState("menu");

    return (
        <div className="page-container">
            <div className="content-wrapper">
                <div className="container">
                    <div className="card">
                        <div className="card-header">
                            <h2>Admin Dashboard</h2>
                            <p className="text-secondary">Welcome back, <strong>{username}</strong>!</p>
                        </div>
                        <div className="card-body">
                            <div className="nav">
                                <button className={action === "add" ? "nav-button active" : "nav-button"} onClick={() => setAction("add")}>Add Product</button>
                                <button className={action === "edit" ? "nav-button active" : "nav-button"} onClick={() => setAction("edit")}>Edit Product</button>
                                <button className={action === "remove" ? "nav-button active" : "nav-button"} onClick={() => setAction("remove")}>Remove Product</button>
                                <button className={action === "search" ? "nav-button active" : "nav-button"} onClick={() => setAction("search")}>Search Product</button>
                                <button className={action === "unavailable" ? "nav-button active" : "nav-button"} onClick={() => setAction("unavailable")}>Unavailable Products</button>
                                <button className={action === "top5" ? "nav-button active" : "nav-button"} onClick={() => setAction("top5")}>Top 5 Products</button>
                                <button className="button-danger button-sm" onClick={() => setAction("logout")}>Logout</button>
                            </div>
                        </div>
                    </div>

                    <div className="mt-lg">
                        {action === "add" && <AddProduct />}
                        {action === "edit" && <EditProduct />}
                        {action === "remove" && <RemoveProduct />}
                        {action === "search" && <SearchProduct />}
                        {action === "unavailable" && <UnavailableProducts />}
                        {action === "top5" && <Top5Products />}
                        {action === "logout" && <Logout onLogout={onLogout} />}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminPage;