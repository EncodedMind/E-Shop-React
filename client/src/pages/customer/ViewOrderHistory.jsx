import React, { useState, useEffect } from "react";

const ViewOrderHistory = () => {
    const [orderHistory, setOrderHistory] = useState([]);
    const [hoveredItemIdx, setHoveredItemIdx] = useState(null);
    const [expandedOrderIdx, setExpandedOrderIdx] = useState(null);

    useEffect(() => {
        const fetchOrders = async () => {
            const user = localStorage.getItem("currentUser");
            if (!user) return;
            try {
                const res = await fetch(`http://localhost:4000/api/orders/${encodeURIComponent(user)}`);
                const data = await res.json();
                setOrderHistory(data || []);
            } catch (err) {
                console.error(err);
            }
        };
        fetchOrders();
    }, []);

    if (orderHistory.length === 0) {
        return (
            <div className="card">
                <div className="card-header">
                    <h2>View Order History</h2>
                </div>
                <div className="card-body">
                    <div className="alert alert-info">You have no orders yet.</div>
                </div>
            </div>
        );
    }

    return (
        <div className="card">
            <div className="card-header">
                <h2>View Order History</h2>
            </div>
            <div className="card-body">
                {orderHistory.map((order, orderIdx) => {
                    const orderNumber = orderIdx + 1;
                    const orderDate = new Date(order.date).toLocaleDateString();
                    const isExpanded = expandedOrderIdx === orderIdx;

                    return (
                        <div key={orderIdx} className="order-item" style={{ marginBottom: "var(--space-4)", border: "1px solid var(--border-color)", padding: "var(--space-3)", borderRadius: "var(--radius)", backgroundColor: "var(--bg-secondary)" }}>
                            <div
                                style={{ cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center" }}
                                onClick={() => setExpandedOrderIdx(isExpanded ? null : orderIdx)}
                            >
                                <div>
                                    <h3 style={{ margin: "0 0 var(--space-1) 0" }}>Order #{orderNumber}</h3>
                                    <p style={{ margin: "0", fontSize: "14px", color: "var(--text-secondary)" }}>Date: {orderDate}</p>
                                </div>
                                <div style={{ textAlign: "right" }}>
                                    <p style={{ margin: "0", fontSize: "16px", fontWeight: "bold" }}>Total: ${order.totalCost.toFixed(2)}</p>
                                    <p style={{ margin: "var(--space-1) 0 0 0", fontSize: "12px", color: "var(--text-secondary)" }}>{order.items.length} item(s)</p>
                                </div>
                            </div>

                            {isExpanded && (
                                <div style={{ marginTop: "var(--space-3)" }}>
                                    <table>
                                        <thead>
                                            <tr>
                                                <th>Product</th>
                                                <th>Price</th>
                                                <th>Quantity</th>
                                                <th>Subtotal</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {order.items.map((item, itemIdx) => {
                                                const subtotal = item.price * item.amount;
                                                const itemKey = `${orderIdx}-${itemIdx}`;

                                                return (
                                                    <tr key={itemIdx}>
                                                        <td
                                                            style={{
                                                                position: "relative",
                                                                cursor: "pointer",
                                                            }}
                                                            onMouseEnter={() => setHoveredItemIdx(itemKey)}
                                                            onMouseLeave={() => setHoveredItemIdx(null)}
                                                        >
                                                            {item.title}
                                                            {hoveredItemIdx === itemKey && (
                                                                <div
                                                                    className="tooltip"
                                                                    style={{
                                                                        position: "absolute",
                                                                        top: "100%",
                                                                        left: "0",
                                                                        backgroundColor: "#fff",
                                                                        border: "1px solid var(--border-color)",
                                                                        padding: "var(--space-2)",
                                                                        borderRadius: "var(--radius)",
                                                                        zIndex: 10,
                                                                        minWidth: "200px",
                                                                        boxShadow: "var(--shadow-md)",
                                                                    }}
                                                                >
                                                                    <strong>Description:</strong>
                                                                    <p style={{ margin: "4px 0 0 0", fontSize: "12px" }}>{item.description}</p>
                                                                </div>
                                                            )}
                                                        </td>
                                                        <td>${item.price.toFixed(2)}</td>
                                                        <td>
                                                            {item.amount} {item.measurementType}
                                                        </td>
                                                        <td>${subtotal.toFixed(2)}</td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default ViewOrderHistory;