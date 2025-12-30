import React, { useEffect, useMemo, useState } from "react";

const ViewCart = () => {
    const [cart, setCart] = useState([]);
    const [hoveredIdx, setHoveredIdx] = useState(null);

    useEffect(() => {
        const fetchCart = async () => {
            const user = localStorage.getItem("currentUser");
            if (!user) return;
            try {
                const res = await fetch(`http://localhost:4000/api/cart/${encodeURIComponent(user)}`);
                const data = await res.json();
                setCart(data || []);
            } catch (err) {
                console.error(err);
            }
        };
        fetchCart();
    }, []);

    const cartTotal = useMemo(() => {
        return cart.reduce((sum, item) => {
            const itemTotal = (item.amount || 0) * (item.price || 0);
            return sum + itemTotal;
        }, 0);
    }, [cart]);

    if (cart.length === 0) {
        return (
            <div>
                <h3>View Cart</h3>
                <p>Your cart is empty.</p>
            </div>
        );
    }

    return (
        <div>
            <h2>View Cart</h2>
            <table style={{ marginTop: "15px", width: "100%", borderCollapse: "collapse" }}>
                <thead>
                    <tr style={{ backgroundColor: "#f0f0f0" }}>
                        <th style={{ border: "1px solid #ccc", padding: "8px" }}>Title</th>
                        <th style={{ border: "1px solid #ccc", padding: "8px" }}>Price per {cart[0]?.measurementType || "Unit"}</th>
                        <th style={{ border: "1px solid #ccc", padding: "8px" }}>Quantity</th>
                        <th style={{ border: "1px solid #ccc", padding: "8px" }}>Total Price</th>
                    </tr>
                </thead>
                <tbody>
                    {cart.map((item, idx) => {
                        const itemTotal = (item.amount || 0) * (item.price || 0);
                        return (
                            <tr key={idx}>
                                <td
                                    style={{ border: "1px solid #ccc", padding: "8px", position: "relative", cursor: "pointer" }}
                                    onMouseEnter={() => setHoveredIdx(idx)}
                                    onMouseLeave={() => setHoveredIdx(null)}
                                >
                                    {item.title}
                                    {hoveredIdx === idx && (
                                        <div
                                            style={{
                                                position: "absolute",
                                                top: "100%",
                                                left: "0",
                                                backgroundColor: "#fff",
                                                border: "1px solid #ccc",
                                                padding: "8px",
                                                borderRadius: "4px",
                                                zIndex: 10,
                                                minWidth: "200px",
                                                boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                                            }}
                                        >
                                            <strong>Description:</strong>
                                            <p style={{ margin: "4px 0 0 0", fontSize: "12px" }}>{item.description}</p>
                                        </div>
                                    )}
                                </td>
                                <td style={{ border: "1px solid #ccc", padding: "8px" }}>${item.price?.toFixed(2)}</td>
                                <td style={{ border: "1px solid #ccc", padding: "8px" }}>
                                    {item.amount} {item.measurementType}
                                </td>
                                <td style={{ border: "1px solid #ccc", padding: "8px" }}>${itemTotal.toFixed(2)}</td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>

            <div style={{ marginTop: "20px", textAlign: "right" }}>
                <h4>Cart Total: ${cartTotal.toFixed(2)}</h4>
            </div>
        </div>
    );
};

export default ViewCart;