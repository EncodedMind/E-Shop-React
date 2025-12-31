import React, { useEffect, useMemo, useState } from "react";
import { API_URL } from "../../../config";

const SUBCATEGORIES = {
    Food: ["Fruit", "Vegetable", "Meat", "Seafood", "Dairy", "Sweet", "Baked"],
    Drink: ["Juice", "Soft Drink", "Coffee", "Tea", "Dairy", "Alcohol"],
    Clothing: ["Shirt", "Pant", "Hat", "Shoe"],
    Book: ["Mystery", "Sci-Fi", "Romance", "Comedy", "Academic", "Comic"],
    Tech: ["Computer", "Laptop", "Phone", "Tablet"],
};

const EditProduct = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedTitle, setSelectedTitle] = useState("");
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [category, setCategory] = useState("");
    const [subcategory, setSubcategory] = useState("");
    const [price, setPrice] = useState("");
    const [amount, setAmount] = useState("");
    const [measurementType, setMeasurementType] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const res = await fetch(`${API_URL}/api/products`);
                const data = await res.json();
                setProducts(data);
            } catch (err) {
                console.error(err);
                setError("Failed to load products.");
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);

    // When selecting a product, populate fields
    useEffect(() => {
        if (!selectedTitle) return;
        const p = products.find(
            (prod) => prod.title?.trim().toLowerCase() === selectedTitle.trim().toLowerCase()
        );
        if (!p) return;

        setTitle(p.title || "");
        setDescription(p.description || "");
        setCategory(p.category || "");
        setSubcategory(p.subcategory || "");
        setPrice(p.price ?? "");
        setAmount(p.amount ?? "");
        setMeasurementType(p.measurementType || "");
        setError("");
    }, [selectedTitle, products]);

    const subcategoryOptions = useMemo(
        () => (category ? SUBCATEGORIES[category] || [] : []),
        [category]
    );

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess(false);

        if (!selectedTitle) {
            setError("Choose a product to edit.");
            return;
        }

        const priceNum = parseFloat(price);
        const amountNum = parseFloat(amount);

        if (
            !title.trim() ||
            !description.trim() ||
            !category ||
            !subcategory ||
            !measurementType ||
            Number.isNaN(priceNum) ||
            Number.isNaN(amountNum)
        ) {
            setError("Please fill all fields with valid values.");
            return;
        }

        try {
            const res = await fetch(`${API_URL}/api/products/${encodeURIComponent(selectedTitle)}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    title: title.trim(),
                    description: description.trim(),
                    category,
                    subcategory,
                    price: priceNum,
                    measurementType,
                    amount: amountNum,
                }),
            });

            if (res.status === 409) {
                setError("Another product already uses this title.");
                return;
            }

            if (res.status === 404) {
                setError("Product not found.");
                return;
            }

            if (!res.ok) {
                setError("Failed to update product.");
                return;
            }

            const updatedProduct = await res.json();
            const updatedList = products.map((p) =>
                p.title?.trim().toLowerCase() === selectedTitle.trim().toLowerCase()
                    ? updatedProduct.product
                    : p
            );
            setProducts(updatedList);
            setSuccess(true);
            setSelectedTitle(updatedProduct.product.title);
        } catch (err) {
            console.error(err);
            setError("Network error.");
        }
    };

    return (
        <div className="card">
            <div className="card-header">
                <h2>Edit Product</h2>
            </div>
            <div className="card-body">
                {loading ? (
                    <div className="loading">Loading products...</div>
                ) : (
                    <>
                        <div className="form-group">
                            <label>Select a product to edit:</label>
                            <select
                                value={selectedTitle}
                                onChange={(e) => {
                                    setSelectedTitle(e.target.value);
                                    setSuccess(false);
                                }}
                            >
                                <option value="" disabled>
                                    Select a product to edit
                                </option>
                                {products.map((p) => (
                                    <option key={p.title} value={p.title}>
                                        {p.title}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {!selectedTitle ? (
                            <div className="alert alert-info">Select a product to edit.</div>
                        ) : (
                            <form onSubmit={handleSubmit}>
                                <div className="form-group">
                                    <label>Title:</label>
                                    <input
                                        type="text"
                                        placeholder="Title"
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Description:</label>
                                    <input
                                        type="text"
                                        placeholder="Description"
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Category:</label>
                                    <select
                                        value={category}
                                        onChange={(e) => {
                                            setCategory(e.target.value);
                                            setSubcategory("");
                                        }}
                                    >
                                        <option value="" disabled>
                                            Select category
                                        </option>
                                        {Object.keys(SUBCATEGORIES).map((cat) => (
                                            <option key={cat} value={cat}>
                                                {cat}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="form-group">
                                    <label>Subcategory:</label>
                                    <select
                                        value={subcategory}
                                        onChange={(e) => setSubcategory(e.target.value)}
                                        disabled={!category}
                                    >
                                        <option value="" disabled>
                                            {category ? "Select subcategory" : "Pick a category first"}
                                        </option>
                                        {subcategoryOptions.map((sub) => (
                                            <option key={sub} value={sub}>
                                                {sub}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="form-group">
                                    <label>Price:</label>
                                    <input
                                        type="number"
                                        placeholder="Price"
                                        value={price}
                                        onChange={(e) => setPrice(e.target.value)}
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Measurement Type:</label>
                                    <select
                                        value={measurementType}
                                        onChange={(e) => setMeasurementType(e.target.value)}
                                    >
                                        <option value="" disabled>
                                            Select measurement type
                                        </option>
                                        <option value="Kg">Kg</option>
                                        <option value="Unit">Unit</option>
                                    </select>
                                </div>

                                <div className="form-group">
                                    <label>Amount:</label>
                                    <input
                                        type="number"
                                        placeholder={
                                            measurementType ? `Amount (${measurementType})` : "Amount"
                                        }
                                        value={amount}
                                        onChange={(e) => setAmount(e.target.value)}
                                    />
                                </div>

                                <button type="submit" className="button button-primary">Save changes</button>

                                {error && <div className="alert alert-error">{error}</div>}
                                {success && <div className="alert alert-success">Product updated!</div>}
                            </form>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default EditProduct;