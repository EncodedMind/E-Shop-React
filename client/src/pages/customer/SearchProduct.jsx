import React, { useState, useMemo, useEffect } from "react";

const SearchProduct = () => {
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
    const [searchOption, setSearchOption] = useState("");
    const [selectedTitle, setSelectedTitle] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("");

    // Extract unique categories from products
    const categories = useMemo(() => {
        const cats = new Set();
        products.forEach((p) => p.category && cats.add(p.category));
        return Array.from(cats).sort();
    }, [products]);

    // Get selected product details
    const selectedProduct = useMemo(
        () => products.find((p) => p.title === selectedTitle),
        [products, selectedTitle]
    );

    // Get products by category
    const categoryProducts = useMemo(
        () => products.filter((p) => p.category === selectedCategory),
        [products, selectedCategory]
    );

    const handleOptionChange = (option) => {
        setSearchOption(option);
        // Clear previous selections when changing option
        setSelectedTitle("");
        setSelectedCategory("");
    };

    const renderProductDetails = (product) => (
        <div className="alert alert-info" style={{ marginTop: "var(--space-3)" }}>
            <h4 style={{ marginTop: 0 }}>Product Details</h4>
            <p><strong>Title:</strong> {product.title}</p>
            <p><strong>Description:</strong> {product.description}</p>
            <p><strong>Category:</strong> {product.category}</p>
            <p><strong>Subcategory:</strong> {product.subcategory}</p>
            <p><strong>Price:</strong> ${product.price}</p>
            <p style={{ marginBottom: 0 }}><strong>Amount:</strong> {product.amount} {product.measurementType}</p>
        </div>
    );

    const renderProductsTable = (productsList) => (
        <table style={{ marginTop: "var(--space-3)" }}>
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
                {productsList.map((p, idx) => (
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
    );

    return (
        <div className="card">
            <div className="card-header">
                <h2>Search Product</h2>
                <p>Select a search option:</p>
            </div>
            <div className="card-body">
                <div className="form-group">
                    <label>Search option:</label>
                    <select value={searchOption} onChange={(e) => handleOptionChange(e.target.value)} disabled={loading}>
                        <option value="" disabled>
                            Choose an option
                        </option>
                        <option value="by-title">Search for a specific product (by title)</option>
                        <option value="by-category">View the products of a specific category</option>
                        <option value="all">Show all the available products</option>
                    </select>
                </div>

                {loading && <div className="loading">Loading products...</div>}

                {/* Option 1: Search by title */}
                {searchOption === "by-title" && (
                    <div>
                        <div className="form-group">
                            <label>Select a product:</label>
                            <select
                                value={selectedTitle}
                                onChange={(e) => setSelectedTitle(e.target.value)}
                            >
                                <option value="" disabled>
                                    Choose a product
                                </option>
                                {products.map((p) => (
                                    <option key={p.title} value={p.title}>
                                        {p.title}
                                    </option>
                                ))}
                            </select>
                        </div>
                        {selectedProduct && renderProductDetails(selectedProduct)}
                    </div>
                )}

                {/* Option 2: Search by category */}
                {searchOption === "by-category" && (
                    <div>
                        <div className="form-group">
                            <label>Select a category:</label>
                            <select
                                value={selectedCategory}
                                onChange={(e) => setSelectedCategory(e.target.value)}
                            >
                                <option value="" disabled>
                                    Choose a category
                                </option>
                                {categories.map((cat) => (
                                    <option key={cat} value={cat}>
                                        {cat}
                                    </option>
                                ))}
                            </select>
                        </div>
                        {selectedCategory && categoryProducts.length > 0 && (
                            <div>
                                <h4>Products in {selectedCategory}:</h4>
                                {renderProductsTable(categoryProducts)}
                            </div>
                        )}
                        {selectedCategory && categoryProducts.length === 0 && (
                            <div className="alert alert-warning" style={{ marginTop: "var(--space-3)" }}>No products found in this category.</div>
                        )}
                    </div>
                )}

                {/* Option 3: Show all products */}
                {searchOption === "all" && (
                    <div>
                        <h4>All Products:</h4>
                        {products.length > 0 ? (
                            renderProductsTable(products)
                        ) : (
                            <div className="alert alert-info" style={{ marginTop: "var(--space-3)" }}>No products available.</div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default SearchProduct;