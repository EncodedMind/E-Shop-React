import React, { useEffect, useMemo, useState } from "react";

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
                const res = await fetch("http://localhost:4000/api/products");
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
            const res = await fetch(`http://localhost:4000/api/products/${encodeURIComponent(selectedTitle)}`, {
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
        <div>
        <h2>Edit Product</h2>

                {loading ? (
                        <p>Loading products...</p>
                ) : (
                <>
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
        </>
        )}
        </div>
    );
};

export default EditProduct;