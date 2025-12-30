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
            <div>
                <h2>View Order History</h2>
                <p>You have no orders yet.</p>
            </div>
        );
    }

    return (
        <div>
            <h2>View Order History</h2>
            {orderHistory.map((order, orderIdx) => {
                const orderNumber = orderIdx + 1;
                const orderDate = new Date(order.date).toLocaleDateString();
                const isExpanded = expandedOrderIdx === orderIdx;

                return (
                    <div key={orderIdx} style={{ marginBottom: "20px", border: "1px solid #ddd", padding: "12px", borderRadius: "4px" }}>
                        <div
                            style={{ cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center" }}
                            onClick={() => setExpandedOrderIdx(isExpanded ? null : orderIdx)}
                        >
                            <div>
                                <h3 style={{ margin: "0 0 4px 0" }}>Order #{orderNumber}</h3>
                                <p style={{ margin: "0", fontSize: "14px", color: "#666" }}>Date: {orderDate}</p>
                            </div>
                            <div style={{ textAlign: "right" }}>
                                <p style={{ margin: "0", fontSize: "16px", fontWeight: "bold" }}>Total: ${order.totalCost.toFixed(2)}</p>
                                <p style={{ margin: "4px 0 0 0", fontSize: "12px", color: "#999" }}>{order.items.length} item(s)</p>
                            </div>
                        </div>

                        {isExpanded && (
                            <div style={{ marginTop: "12px" }}>
                                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                                    <thead>
                                        <tr style={{ backgroundColor: "#f0f0f0" }}>
                                            <th style={{ border: "1px solid #ccc", padding: "8px", textAlign: "left" }}>Product</th>
                                            <th style={{ border: "1px solid #ccc", padding: "8px", textAlign: "left" }}>Price</th>
                                            <th style={{ border: "1px solid #ccc", padding: "8px", textAlign: "left" }}>Quantity</th>
                                            <th style={{ border: "1px solid #ccc", padding: "8px", textAlign: "left" }}>Subtotal</th>
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
                                                            border: "1px solid #ccc",
                                                            padding: "8px",
                                                            position: "relative",
                                                            cursor: "pointer",
                                                        }}
                                                        onMouseEnter={() => setHoveredItemIdx(itemKey)}
                                                        onMouseLeave={() => setHoveredItemIdx(null)}
                                                    >
                                                        {item.title}
                                                        {hoveredItemIdx === itemKey && (
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
                                                    <td style={{ border: "1px solid #ccc", padding: "8px" }}>${item.price.toFixed(2)}</td>
                                                    <td style={{ border: "1px solid #ccc", padding: "8px" }}>
                                                        {item.amount} {item.measurementType}
                                                    </td>
                                                    <td style={{ border: "1px solid #ccc", padding: "8px" }}>${subtotal.toFixed(2)}</td>
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
    );
};

export default ViewOrderHistory;