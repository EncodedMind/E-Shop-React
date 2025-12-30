import React, { useState } from "react";

const SUBCATEGORIES = {
    Food: ["Fruit", "Vegetable", "Meat", "Seafood", "Dairy", "Sweet", "Baked"],
    Drink: ["Juice", "Soft Drink", "Coffee", "Tea", "Dairy", "Alcohol"],
    Clothing: ["Shirt", "Pant", "Hat", "Shoe"],
    Book: ["Mystery", "Sci-Fi", "Romance", "Comedy", "Academic", "Comic"],
    Tech: ["Computer", "Laptop", "Phone", "Tablet"],
};

const AddProduct = () => {

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [category, setCategory] = useState("");
    const [subcategory, setSubcategory] = useState("");
    const [price, setPrice] = useState("");
    const [amount, setAmount] = useState("");
    const [measurementType, setMeasurementType] = useState("");
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState("");

    const submission = async (e) => {
        e.preventDefault();
        setSuccess(false);
        setError("");

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
            const res = await fetch("http://localhost:4000/api/products", {
                method: "POST",
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
                setError("A product with this title already exists.");
                return;
            }

            if (!res.ok) {
                setError("Failed to add product.");
                return;
            }

            setSuccess(true);
            setTitle("");
            setDescription("");
            setCategory("");
            setSubcategory("");
            setPrice("");
            setMeasurementType("");
            setAmount("");
        } catch (err) {
            console.error(err);
            setError("Network error.");
        }
    };

    const subcategoryOptions = category ? SUBCATEGORIES[category] : [];

    return (
    <div>
        <h2>Add Product</h2>

        <form onSubmit={submission}>
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
                <option value="" disabled>Select category</option>
                {Object.keys(SUBCATEGORIES).map((cat) => (<option key={cat} value={cat}>{cat}</option>))}
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
                    <option key={sub} value={sub}>{sub}</option>
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
                    measurementType
                    ? `Amount (${measurementType})`
                    : "Amount"
                }
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
            />

            <select
              value={measurementType}
              onChange={(e) => setMeasurementType(e.target.value)}
            >
              <option value="" disabled>Select measurement type</option>
              <option value="Kg">Kg</option>
              <option value="Unit">Unit</option>
            </select>

            <button type="submit">Add Product</button>

            {/* Feedback messages */}
            {error && <p style={{ color: "red" }}>{error}</p>}
            {success && <p style={{ color: "green" }}>Product added successfully!</p>}
        </form>
    </div>
    );
};

export default AddProduct;