import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import healthRouter from "./routes/health.js";
import productsRouter from "./routes/products.js";
import ordersRouter from "./routes/orders.js";
import usersRouter from "./routes/users.js";
import productOrdersRouter from "./routes/productOrders.js";
import cartRouter from "./routes/cart.js";
import discountUsageRouter from "./routes/discountUsage.js";
import { errorHandler } from "./middleware/errorHandler.js";
// import { PORT } from "./config/env.js";

dotenv.config();

const app = express();

// app.use(cors());
const allowedOrigins = [
  "http://localhost:5173", // for Vite dev server
  "https://encodedmind-eshop.netlify.app" // for Netlify frontend
  "https://e-shop-react-p935.onrender.com" // for Render backend
];

app.use(cors({
  origin: function(origin, callback){
    if(!origin) return callback(null, true); // to allow non-browser requests
    if(allowedOrigins.includes(origin)){
      return callback(null, true);
    } else {
      return callback(new Error('CORS not allowed for this origin'));
    }
  }
}));

app.use(express.json());

app.use("/health", healthRouter);
app.use("/api/products", productsRouter);
app.use("/api/orders", ordersRouter);
app.use("/api/users", usersRouter);
app.use("/api/product-orders", productOrdersRouter);
app.use("/api/cart", cartRouter);
app.use("/api/discount-usage", discountUsageRouter);

app.use((req, res) => {
    res.status(404).json({ error: "Not found" });
});

app.use(errorHandler);

const port = process.env.PORT || 4000;
app.listen(port, () => {
    console.log(`API listening on port ${port}`);
});

// app.listen(PORT, () => {
//     console.log(`API listening on port ${PORT}`);
// });
