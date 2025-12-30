import React, { useMemo, useState, useEffect } from "react";

const Top5Products = () => {
    const [products, setProducts] = useState([]);
    const [productOrders, setProductOrders] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [prodRes, ordersRes] = await Promise.all([
                    fetch("http://localhost:4000/api/products"),
                    fetch("http://localhost:4000/api/product-orders"),
                ]);
                const productsData = await prodRes.json();
                const ordersData = await ordersRes.json();
                setProducts(productsData);
                setProductOrders(ordersData);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);
    
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

    if (loading) {
        return (
            <div className="card">
                <div className="card-header">
                    <h2>Top 5 Products</h2>
                </div>
                <div className="card-body">
                    <div className="loading">Loading...</div>
                </div>
            </div>
        );
    }

    if (top5.length < 5) {
        return (
            <div className="card">
                <div className="card-header">
                    <h2>Top 5 Products</h2>
                </div>
                <div className="card-body">
                    <div className="alert alert-info">Not enough orders were made.</div>
                </div>
            </div>
        );
    }

    return (
        <div className="card">
            <div className="card-header">
                <h2>Top 5 Products</h2>
            </div>
            <div className="card-body">
                <table>
                    <thead>
                        <tr>
                            <th>Title</th>
                            <th>Description</th>
                            <th>Category</th>
                            <th>Subcategory</th>
                            <th>Price</th>
                            <th>Amount</th>
                            <th>Orders</th>
                        </tr>
                    </thead>
                    <tbody>
                        {top5.map(({ product, count }, idx) => (
                            <tr key={idx}>
                                <td>{product.title}</td>
                                <td>{product.description}</td>
                                <td>{product.category}</td>
                                <td>{product.subcategory}</td>
                                <td>${product.price}</td>
                                <td>{product.amount} {product.measurementType}</td>
                                <td><span className="badge badge-primary">{count}</span></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Top5Products;