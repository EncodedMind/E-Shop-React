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
            <div className="card">
                <div className="card-header">
                    <h2>View Cart</h2>
                </div>
                <div className="card-body text-center">
                    <p className="text-secondary">Your cart is empty.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="card">
            <div className="card-header">
                <h2>Your Shopping Cart</h2>
                <p className="text-secondary">{cart.length} item(s) in your cart</p>
            </div>
            <div className="card-body">
                <table>
                    <thead>
                        <tr>
                            <th>Title</th>
                            <th>Price per Unit</th>
                            <th>Quantity</th>
                            <th>Total Price</th>
                        </tr>
                    </thead>
                    <tbody>
                        {cart.map((item, idx) => {
                            const itemTotal = (item.amount || 0) * (item.price || 0);
                            return (
                                <tr key={idx}>
                                    <td
                                        style={{ position: "relative", cursor: "pointer" }}
                                        onMouseEnter={() => setHoveredIdx(idx)}
                                        onMouseLeave={() => setHoveredIdx(null)}
                                    >
                                        <strong>{item.title}</strong>
                                        {hoveredIdx === idx && (
                                            <div
                                                style={{
                                                    position: "absolute",
                                                    top: "100%",
                                                    left: "0",
                                                    backgroundColor: "var(--bg-primary)",
                                                    border: "1px solid var(--border-color)",
                                                    padding: "var(--spacing-md)",
                                                    borderRadius: "var(--radius-md)",
                                                    zIndex: 10,
                                                    minWidth: "250px",
                                                    boxShadow: "var(--shadow-lg)",
                                                }}
                                            >
                                                <strong>Description:</strong>
                                                <p style={{ margin: "4px 0 0 0", fontSize: "0.875rem", color: "var(--text-secondary)" }}>
                                                    {item.description}
                                                </p>
                                            </div>
                                        )}
                                    </td>
                                    <td>${item.price?.toFixed(2)}</td>
                                    <td>
                                        {item.amount} {item.measurementType}
                                    </td>
                                    <td className="font-bold">${itemTotal.toFixed(2)}</td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>

                <div className="flex justify-between items-center mt-xl" style={{ borderTop: '2px solid var(--border-color)', paddingTop: 'var(--spacing-lg)' }}>
                    <h3 className="text-primary mb-0">Cart Total:</h3>
                    <h3 className="text-success mb-0">${cartTotal.toFixed(2)}</h3>
                </div>
            </div>
        </div>
    );
};

export default ViewCart;