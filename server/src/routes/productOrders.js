import { Router } from "express";
import { readJson, writeJson } from "../utils/fileStore.js";

const router = Router();
const FILE = "product_orders.json";

router.get("/", async (_req, res, next) => {
    try {
        const orders = await readJson(FILE, {});
        res.json(orders);
    } catch (err) {
        next(err);
    }
});

router.post("/increment", async (req, res, next) => {
    try {
        const { title, count } = req.body || {};
        if (!title) {
            return res.status(400).json({ error: "title-required" });
        }
        const increment = Number(count ?? 1);
        const orders = await readJson(FILE, {});
        orders[title] = Number(orders[title] || 0) + increment;
        await writeJson(FILE, orders);
        res.json({ success: true, count: orders[title] });
    } catch (err) {
        next(err);
    }
});

export default router;
