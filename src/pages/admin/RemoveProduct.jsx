import React, { useState } from "react";
import productsSeed from "../../data/products.json";

const loadProducts = () => JSON.parse(localStorage.getItem("products") || JSON.stringify(productsSeed));

const saveProducts = (list) => localStorage.setItem("products", JSON.stringify(list));

const RemoveProduct = () => {
    const [products, setProducts] = useState(loadProducts);
    const [selectedTitle, setSelectedTitle] = useState("");
    const [success, setSuccess] = useState(false);

    const handleRemove = (e) => {
        e.preventDefault();
        if (!selectedTitle) return;

        const updated = products.filter(
        (p) => p.title?.trim().toLowerCase() !== selectedTitle.trim().toLowerCase()
        );

        setProducts(updated);
        saveProducts(updated);
        setSuccess(true);
        setSelectedTitle("");
    };

    return (
        <div>
        <h2>Remove Product</h2>
        <p>Choose product title you wish to remove:</p>

        <select
            value={selectedTitle}
            onChange={(e) => {
            setSelectedTitle(e.target.value);
            setSuccess(false);
            }}
        >
            <option value="" disabled>
                Select a product to remove
            </option>
            {products.map((p) => (
            <option key={p.title} value={p.title}>
                {p.title}
            </option>
            ))}
        </select>

        {selectedTitle && (
            <form onSubmit={handleRemove} style={{ marginTop: "10px" }}>
            <button type="submit">Remove Product</button>
            </form>
        )}

        {success && <p style={{ color: "green" }}>Product removed!</p>}
        </div>
    );
};

export default RemoveProduct;