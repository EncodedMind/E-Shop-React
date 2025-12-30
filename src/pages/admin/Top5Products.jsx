import React, { useMemo, useState } from "react";
import productsSeed from "../../data/products.json";

const loadProducts = () =>
  JSON.parse(localStorage.getItem("products") || JSON.stringify(productsSeed));

const loadProductOrders = () =>
  JSON.parse(localStorage.getItem("productOrders") || "{}");

const Top5Products = () => {
    const [products] = useState(loadProducts);
    const [productOrders] = useState(loadProductOrders);
    
    const productsByTitle = useMemo(() => {
        const map = {};
        products.forEach((p) => {
            if (p?.title) map[p.title] = p;
        });
        return map;
    }, [products]);

    const top5 = useMemo(() => {
        // Convert productOrders map to an array and sort by count desc, then title asc
        const counts = Object.entries(productOrders).map(([title, count]) => ({
            title,
            count: Number(count),
        }));

        const positive = counts
            .filter((c) => c.count > 0)
            .sort((a, b) => (b.count - a.count) || a.title.localeCompare(b.title));

        return positive
            .slice(0, 5)
            .map((c) => ({ product: productsByTitle[c.title], count: c.count }))
            .filter((item) => !!item.product);
    }, [productOrders, productsByTitle]);

    if (top5.length < 5) {
        return (
        <div>
            <h3>Top 5 Products</h3>
            <p>Not enough orders were made.</p>
        </div>
        );
    }

    return (
        <div>
        <h3>Top 5 Products</h3>
        <table style={{ marginTop: "15px", width: "100%", borderCollapse: "collapse" }}>
            <thead>
            <tr style={{ backgroundColor: "#f0f0f0" }}>
                <th style={{ border: "1px solid #ccc", padding: "8px" }}>Title</th>
                <th style={{ border: "1px solid #ccc", padding: "8px" }}>Description</th>
                <th style={{ border: "1px solid #ccc", padding: "8px" }}>Category</th>
                <th style={{ border: "1px solid #ccc", padding: "8px" }}>Subcategory</th>
                <th style={{ border: "1px solid #ccc", padding: "8px" }}>Price</th>
                <th style={{ border: "1px solid #ccc", padding: "8px" }}>Amount</th>
                <th style={{ border: "1px solid #ccc", padding: "8px" }}>Orders</th>
            </tr>
            </thead>
            <tbody>
            {top5.map(({ product, count }, idx) => (
                <tr key={idx}>
                <td style={{ border: "1px solid #ccc", padding: "8px" }}>{product.title}</td>
                <td style={{ border: "1px solid #ccc", padding: "8px" }}>{product.description}</td>
                <td style={{ border: "1px solid #ccc", padding: "8px" }}>{product.category}</td>
                <td style={{ border: "1px solid #ccc", padding: "8px" }}>{product.subcategory}</td>
                <td style={{ border: "1px solid #ccc", padding: "8px" }}>${product.price}</td>
                <td style={{ border: "1px solid #ccc", padding: "8px" }}>{product.amount} {product.measurementType}</td>
                <td style={{ border: "1px solid #ccc", padding: "8px" }}>{count}</td>
                </tr>
            ))}
            </tbody>
        </table>
        </div>
    );
};

export default Top5Products;