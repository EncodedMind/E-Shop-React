import { Router } from "express";
import path from "path";
import { readJson, writeJson } from "../utils/fileStore.js";

const router = Router();

router.get("/:username", async (req, res, next) => {
    try {
        const { username } = req.params;
        const relativePath = path.join("order_history", `${username}_history.json`);
        const orders = await readJson(relativePath, []);
        res.json(orders);
    } catch (err) {
        next(err);
    }
});

router.post("/:username", async (req, res, next) => {
    try {
        const { username } = req.params;
        const order = req.body;
        const relativePath = path.join("order_history", `${username}_history.json`);
        const orders = await readJson(relativePath, []);
        orders.push(order);
        await writeJson(relativePath, orders);
        res.status(201).json({ success: true, order });
    } catch (err) {
        next(err);
    }
});

export default router;
