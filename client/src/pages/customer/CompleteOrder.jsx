import React, { useEffect, useMemo, useState } from "react";

const PRODUCT_DISCOUNT = 0.10; // 10%
const CATEGORY_DISCOUNT = 0.05; // 5%
const FAVORITE_DISCOUNT = 0.15; // 15%

const defaultUsage = {
    usedProductDiscounts: [],
    usedCategoryDiscounts: [],
    favoriteDiscountUsed: false,
};

const CompleteOrder = () => {
    const [cart, setCart] = useState([]);
    const [orderHistory, setOrderHistory] = useState([]);
    const [discounts, setDiscounts] = useState({});
    const [discountUsage, setDiscountUsage] = useState(defaultUsage);
    const [message, setMessage] = useState("");
    const [orderPlaced, setOrderPlaced] = useState(false);
    const [hoveredIdx, setHoveredIdx] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            const user = localStorage.getItem("currentUser");
            if (!user) {
                setLoading(false);
                return;
            }
            try {
                const [cartRes, ordersRes, discRes, usageRes] = await Promise.all([
                    fetch(`http://localhost:4000/api/cart/${encodeURIComponent(user)}`),
                    fetch(`http://localhost:4000/api/orders/${encodeURIComponent(user)}`),
                    fetch("http://localhost:4000/api/products/discounts"),
                    fetch(`http://localhost:4000/api/discount-usage/${encodeURIComponent(user)}`),
                ]);
                const cartData = await cartRes.json();
                const ordersData = await ordersRes.json();
                const discountsData = await discRes.json();
                const usageData = await usageRes.json();
                setCart(cartData || []);
                setOrderHistory(ordersData || []);
                setDiscounts(discountsData || {});
                setDiscountUsage({ ...defaultUsage, ...(usageData || {}) });
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const { discountedProducts, discountedCategories, favoriteProduct, canGetFavoriteDiscount } = useMemo(() => {
        const discountedProds = new Set();
        const discountedCats = new Set();
        let favProduct = null;
        let canGetFav = !discountUsage.favoriteDiscountUsed;

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
                if (consecutive && !discountUsage.usedProductDiscounts.includes(title)) {
                    discountedProds.add(title);
                }
            });
        }

        if (cart.length > 0) {
            const categoryAmounts = {};
            cart.forEach((item) => {
                categoryAmounts[item.category] = (categoryAmounts[item.category] || 0) + item.amount;
            });

            Object.entries(categoryAmounts).forEach(([category, amount]) => {
                const threshold = discounts[category] || Infinity;
                if (amount >= threshold && !discountUsage.usedCategoryDiscounts.includes(category)) {
                    discountedCats.add(category);
                }
            });
        }

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
    }, [cart, orderHistory, discounts, discountUsage]);

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

    const handlePlaceOrder = async () => {
        if (cart.length === 0) {
            setMessage("Your cart is empty.");
            return;
        }

        const user = localStorage.getItem("currentUser");
        if (!user) {
            setMessage("No user logged in.");
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

        const usedProds = [...new Set(discountUsage.usedProductDiscounts)];
        const usedCats = [...new Set(discountUsage.usedCategoryDiscounts)];
        let favUsed = discountUsage.favoriteDiscountUsed;

        orderDetails.items.forEach((item) => {
            if (item.discountType === "PRODUCT" && !usedProds.includes(item.title)) {
                usedProds.push(item.title);
            } else if (item.discountType === "CATEGORY" && !usedCats.includes(item.category)) {
                usedCats.push(item.category);
            } else if (item.discountType === "FAVORITE") {
                favUsed = true;
            }
        });

        try {
            const postOrder = fetch(`http://localhost:4000/api/orders/${encodeURIComponent(user)}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newOrder),
            });

            const updateUsage = fetch(`http://localhost:4000/api/discount-usage/${encodeURIComponent(user)}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    usedProductDiscounts: usedProds,
                    usedCategoryDiscounts: usedCats,
                    favoriteDiscountUsed: favUsed,
                }),
            });

            const incrementOrders = Promise.all(
                orderDetails.items.map((item) =>
                    fetch("http://localhost:4000/api/product-orders/increment", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ title: item.title, count: 1 }),
                    })
                )
            );

            const clearCart = fetch(`http://localhost:4000/api/cart/${encodeURIComponent(user)}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify([]),
            });

            await Promise.all([postOrder, updateUsage, incrementOrders, clearCart]);

            setOrderHistory([...orderHistory, newOrder]);
            setDiscountUsage({
                usedProductDiscounts: usedProds,
                usedCategoryDiscounts: usedCats,
                favoriteDiscountUsed: favUsed,
            });
            setCart([]);
            setMessage("Order was placed successfully!");
            setOrderPlaced(true);
        } catch (err) {
            console.error(err);
            setMessage("Failed to place order.");
        }
    };

    if (loading) {
        return (
            <div className="card">
                <div className="card-header">
                    <h2>Complete Order</h2>
                </div>
                <div className="card-body">
                    <div className="loading">Loading...</div>
                </div>
            </div>
        );
    }

    if (cart.length === 0 && !orderPlaced) {
        return (
            <div className="card">
                <div className="card-header">
                    <h2>Complete Order</h2>
                </div>
                <div className="card-body">
                    <div className="alert alert-info">Your cart is empty.</div>
                </div>
            </div>
        );
    }

    if (orderPlaced) {
        return (
            <div className="card">
                <div className="card-header">
                    <h2>Complete Order</h2>
                </div>
                <div className="card-body">
                    <div className="alert alert-success">
                        {message}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="card">
            <div className="card-header">
                <h2>Complete Order</h2>
            </div>
            <div className="card-body">
                <table>
                    <thead>
                        <tr>
                            <th>Product</th>
                            <th>Quantity</th>
                            <th>Base Price</th>
                            <th>Discount</th>
                            <th>Final Price</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orderDetails.items.map((item, idx) => (
                            <tr key={idx}>
                                <td
                                    style={{ position: "relative", cursor: "pointer" }}
                                    onMouseEnter={() => setHoveredIdx(idx)}
                                    onMouseLeave={() => setHoveredIdx(null)}
                                >
                                    {item.title}
                                    {hoveredIdx === idx && (
                                        <div
                                            className="tooltip"
                                            style={{
                                                position: "absolute",
                                                top: "100%",
                                                left: "0",
                                                backgroundColor: "#fff",
                                                border: "1px solid var(--border-color)",
                                                padding: "var(--space-2)",
                                                borderRadius: "var(--radius)",
                                                zIndex: 10,
                                                minWidth: "200px",
                                                boxShadow: "var(--shadow-md)",
                                            }}
                                        >
                                            <strong>Description:</strong>
                                            <p style={{ margin: "4px 0 0 0", fontSize: "12px" }}>{item.description}</p>
                                        </div>
                                    )}
                                </td>
                                <td>
                                    {item.amount} {item.measurementType}
                                </td>
                                <td>${item.basePrice.toFixed(2)}</td>
                                <td>
                                    {item.appliedDiscount > 0 ? (
                                        <span className="badge badge-success">
                                            {(item.appliedDiscount * 100).toFixed(0)}% off
                                        </span>
                                    ) : (
                                        "-"
                                    )}
                                </td>
                                <td>${item.finalPrice.toFixed(2)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                <div className="cart-total">
                    <h3>Total: ${orderDetails.totalCost.toFixed(2)}</h3>
                </div>

                <button onClick={handlePlaceOrder} className="button button-primary">
                    Place Order
                </button>

                {message && (
                    <div className="alert alert-error">
                        {message}
                    </div>
                )}
            </div>
        </div>
    );
};

export default CompleteOrder;