import { Router } from "express";
import { readJson, writeJson } from "../utils/fileStore.js";

const router = Router();

router.get("/", async (_req, res, next) => {
    try {
        const products = await readJson("products.json", []);
        res.json(products);
    } catch (err) {
        next(err);
    }
});

router.post("/", async (req, res, next) => {
    try {
        const product = req.body || {};
        const { title, description, category, subcategory, price, measurementType, amount } = product;

        if (!title || !description || !category || !subcategory || !measurementType || price === undefined || amount === undefined) {
            return res.status(400).json({ error: "missing-fields" });
        }

        const products = await readJson("products.json", []);
        const exists = products.find((p) => p.title?.trim().toLowerCase() === title.trim().toLowerCase());
        if (exists) {
            return res.status(409).json({ error: "product-exists" });
        }

        products.push({
            title: title.trim(),
            description: description.trim(),
            category,
            subcategory,
            price: Number(price),
            measurementType,
            amount: Number(amount),
        });

        await writeJson("products.json", products);
        res.status(201).json({ success: true });
    } catch (err) {
        next(err);
    }
});

router.put("/:title", async (req, res, next) => {
    try {
        const originalTitle = req.params.title;
        const updates = req.body || {};
        const { title, description, category, subcategory, price, measurementType, amount } = updates;

        const products = await readJson("products.json", []);
        const idx = products.findIndex((p) => p.title?.trim().toLowerCase() === originalTitle.trim().toLowerCase());
        if (idx === -1) {
            return res.status(404).json({ error: "not-found" });
        }

        const newTitle = title?.trim() ?? products[idx].title;
        const duplicate = products.some(
            (p, i) => i !== idx && p.title?.trim().toLowerCase() === newTitle.toLowerCase()
        );
        if (duplicate) {
            return res.status(409).json({ error: "product-exists" });
        }

        products[idx] = {
            ...products[idx],
            title: newTitle,
            description: description?.trim() ?? products[idx].description,
            category: category ?? products[idx].category,
            subcategory: subcategory ?? products[idx].subcategory,
            price: price !== undefined ? Number(price) : products[idx].price,
            measurementType: measurementType ?? products[idx].measurementType,
            amount: amount !== undefined ? Number(amount) : products[idx].amount,
        };

        await writeJson("products.json", products);
        res.json({ success: true, product: products[idx] });
    } catch (err) {
        next(err);
    }
});

router.delete("/:title", async (req, res, next) => {
    try {
        const targetTitle = req.params.title;
        const products = await readJson("products.json", []);
        const filtered = products.filter(
            (p) => p.title?.trim().toLowerCase() !== targetTitle.trim().toLowerCase()
        );

        if (filtered.length === products.length) {
            return res.status(404).json({ error: "not-found" });
        }

        await writeJson("products.json", filtered);
        res.json({ success: true });
    } catch (err) {
        next(err);
    }
});

router.get("/categories", async (_req, res, next) => {
    try {
        const categories = await readJson("categories.json", []);
        res.json(categories);
    } catch (err) {
        next(err);
    }
});

router.get("/discounts", async (_req, res, next) => {
    try {
        const discounts = await readJson("discounts.json", {});
        res.json(discounts);
    } catch (err) {
        next(err);
    }
});

export default router;
