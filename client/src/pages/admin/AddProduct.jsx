import React, { useState } from "react";
import { API_URL } from "../../../config";

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
            const res = await fetch(`${API_URL}/api/products`, {
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
    <div className="card">
        <div className="card-header">
            <h2>Add Product</h2>
        </div>
        <div className="card-body">
            <form onSubmit={submission}>
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
                        <option value="" disabled>Select category</option>
                        {Object.keys(SUBCATEGORIES).map((cat) => (<option key={cat} value={cat}>{cat}</option>))}
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
                            <option key={sub} value={sub}>{sub}</option>
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
                      <option value="" disabled>Select measurement type</option>
                      <option value="Kg">Kg</option>
                      <option value="Unit">Unit</option>
                    </select>
                </div>

                <div className="form-group">
                    <label>Amount:</label>
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
                </div>

                <button type="submit" className="button button-primary">Add Product</button>

                {error && <div className="alert alert-error">{error}</div>}
                {success && <div className="alert alert-success">Product added successfully!</div>}
            </form>
        </div>
    </div>
    );
};

export default AddProduct;