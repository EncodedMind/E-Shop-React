import React, { useState, useMemo } from "react";
import productsSeed from "../../data/products.json";

const loadProducts = () =>
    JSON.parse(localStorage.getItem("products") || JSON.stringify(productsSeed));

const UnavailableProducts = () => {
    const [products] = useState(loadProducts);

    const unavailableProducts = useMemo(
        () => products.filter((p) => Math.abs(p.amount || 0) < 1e-6),
        [products]
    );

    return (
        <div>
            <h2>Unavailable Products</h2>
            {unavailableProducts.length === 0 ? (
                <p>No unavailable products found.</p>
            ) : (
                <table style={{ marginTop: "15px", width: "100%", borderCollapse: "collapse" }}>
                    <thead>
                        <tr style={{ backgroundColor: "#f0f0f0" }}>
                            <th style={{ border: "1px solid #ccc", padding: "8px" }}>Title</th>
                            <th style={{ border: "1px solid #ccc", padding: "8px" }}>Description</th>
                            <th style={{ border: "1px solid #ccc", padding: "8px" }}>Category</th>
                            <th style={{ border: "1px solid #ccc", padding: "8px" }}>Subcategory</th>
                            <th style={{ border: "1px solid #ccc", padding: "8px" }}>Price</th>
                            <th style={{ border: "1px solid #ccc", padding: "8px" }}>Amount</th>
                        </tr>
                    </thead>
                    <tbody>
                        {unavailableProducts.map((p, idx) => (
                            <tr key={idx}>
                                <td style={{ border: "1px solid #ccc", padding: "8px" }}>{p.title}</td>
                                <td style={{ border: "1px solid #ccc", padding: "8px" }}>{p.description}</td>
                                <td style={{ border: "1px solid #ccc", padding: "8px" }}>{p.category}</td>
                                <td style={{ border: "1px solid #ccc", padding: "8px" }}>{p.subcategory}</td>
                                <td style={{ border: "1px solid #ccc", padding: "8px" }}>${p.price}</td>
                                <td style={{ border: "1px solid #ccc", padding: "8px" }}>
                                    {p.amount} {p.measurementType}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default UnavailableProducts;