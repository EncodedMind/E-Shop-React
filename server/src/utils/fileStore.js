import { promises as fs } from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.resolve(__dirname, "../../data");

const ensureDir = async (dirPath) => {
    await fs.mkdir(dirPath, { recursive: true });
};

export const readJson = async (relativePath, fallback = null) => {
    const filePath = path.join(DATA_DIR, relativePath);
    try {
        const raw = await fs.readFile(filePath, "utf-8");
        return JSON.parse(raw);
    } catch (err) {
        if (err.code === "ENOENT") {
            return fallback;
        }
        throw err;
    }
};

export const writeJson = async (relativePath, data) => {
    const filePath = path.join(DATA_DIR, relativePath);
    await ensureDir(path.dirname(filePath));
    const serialized = JSON.stringify(data, null, 2);
    await fs.writeFile(filePath, serialized, "utf-8");
};

export const dataDir = DATA_DIR;
