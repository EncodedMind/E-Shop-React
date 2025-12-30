import React, { useState, useMemo, useEffect } from "react";

const UnavailableProducts = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const res = await fetch("http://localhost:4000/api/products");
                const data = await res.json();
                setProducts(data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);

    const unavailableProducts = useMemo(
        () => products.filter((p) => Math.abs(p.amount || 0) < 1e-6),
        [products]
    );

    return (
        <div className="card">
            <div className="card-header">
                <h2>Unavailable Products</h2>
            </div>
            <div className="card-body">
                {loading ? (
                    <div className="loading">Loading products...</div>
                ) : unavailableProducts.length === 0 ? (
                    <div className="alert alert-info">No unavailable products found.</div>
                ) : (
                    <table>
                        <thead>
                            <tr>
                                <th>Title</th>
                                <th>Description</th>
                                <th>Category</th>
                                <th>Subcategory</th>
                                <th>Price</th>
                                <th>Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            {unavailableProducts.map((p, idx) => (
                                <tr key={idx}>
                                    <td>{p.title}</td>
                                    <td>{p.description}</td>
                                    <td>{p.category}</td>
                                    <td>{p.subcategory}</td>
                                    <td>${p.price}</td>
                                    <td>
                                        {p.amount} {p.measurementType}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default UnavailableProducts;