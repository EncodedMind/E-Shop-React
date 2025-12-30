import React, { useEffect, useMemo, useState } from "react";

const AddProductToCart = () => {
    const [products, setProducts] = useState([]);
    const [cart, setCart] = useState([]);
    const [selectedTitle, setSelectedTitle] = useState("");
    const [quantity, setQuantity] = useState("");
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
                const [prodRes, cartRes] = await Promise.all([
                    fetch("http://localhost:4000/api/products"),
                    fetch(`http://localhost:4000/api/cart/${encodeURIComponent(user)}`),
                ]);
                const prodData = await prodRes.json();
                const cartData = await cartRes.json();
                setProducts(prodData || []);
                setCart(cartData || []);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const selectedProduct = useMemo(
        () => products.find((p) => p.title === selectedTitle),
        [products, selectedTitle]
    );

    const handleAddToCart = async (e) => {
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

        const updatedCart = [...cart];
        const existingIdx = updatedCart.findIndex((item) => item.title === selectedTitle);

        if (existingIdx >= 0) {
            updatedCart[existingIdx] = {
                ...updatedCart[existingIdx],
                amount: updatedCart[existingIdx].amount + qtyNum,
            };
        } else {
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

        try {
            const newAmount = selectedProduct.amount - qtyNum;
            const prodRes = await fetch(`http://localhost:4000/api/products/${encodeURIComponent(selectedTitle)}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ amount: newAmount }),
            });
            if (!prodRes.ok) {
                setMessage("Failed to update stock.");
                setMessageType("error");
                return;
            }
            const updatedProdPayload = await prodRes.json();

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

            setMessage("Product added successfully!");
            setMessageType("success");
            setSelectedTitle("");
            setQuantity("");
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
                    <h2>Add Product to Cart</h2>
                </div>
                <div className="card-body">
                    <div className="loading">Loading...</div>
                </div>
            </div>
        );
    }

    return (
        <div className="card">
            <div className="card-header">
                <h2>Add Product to Cart</h2>
            </div>
            <div className="card-body">
                <form onSubmit={handleAddToCart}>
                    <div className="form-group">
                        <label>Select a product:</label>
                        <select
                            value={selectedTitle}
                            onChange={(e) => {
                                setSelectedTitle(e.target.value);
                                setMessage("");
                                setQuantity("");
                            }}
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
                        <div className="alert alert-info">
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
                        </div>
                    )}

                    {selectedProduct && Math.abs(selectedProduct.amount || 0) >= 1e-6 && (
                        <div className="form-group">
                            <label>Quantity to add:</label>
                            <input
                                type="number"
                                step={selectedProduct.measurementType === "Kg" ? "0.01" : "1"}
                                min={selectedProduct.measurementType === "Kg" ? "0.01" : "1"}
                                value={quantity}
                                onChange={(e) => setQuantity(e.target.value)}
                                placeholder="Enter quantity"
                            />
                        </div>
                    )}

                    <button type="submit" className="button button-primary" disabled={!selectedTitle}>
                        Add to Cart
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

export default AddProductToCart;