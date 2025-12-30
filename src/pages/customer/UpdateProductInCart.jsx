import React, { useState, useMemo } from "react";
import productsSeed from "../../data/products.json";

const loadCart = () => {
    const user = localStorage.getItem("currentUser");
    if (!user) return [];
    return JSON.parse(localStorage.getItem(`cart_${user}`) || "[]");
};

const loadProducts = () =>
    JSON.parse(localStorage.getItem("products") || JSON.stringify(productsSeed));

const saveProducts = (list) =>
    localStorage.setItem("products", JSON.stringify(list));

const saveCart = (cart) => {
    const user = localStorage.getItem("currentUser");
    if (!user) return;
    localStorage.setItem(`cart_${user}`, JSON.stringify(cart));
};

const UpdateProductInCart = () => {
    const [cart, setCart] = useState(loadCart);
    const [products, setProducts] = useState(loadProducts);
    const [selectedTitle, setSelectedTitle] = useState("");
    const [newQuantity, setNewQuantity] = useState("");
    const [message, setMessage] = useState("");
    const [messageType, setMessageType] = useState(""); // "error" | "success"

    const selectedCartItem = useMemo(
        () => cart.find((item) => item.title === selectedTitle),
        [cart, selectedTitle]
    );

    const selectedProduct = useMemo(
        () => products.find((p) => p.title === selectedTitle),
        [products, selectedTitle]
    );

    const handleUpdateProduct = (e) => {
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

        // Update products stock: newStock = oldStock - difference
        const updatedProducts = products.map((p) =>
            p.title === selectedTitle
                ? { ...p, amount: availableStockAmount - quantityDifference }
                : p
        );

        // Update cart item quantity
        const updatedCart = cart.map((item) =>
            item.title === selectedTitle
                ? { ...item, amount: newQtyNum }
                : item
        );

        // Save both
        setProducts(updatedProducts);
        saveProducts(updatedProducts);
        setCart(updatedCart);
        saveCart(updatedCart);

        // Success message
        setMessage("Product updated successfully!");
        setMessageType("success");
        setSelectedTitle("");
        setNewQuantity("");
    };

    if (cart.length === 0) {
        return (
            <div>
                <h2>Update Product in Cart</h2>
                <p>Your cart is empty.</p>
            </div>
        );
    }

    return (
        <div>
            <h2>Update Product in Cart</h2>
            <p>Select product to update:</p>

            <form onSubmit={handleUpdateProduct}>
                <div style={{ marginBottom: "15px" }}>
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
                    <div style={{ marginBottom: "15px" }}>
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

                        <label>
                            Enter new quantity:
                            <input
                                type="number"
                                step={selectedCartItem.measurementType === "Kg" ? "0.01" : "1"}
                                min={selectedCartItem.measurementType === "Kg" ? "0.01" : "1"}
                                value={newQuantity}
                                onChange={(e) => setNewQuantity(e.target.value)}
                                placeholder="Enter new quantity"
                                style={{ marginLeft: "10px" }}
                            />
                        </label>
                    </div>
                )}

                <button type="submit" disabled={!selectedTitle}>
                    Update Product
                </button>
            </form>

            {message && (
                <p
                    style={{
                        marginTop: "15px",
                        color: messageType === "error" ? "red" : "green",
                    }}
                >
                    {message}
                </p>
            )}
        </div>
    );
};

export default UpdateProductInCart;