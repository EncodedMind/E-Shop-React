import React, { useEffect, useState } from "react";

const RemoveProduct = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedTitle, setSelectedTitle] = useState("");
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const res = await fetch("http://localhost:4000/api/products");
                const data = await res.json();
                setProducts(data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);

    const handleRemove = async (e) => {
        e.preventDefault();
        if (!selectedTitle) return;

        try {
            const res = await fetch(`http://localhost:4000/api/products/${encodeURIComponent(selectedTitle)}`, {
                method: "DELETE",
            });
            if (res.status === 404) {
                setSuccess(false);
                return;
            }
            if (!res.ok) {
                setSuccess(false);
                return;
            }
            const updated = products.filter(
                (p) => p.title?.trim().toLowerCase() !== selectedTitle.trim().toLowerCase()
            );
            setProducts(updated);
            setSuccess(true);
            setSelectedTitle("");
        } catch (err) {
            console.error(err);
            setSuccess(false);
        }
    };

    return (
        <div>
        <h2>Remove Product</h2>
        <p>Choose product title you wish to remove:</p>

        {loading ? (
            <p>Loading products...</p>
        ) : (
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
        )}

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