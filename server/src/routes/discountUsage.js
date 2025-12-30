import { Router } from "express";
import path from "path";
import { readJson, writeJson } from "../utils/fileStore.js";

const router = Router();

const defaultUsage = {
    usedProductDiscounts: [],
    usedCategoryDiscounts: [],
    favoriteDiscountUsed: false,
};

router.get("/:username", async (req, res, next) => {
    try {
        const { username } = req.params;
        const relative = path.join("discount_usage", `${username}.json`);
        const usage = await readJson(relative, defaultUsage);
        res.json({ ...defaultUsage, ...usage });
    } catch (err) {
        next(err);
    }
});

router.put("/:username", async (req, res, next) => {
    try {
        const { username } = req.params;
        const body = req.body || {};
        const relative = path.join("discount_usage", `${username}.json`);
        const current = await readJson(relative, defaultUsage);
        const nextUsage = {
            usedProductDiscounts: Array.isArray(body.usedProductDiscounts)
                ? body.usedProductDiscounts
                : current.usedProductDiscounts,
            usedCategoryDiscounts: Array.isArray(body.usedCategoryDiscounts)
                ? body.usedCategoryDiscounts
                : current.usedCategoryDiscounts,
            favoriteDiscountUsed:
                typeof body.favoriteDiscountUsed === "boolean"
                    ? body.favoriteDiscountUsed
                    : current.favoriteDiscountUsed,
        };
        await writeJson(relative, nextUsage);
        res.json({ success: true, usage: nextUsage });
    } catch (err) {
        next(err);
    }
});

export default router;
