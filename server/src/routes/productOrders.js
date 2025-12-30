import { Router } from "express";
import { promises as fs } from "fs";
import path from "path";
import { readJson, writeJson, dataDir } from "../utils/fileStore.js";

const router = Router();
const FILE = "product_orders.json";

router.get("/", async (_req, res, next) => {
    try {
        const orderHistoryDir = path.join(dataDir, "order_history");

        let filenames = [];
        try {
            filenames = await fs.readdir(orderHistoryDir);
        } catch (err) {
            if (err?.code === "ENOENT") {
                return res.json({});
            }
            throw err;
        }

        const historyFiles = filenames.filter((f) => f.endsWith("_history.json"));
        const counts = {};

        for (const filename of historyFiles) {
            const relativePath = path.join("order_history", filename);
            const orders = await readJson(relativePath, []);
            for (const order of orders) {
                const items = Array.isArray(order?.items) ? order.items : [];
                for (const item of items) {
                    const title = item?.title;
                    if (!title) continue;
                    const amount = Number(item?.amount ?? 1);
                    const increment = Number.isFinite(amount) && amount > 0 ? amount : 1;
                    counts[title] = Number(counts[title] || 0) + increment;
                }
            }
        }

        res.json(counts);
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
