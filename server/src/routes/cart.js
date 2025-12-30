import { Router } from "express";
import path from "path";
import { readJson, writeJson } from "../utils/fileStore.js";

const router = Router();

router.get("/:username", async (req, res, next) => {
    try {
        const { username } = req.params;
        const relative = path.join("cart", `${username}_cart.json`);
        const cart = await readJson(relative, []);
        res.json(cart);
    } catch (err) {
        next(err);
    }
});

router.put("/:username", async (req, res, next) => {
    try {
        const { username } = req.params;
        const cart = Array.isArray(req.body) ? req.body : [];
        const relative = path.join("cart", `${username}_cart.json`);
        await writeJson(relative, cart);
        res.json({ success: true });
    } catch (err) {
        next(err);
    }
});

export default router;
