import React, { useState, useMemo, useEffect } from "react";

const UpdateProductInCart = () => {
    const [cart, setCart] = useState([]);
    const [products, setProducts] = useState([]);
    const [selectedTitle, setSelectedTitle] = useState("");
    const [newQuantity, setNewQuantity] = useState("");
    const [message, setMessage] = useState("");
    const [messageType, setMessageType] = useState(""); // "error" | "success"
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            const user = localStorage.getItem("currentUser");
            if (!user) {
                setLoading(false);
                return;
            }
            try {
                const [cartRes, prodRes] = await Promise.all([
                    fetch(`http://localhost:4000/api/cart/${encodeURIComponent(user)}`),
                    fetch("http://localhost:4000/api/products"),
                ]);
                const cartData = await cartRes.json();
                const prodData = await prodRes.json();
                setCart(cartData || []);
                setProducts(prodData || []);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const selectedCartItem = useMemo(
        () => cart.find((item) => item.title === selectedTitle),
        [cart, selectedTitle]
    );

    const selectedProduct = useMemo(
        () => products.find((p) => p.title === selectedTitle),
        [products, selectedTitle]
    );

    const handleUpdateProduct = async (e) => {
        e.preventDefault();
        setMessage("");
        setMessageType("");

        if (!selectedTitle || !selectedCartItem) {
            setMessage("Please select a product from your cart.");
            setMessageType("error");
            return;
        }

        const newQtyNum = parseFloat(newQuantity);

        if (isNaN(newQtyNum) || newQtyNum <= 0) {
            setMessage("Please enter a valid quantity.");
            setMessageType("error");
            return;
        }

        const oldQtyNum = selectedCartItem.amount || 0;
        const quantityDifference = newQtyNum - oldQtyNum;
        const availableStockAmount = selectedProduct?.amount || 0;

        // Check if we need more stock than available
        if (quantityDifference > availableStockAmount) {
            setMessage("Product currently unavailable.");
            setMessageType("error");
            return;
        }

        const newStock = availableStockAmount - quantityDifference;
        try {
            const prodRes = await fetch(`http://localhost:4000/api/products/${encodeURIComponent(selectedTitle)}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ amount: newStock }),
            });
            if (!prodRes.ok) {
                setMessage("Failed to update stock.");
                setMessageType("error");
                return;
            }
            const updatedProdPayload = await prodRes.json();

            const updatedCart = cart.map((item) =>
                item.title === selectedTitle
                    ? { ...item, amount: newQtyNum }
                    : item
            );
            const user = localStorage.getItem("currentUser");
            await fetch(`http://localhost:4000/api/cart/${encodeURIComponent(user)}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(updatedCart),
            });

            setProducts(
                products.map((p) =>
                    p.title === selectedTitle ? updatedProdPayload.product : p
                )
            );
            setCart(updatedCart);

            setMessage("Product updated successfully!");
            setMessageType("success");
            setSelectedTitle("");
            setNewQuantity("");
        } catch (err) {
            console.error(err);
            setMessage("Network error.");
            setMessageType("error");
        }
    };

    if (loading) {
        return (
            <div className="card">
                <div className="card-header">
                    <h2>Update Product in Cart</h2>
                </div>
                <div className="card-body">
                    <div className="loading">Loading...</div>
                </div>
            </div>
        );
    }

    if (cart.length === 0) {
        return (
            <div className="card">
                <div className="card-header">
                    <h2>Update Product in Cart</h2>
                </div>
                <div className="card-body">
                    <div className="alert alert-info">Your cart is empty.</div>
                </div>
            </div>
        );
    }

    return (
        <div className="card">
            <div className="card-header">
                <h2>Update Product in Cart</h2>
                <p>Select product to update:</p>
            </div>
            <div className="card-body">
                <form onSubmit={handleUpdateProduct}>
                    <div className="form-group">
                        <label>Select product:</label>
                        <select
                            value={selectedTitle}
                            onChange={(e) => {
                                const title = e.target.value;
                                setSelectedTitle(title);
                                setMessage("");
                                const item = cart.find((i) => i.title === title);
                                setNewQuantity(item ? item.amount.toString() : "");
                            }}
                        >
                            <option value="">Choose a product</option>
                            {cart.map((item) => (
                                <option key={item.title} value={item.title}>
                                    {item.title} (Current: {item.amount} {item.measurementType})
                                </option>
                            ))}
                        </select>
                    </div>

                    {selectedCartItem && selectedProduct && (
                        <div className="alert alert-info">
                            <p>
                                <strong>Product:</strong> {selectedCartItem.title}
                            </p>
                            <p>
                                <strong>Current Quantity:</strong> {selectedCartItem.amount}{" "}
                                {selectedCartItem.measurementType}
                            </p>
                            <p>
                                <strong>Available in Stock:</strong> {selectedProduct.amount}{" "}
                                {selectedProduct.measurementType}
                            </p>
                        </div>
                    )}

                    {selectedCartItem && selectedProduct && (
                        <div className="form-group">
                            <label>Enter new quantity:</label>
                            <input
                                type="number"
                                step={selectedCartItem.measurementType === "Kg" ? "0.01" : "1"}
                                min={selectedCartItem.measurementType === "Kg" ? "0.01" : "1"}
                                value={newQuantity}
                                onChange={(e) => setNewQuantity(e.target.value)}
                                placeholder="Enter new quantity"
                            />
                        </div>
                    )}

                    <button type="submit" className="button button-primary" disabled={!selectedTitle}>
                        Update Product
                    </button>
                </form>

                {message && (
                    <div className={`alert ${messageType === "error" ? "alert-error" : "alert-success"}`}>
                        {message}
                    </div>
                )}
            </div>
        </div>
    );
};

export default UpdateProductInCart;