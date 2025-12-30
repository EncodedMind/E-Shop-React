import React, { useEffect, useMemo, useState } from "react";
import productsSeed from "../../data/products.json";

const SUBCATEGORIES = {
    Food: ["Fruit", "Vegetable", "Meat", "Seafood", "Dairy", "Sweet", "Baked"],
    Drink: ["Juice", "Soft Drink", "Coffee", "Tea", "Dairy", "Alcohol"],
    Clothing: ["Shirt", "Pant", "Hat", "Shoe"],
    Book: ["Mystery", "Sci-Fi", "Romance", "Comedy", "Academic", "Comic"],
    Tech: ["Computer", "Laptop", "Phone", "Tablet"],
};

const loadProducts = () => JSON.parse(localStorage.getItem("products") || JSON.stringify(productsSeed));

const saveProducts = (list) => localStorage.setItem("products", JSON.stringify(list));

const EditProduct = () => {
    const [products, setProducts] = useState(loadProducts);
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

    const handleSubmit = (e) => {
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

        const existsOther = products.some(
        (p) =>
            p.title?.trim().toLowerCase() === title.trim().toLowerCase() &&
            p.title?.trim().toLowerCase() !== selectedTitle.trim().toLowerCase()
        );
        if (existsOther) {
        setError("Another product already uses this title.");
        return;
        }

        const updated = products.map((p) =>
        p.title?.trim().toLowerCase() === selectedTitle.trim().toLowerCase()
            ? {
                ...p,
                title: title.trim(),
                description: description.trim(),
                category,
                subcategory,
                price: priceNum,
                measurementType,
                amount: amountNum,
            }
            : p
        );

        setProducts(updated);
        saveProducts(updated);
        setSuccess(true);
        setSelectedTitle(title.trim()); // keep selection in sync if title changed
    };

    return (
        <div>
        <h2>Edit Product</h2>

        {/* Select product */}
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

        {/* Only show the form once a product is selected */}
        {!selectedTitle ? (
          <p style={{ marginTop: "10px" }}>Select a product to edit.</p>
        ) : (
          <form onSubmit={handleSubmit} style={{ marginTop: "10px" }}>
            <input
                type="text"
                placeholder="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
            />

            <input
                type="text"
                placeholder="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
            />

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

            <input
                type="number"
                placeholder="Price"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
            />

            <input
                type="number"
                placeholder={
                    measurementType ? `Amount (${measurementType})` : "Amount"
                }
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
            />

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

            <button type="submit">Save changes</button>

            {error && <p style={{ color: "red" }}>{error}</p>}
            {success && <p style={{ color: "green" }}>Product updated!</p>}
          </form>
        )}
        </div>
    );
};

export default EditProduct;