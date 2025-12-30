import React, { useState, useMemo } from "react";
import productsSeed from "../../data/products.json";
import discountsData from "../../data/discounts.json";

const loadCart = () => {
    const user = localStorage.getItem("currentUser");
    if (!user) return [];
    return JSON.parse(localStorage.getItem(`cart_${user}`) || "[]");
};

const loadOrderHistory = () => {
    const user = localStorage.getItem("currentUser");
    if (!user) return [];
    return JSON.parse(localStorage.getItem(`orders_${user}`) || "[]");
};

const saveOrderHistory = (orders) => {
    const user = localStorage.getItem("currentUser");
    if (!user) return;
    localStorage.setItem(`orders_${user}`, JSON.stringify(orders));
};

const saveCart = (cart) => {
    const user = localStorage.getItem("currentUser");
    if (!user) return;
    localStorage.setItem(`cart_${user}`, JSON.stringify(cart));
};

const loadProductOrders = () =>
    JSON.parse(localStorage.getItem("productOrders") || "{}");

const saveProductOrders = (orders) =>
    localStorage.setItem("productOrders", JSON.stringify(orders));

const PRODUCT_DISCOUNT = 0.10; // 10%
const CATEGORY_DISCOUNT = 0.05; // 5%
const FAVORITE_DISCOUNT = 0.15; // 15%

