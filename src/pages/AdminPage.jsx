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
        <div>
            <h2>Welcome {username}!</h2>

            <div>
                <button onClick={() => setAction("add")}>Add Product</button>
                <button onClick={() => setAction("edit")}>Edit Product</button>
                <button onClick={() => setAction("remove")}>Remove Product</button>
                <button onClick={() => setAction("search")}>Search Product</button>
                <button onClick={() => setAction("unavailable")}>Unavailable Products</button>
                <button onClick={() => setAction("top5")}>Top 5 Products</button>
                <button onClick={() => setAction("logout")}>Logout</button>
            </div>

            <div>
                {action === "add" && <AddProduct />}
                {action === "edit" && <EditProduct />}
                {action === "remove" && <RemoveProduct />}
                {action === "search" && <SearchProduct />}
                {action === "unavailable" && <UnavailableProducts />}
                {action === "top5" && <Top5Products />}
                {action === "logout" && <Logout onLogout={onLogout} />}
            </div>
        </div>
    );
};

export default AdminPage;