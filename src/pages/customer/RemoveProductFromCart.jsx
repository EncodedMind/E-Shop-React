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

const RemoveProductFromCart = () => {
    const [cart, setCart] = useState(loadCart);
    const [products, setProducts] = useState(loadProducts);
    const [selectedTitle, setSelectedTitle] = useState("");
    const [message, setMessage] = useState("");
    const [messageType, setMessageType] = useState(""); // "error" | "success"

    const selectedCartItem = useMemo(
        () => cart.find((item) => item.title === selectedTitle),
        [cart, selectedTitle]
    );

    const handleRemoveProduct = (e) => {
        e.preventDefault();
        setMessage("");
        setMessageType("");

        if (!selectedTitle || !selectedCartItem) {
            setMessage("Please select a product from your cart.");
            setMessageType("error");
            return;
        }

        const cartItemQuantity = selectedCartItem.amount || 0;

        // Return product quantity back to products
        const updatedProducts = products.map((p) =>
            p.title === selectedTitle
                ? { ...p, amount: (p.amount || 0) + cartItemQuantity }
                : p
        );

        // Remove product from cart
        const updatedCart = cart.filter((item) => item.title !== selectedTitle);

        // Save both
        setProducts(updatedProducts);
        saveProducts(updatedProducts);
        setCart(updatedCart);
        saveCart(updatedCart);

        // Success message
        setMessage("Product removed successfully!");
        setMessageType("success");
        setSelectedTitle("");
    };

    if (cart.length === 0) {
        return (
            <div>
                <h2>Remove Product from Cart</h2>
                <p>Your cart is empty.</p>
            </div>
        );
    }

    return (
        <div>
            <h2>Remove Product from Cart</h2>
            <p>Select product you would like to remove:</p>

            <form onSubmit={handleRemoveProduct}>
                <div style={{ marginBottom: "15px" }}>
                    <select
                        value={selectedTitle}
                        onChange={(e) => {
                            setSelectedTitle(e.target.value);
                            setMessage("");
                        }}
                    >
                        <option value="">Choose a product</option>
                        {cart.map((item) => (
                            <option key={item.title} value={item.title}>
                                {item.title} ({item.amount} {item.measurementType})
                            </option>
                        ))}
                    </select>
                </div>

                <button type="submit" disabled={!selectedTitle}>
                    Remove Product
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

export default RemoveProductFromCart;