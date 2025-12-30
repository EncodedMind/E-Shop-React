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
        <div style={{ marginTop: "15px", border: "1px solid #ccc", padding: "10px" }}>
            <h4>Product Details</h4>
            <p><strong>Title:</strong> {product.title}</p>
            <p><strong>Description:</strong> {product.description}</p>
            <p><strong>Category:</strong> {product.category}</p>
            <p><strong>Subcategory:</strong> {product.subcategory}</p>
            <p><strong>Price:</strong> ${product.price}</p>
            <p><strong>Amount:</strong> {product.amount} {product.measurementType}</p>
        </div>
    );

    const renderProductsTable = (productsList) => (
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
                {productsList.map((p, idx) => (
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
    );

    return (
        <div>
            <h2>Search Product</h2>
            <p>Select a search option:</p>

            <select value={searchOption} onChange={(e) => handleOptionChange(e.target.value)} disabled={loading}>
                <option value="" disabled>
                    Choose an option
                </option>
                <option value="by-title">Search for a specific product (by title)</option>
                <option value="by-category">View the products of a specific category</option>
                <option value="all">Show all the available products</option>
            </select>

            {loading && <p style={{ marginTop: "10px" }}>Loading products...</p>}

            {/* Option 1: Search by title */}
            {searchOption === "by-title" && (
                <div style={{ marginTop: "15px" }}>
                    <p>Select a product:</p>
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
                    {selectedProduct && renderProductDetails(selectedProduct)}
                </div>
            )}

            {/* Option 2: Search by category */}
            {searchOption === "by-category" && (
                <div style={{ marginTop: "15px" }}>
                    <p>Select a category:</p>
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
                    {selectedCategory && categoryProducts.length > 0 && (
                        <div>
                            <h4>Products in {selectedCategory}:</h4>
                            {renderProductsTable(categoryProducts)}
                        </div>
                    )}
                    {selectedCategory && categoryProducts.length === 0 && (
                        <p style={{ marginTop: "15px" }}>No products found in this category.</p>
                    )}
                </div>
            )}

            {/* Option 3: Show all products */}
            {searchOption === "all" && (
                <div style={{ marginTop: "15px" }}>
                    <h4>All Products:</h4>
                    {products.length > 0 ? (
                        renderProductsTable(products)
                    ) : (
                        <p>No products available.</p>
                    )}
                </div>
            )}
        </div>
    );
};

export default SearchProduct;