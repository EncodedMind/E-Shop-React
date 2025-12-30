import { Router } from "express";
import { readJson, writeJson } from "../utils/fileStore.js";

const router = Router();

router.get("/", async (_req, res, next) => {
    try {
        const users = await readJson("users.json", []);
        res.json(users);
    } catch (err) {
        next(err);
    }
});

router.post("/", async (req, res, next) => {
    try {
        const { username, password, isAdmin } = req.body || {};
        if (!username || !password) {
            return res.status(400).json({ error: "username and password are required" });
        }

        const users = await readJson("users.json", []);
        const exists = users.find((u) => u.username === username);
        if (exists) {
            return res.status(409).json({ error: "user-exists" });
        }

        users.push({ username, password, isAdmin: !!isAdmin });
        await writeJson("users.json", users);
        res.status(201).json({ success: true });
    } catch (err) {
        next(err);
    }
});

export default router;
