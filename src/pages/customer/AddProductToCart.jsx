import React, { useState, useMemo } from "react";
import productsSeed from "../../data/products.json";

const loadProducts = () =>
    JSON.parse(localStorage.getItem("products") || JSON.stringify(productsSeed));

const loadCart = () => {
    const user = localStorage.getItem("currentUser");
    if (!user) return [];
    return JSON.parse(localStorage.getItem(`cart_${user}`) || "[]");
};

const saveProducts = (list) =>
    localStorage.setItem("products", JSON.stringify(list));

const saveCart = (cart) => {
    const user = localStorage.getItem("currentUser");
    if (!user) return;
    localStorage.setItem(`cart_${user}`, JSON.stringify(cart));
};

const AddProductToCart = () => {
    const [products, setProducts] = useState(loadProducts);
    const [cart, setCart] = useState(loadCart);
    const [selectedTitle, setSelectedTitle] = useState("");
    const [quantity, setQuantity] = useState("");
    const [message, setMessage] = useState("");
    const [messageType, setMessageType] = useState(""); // "error" | "success"

    const selectedProduct = useMemo(
        () => products.find((p) => p.title === selectedTitle),
        [products, selectedTitle]
    );

    const handleAddToCart = (e) => {
        e.preventDefault();
        setMessage("");
        setMessageType("");

        if (!selectedTitle || !selectedProduct) {
            setMessage("Please select a product.");
            setMessageType("error");
            return;
        }

        const qtyNum = parseFloat(quantity);

        if (isNaN(qtyNum) || qtyNum <= 0) {
            setMessage("Please enter a valid quantity.");
            setMessageType("error");
            return;
        }

        const availableAmount = Number(selectedProduct.amount) || 0;
        if (qtyNum > availableAmount) {
            setMessage(`Quantity not available. Current quantity: ${availableAmount}`);
            setMessageType("error");
            return;
        }

        // Success: add/update product in cart
        const updatedCart = [...cart];
        const existingIdx = updatedCart.findIndex((item) => item.title === selectedTitle);

        if (existingIdx >= 0) {
            // Product exists in cart: increase amount
            updatedCart[existingIdx] = {
                ...updatedCart[existingIdx],
                amount: updatedCart[existingIdx].amount + qtyNum,
            };
        } else {
            // Product not in cart: add it with all details
            updatedCart.push({
                title: selectedProduct.title,
                description: selectedProduct.description,
                category: selectedProduct.category,
                subcategory: selectedProduct.subcategory,
                price: selectedProduct.price,
                measurementType: selectedProduct.measurementType,
                amount: qtyNum,
            });
        }

        // Update cart in localStorage
        setCart(updatedCart);
        saveCart(updatedCart);

        // Reduce product stock in products
        const updatedProducts = products.map((p) =>
            p.title === selectedTitle
                ? { ...p, amount: p.amount - qtyNum }
                : p
        );
        setProducts(updatedProducts);
        saveProducts(updatedProducts);

        // Success message
        setMessage("Product added successfully!");
        setMessageType("success");
        setSelectedTitle("");
        setQuantity("");
    };

    return (
        <div>
            <h2>Add Product to Cart</h2>

            <form onSubmit={handleAddToCart}>
                <div style={{ marginBottom: "15px" }}>
                    <label>Select a product:</label>
                    <select
                        value={selectedTitle}
                        onChange={(e) => {
                            setSelectedTitle(e.target.value);
                            setMessage("");
                            setQuantity("");
                        }}
                        style={{ marginLeft: "10px" }}
                    >
                        <option value="">Choose a product</option>
                        {products.map((p) => {
                            const isUnavailable = Math.abs(p.amount || 0) < 1e-6;
                            return (
                                <option
                                    key={p.title}
                                    value={p.title}
                                    disabled={isUnavailable}
                                    title={isUnavailable ? "Product currently unavailable" : ""}
                                >
                                    {p.title} {isUnavailable ? "(Unavailable)" : ""}
                                </option>
                            );
                        })}
                    </select>
                </div>

                {selectedProduct && Math.abs(selectedProduct.amount || 0) >= 1e-6 && (
                    <div style={{ marginBottom: "15px" }}>
                        <p>
                            <strong>Product:</strong> {selectedProduct.title}
                        </p>
                        <p>
                            <strong>Price:</strong> ${selectedProduct.price}
                        </p>
                        <p>
                            <strong>Available Quantity:</strong>{" "}
                            {selectedProduct.amount} {selectedProduct.measurementType}
                        </p>

                        <label>
                            Quantity to add:
                            <input
                                type="number"
                                step={selectedProduct.measurementType === "Kg" ? "0.01" : "1"}
                                min={selectedProduct.measurementType === "Kg" ? "0.01" : "1"}
                                value={quantity}
                                onChange={(e) => setQuantity(e.target.value)}
                                placeholder="Enter quantity"
                                style={{ marginLeft: "10px" }}
                            />
                        </label>
                    </div>
                )}

                <button type="submit" disabled={!selectedTitle}>
                    Add to Cart
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

export default AddProductToCart;