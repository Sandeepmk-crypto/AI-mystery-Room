import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env from root or apps/api
dotenv.config({ path: path.resolve(__dirname, "../../../../.env") });
dotenv.config();

export const ENV = {
  NODE_ENV: process.env.NODE_ENV || "development",
  PORT: parseInt(process.env.PORT || "5000", 10),
  MONGODB_URI: process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/ai_mystery_room",
  GEMINI_API_KEY: process.env.GEMINI_API_KEY || "",
  GEMINI_MODEL: process.env.GEMINI_MODEL || "gemini-1.5-flash",
  USE_MOCK_AI:
    process.env.USE_MOCK_AI === "true" ||
    !process.env.GEMINI_API_KEY ||
    process.env.GEMINI_API_KEY.trim() === "",
  CLIENT_ORIGIN: process.env.CLIENT_ORIGIN || "http://localhost:5173",
  SESSION_TTL_DAYS: parseInt(process.env.SESSION_TTL_DAYS || "7", 10),
};
