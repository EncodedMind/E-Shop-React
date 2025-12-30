import React, { useEffect, useMemo, useState } from "react";

const RemoveProductFromCart = () => {
    const [cart, setCart] = useState([]);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedTitle, setSelectedTitle] = useState("");
    const [message, setMessage] = useState("");
    const [messageType, setMessageType] = useState(""); // "error" | "success"

    useEffect(() => {
        const fetchData = async () => {
            const user = localStorage.getItem("currentUser");
            if (!user) return;
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

    const handleRemoveProduct = async (e) => {
        e.preventDefault();
        setMessage("");
        setMessageType("");

        if (!selectedTitle || !selectedCartItem) {
            setMessage("Please select a product from your cart.");
            setMessageType("error");
            return;
        }

        const cartItemQuantity = selectedCartItem.amount || 0;

        try {
            const prod = products.find((p) => p.title === selectedTitle);
            if (!prod) {
                setMessage("Product not found.");
                setMessageType("error");
                return;
            }

            const updatedAmount = (prod.amount || 0) + cartItemQuantity;
            const updateRes = await fetch(`http://localhost:4000/api/products/${encodeURIComponent(selectedTitle)}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ amount: updatedAmount }),
            });
            if (!updateRes.ok) {
                setMessage("Failed to update stock.");
                setMessageType("error");
                return;
            }
            const updatedProdPayload = await updateRes.json();

            const updatedCart = cart.filter((item) => item.title !== selectedTitle);
            const user = localStorage.getItem("currentUser");
            await fetch(`http://localhost:4000/api/cart/${encodeURIComponent(user)}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(updatedCart),
            });

            const updatedProducts = products.map((p) =>
                p.title === selectedTitle ? updatedProdPayload.product : p
            );
            setProducts(updatedProducts);
            setCart(updatedCart);

            setMessage("Product removed successfully!");
            setMessageType("success");
            setSelectedTitle("");
        } catch (err) {
            console.error(err);
            setMessage("Network error.");
            setMessageType("error");
        }
    };

    if (loading) {
        return (
            <div>
                <h2>Remove Product from Cart</h2>
                <p>Loading...</p>
            </div>
        );
    }

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