const CompleteOrder = () => {
    const [cart, setCart] = useState(loadCart);
    const [orderHistory, setOrderHistory] = useState(loadOrderHistory);
    const [message, setMessage] = useState("");
    const [orderPlaced, setOrderPlaced] = useState(false);
    const [hoveredIdx, setHoveredIdx] = useState(null);

    // Calculate eligible discounts
    const { discountedProducts, discountedCategories, favoriteProduct, canGetFavoriteDiscount } = useMemo(() => {
        const discountedProds = new Set();
        const discountedCats = new Set();
        let favProduct = null;
        let canGetFav = true;

        const user = localStorage.getItem("currentUser");
        
        // Load already-used discounts
        const usedProductDiscounts = JSON.parse(localStorage.getItem(`usedProductDiscounts_${user}`) || "[]");
        const usedCategoryDiscounts = JSON.parse(localStorage.getItem(`usedCategoryDiscounts_${user}`) || "[]");
        const favDiscountUsed = localStorage.getItem(`favoriteDiscountUsed_${user}`) === "true";
        if (favDiscountUsed) canGetFav = false;

        // Product discount: last 3 orders containing product are consecutive
        if (orderHistory.length >= 3) {
            const productOrderIndices = {};
            orderHistory.forEach((order, idx) => {
                order.items.forEach((item) => {
                    if (!productOrderIndices[item.title]) productOrderIndices[item.title] = [];
                    productOrderIndices[item.title].push(idx);
                });
            });

            Object.entries(productOrderIndices).forEach(([title, indices]) => {
                if (indices.length < 3) return;
                const last3 = indices.slice(-3);
                const consecutive = last3[1] === last3[0] + 1 && last3[2] === last3[1] + 1;
                // Only add if not already used
                if (consecutive && !usedProductDiscounts.includes(title)) {
                    discountedProds.add(title);
                }
            });
        }

        // Category discount: amount bought in current cart >= threshold
        if (cart.length > 0) {
            const categoryAmounts = {};
            cart.forEach((item) => {
                categoryAmounts[item.category] = (categoryAmounts[item.category] || 0) + item.amount;
            });

            Object.entries(categoryAmounts).forEach(([category, amount]) => {
                const threshold = discountsData[category] || Infinity;
                // Only add if not already used
                if (amount >= threshold && !usedCategoryDiscounts.includes(category)) {
                    discountedCats.add(category);
                }
            });
        }

        // Favorite product discount: >= 5 orders, most bought product by total amount
        if (orderHistory.length >= 5 && canGetFav) {
            const amountBought = {};
            orderHistory.forEach((order) => {
                order.items.forEach((item) => {
                    amountBought[item.title] = (amountBought[item.title] || 0) + item.amount;
                });
            });

            const sortedByAmount = Object.entries(amountBought).sort((a, b) => b[1] - a[1]);
            if (sortedByAmount.length > 0) favProduct = sortedByAmount[0][0];
        }

        return {
            discountedProducts: discountedProds,
            discountedCategories: discountedCats,
            favoriteProduct: favProduct,
            canGetFavoriteDiscount: canGetFav,
        };
    }, [cart, orderHistory]);

    // Calculate order details with discounts
    const orderDetails = useMemo(() => {
        const items = cart.map((item) => {
            const basePrice = item.price * item.amount;
            const eligibleDiscounts = [];

            if (discountedProducts.has(item.title)) eligibleDiscounts.push("PRODUCT");
            if (discountedCategories.has(item.category)) eligibleDiscounts.push("CATEGORY");
            if (item.title === favoriteProduct && canGetFavoriteDiscount) eligibleDiscounts.push("FAVORITE");

            let appliedDiscount = 0;
            let discountType = null;

            if (eligibleDiscounts.length > 0) {
                const randomIdx = Math.floor(Math.random() * eligibleDiscounts.length);
                discountType = eligibleDiscounts[randomIdx];

                if (discountType === "PRODUCT") appliedDiscount = PRODUCT_DISCOUNT;
                else if (discountType === "CATEGORY") appliedDiscount = CATEGORY_DISCOUNT;
                else if (discountType === "FAVORITE") appliedDiscount = FAVORITE_DISCOUNT;
            }

            const finalPrice = basePrice * (1 - appliedDiscount);

            return {
                ...item,
                basePrice,
                appliedDiscount,
                discountType,
                finalPrice,
            };
        });

        const totalCost = items.reduce((sum, item) => sum + item.finalPrice, 0);

        return { items, totalCost };
    }, [cart, discountedProducts, discountedCategories, favoriteProduct, canGetFavoriteDiscount]);

    const handlePlaceOrder = () => {
        if (cart.length === 0) {
            setMessage("Your cart is empty.");
            return;
        }

        const newOrder = {
            id: Date.now(),
            date: new Date().toISOString(),
            items: cart.map((item) => ({
                title: item.title,
                description: item.description,
                category: item.category,
                subcategory: item.subcategory,
                price: item.price,
                measurementType: item.measurementType,
                amount: item.amount,
            })),
            totalCost: orderDetails.totalCost,
        };

        // Update order history
        const updatedOrderHistory = [...orderHistory, newOrder];
        setOrderHistory(updatedOrderHistory);
        saveOrderHistory(updatedOrderHistory);

        // Update productOrders (global)
        const productOrders = loadProductOrders();
        cart.forEach((item) => {
            productOrders[item.title] = (productOrders[item.title] || 0) + 1;
        });
        saveProductOrders(productOrders);

        // Mark discounts as used
        const user = localStorage.getItem("currentUser");
        orderDetails.items.forEach((item) => {
            if (item.discountType === "PRODUCT") {
                // Remove from eligible products
                const usedProds = JSON.parse(localStorage.getItem(`usedProductDiscounts_${user}`) || "[]");
                usedProds.push(item.title);
                localStorage.setItem(`usedProductDiscounts_${user}`, JSON.stringify(usedProds));
            } else if (item.discountType === "CATEGORY") {
                const usedCats = JSON.parse(localStorage.getItem(`usedCategoryDiscounts_${user}`) || "[]");
                usedCats.push(item.category);
                localStorage.setItem(`usedCategoryDiscounts_${user}`, JSON.stringify(usedCats));
            } else if (item.discountType === "FAVORITE") {
                localStorage.setItem(`favoriteDiscountUsed_${user}`, "true");
            }
        });

        // Empty cart
        setCart([]);
        saveCart([]);

        setMessage("Order was placed successfully!");
        setOrderPlaced(true);
    };

    if (cart.length === 0 && !orderPlaced) {
        return (
            <div>
                <h2>Complete Order</h2>
                <p>Your cart is empty.</p>
            </div>
        );
    }

    if (orderPlaced) {
        return (
            <div>
                <h2>Complete Order</h2>
                <p style={{ color: "green", fontSize: "18px" }}>{message}</p>
            </div>
        );
    }

    return (
        <div>
            <h2>Complete Order</h2>
            <table style={{ marginTop: "15px", width: "100%", borderCollapse: "collapse" }}>
                <thead>
                    <tr style={{ backgroundColor: "#f0f0f0" }}>
                        <th style={{ border: "1px solid #ccc", padding: "8px" }}>Product</th>
                        <th style={{ border: "1px solid #ccc", padding: "8px" }}>Quantity</th>
                        <th style={{ border: "1px solid #ccc", padding: "8px" }}>Base Price</th>
                        <th style={{ border: "1px solid #ccc", padding: "8px" }}>Discount</th>
                        <th style={{ border: "1px solid #ccc", padding: "8px" }}>Final Price</th>
                    </tr>
                </thead>
                <tbody>
                    {orderDetails.items.map((item, idx) => (
                        <tr key={idx}>
                            <td
                                style={{ border: "1px solid #ccc", padding: "8px", position: "relative", cursor: "pointer" }}
                                onMouseEnter={() => setHoveredIdx(idx)}
                                onMouseLeave={() => setHoveredIdx(null)}
                            >
                                {item.title}
                                {hoveredIdx === idx && (
                                    <div
                                        style={{
                                            position: "absolute",
                                            top: "100%",
                                            left: "0",
                                            backgroundColor: "#fff",
                                            border: "1px solid #ccc",
                                            padding: "8px",
                                            borderRadius: "4px",
                                            zIndex: 10,
                                            minWidth: "200px",
                                            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                                        }}
                                    >
                                        <strong>Description:</strong>
                                        <p style={{ margin: "4px 0 0 0", fontSize: "12px" }}>{item.description}</p>
                                    </div>
                                )}
                            </td>
                            <td style={{ border: "1px solid #ccc", padding: "8px" }}>
                                {item.amount} {item.measurementType}
                            </td>
                            <td style={{ border: "1px solid #ccc", padding: "8px" }}>${item.basePrice.toFixed(2)}</td>
                            <td style={{ border: "1px solid #ccc", padding: "8px" }}>
                                {item.appliedDiscount > 0 ? (
                                    <span style={{ color: "green" }}>
                                        {(item.appliedDiscount * 100).toFixed(0)}% off
                                    </span>
                                ) : (
                                    "-"
                                )}
                            </td>
                            <td style={{ border: "1px solid #ccc", padding: "8px" }}>${item.finalPrice.toFixed(2)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <div style={{ marginTop: "20px", textAlign: "right" }}>
                <h3>Total: ${orderDetails.totalCost.toFixed(2)}</h3>
            </div>

            <button onClick={handlePlaceOrder} style={{ marginTop: "10px" }}>
                Place Order
            </button>

            {message && <p style={{ marginTop: "15px", color: "red" }}>{message}</p>}
        </div>
    );
};

export default CompleteOrder;