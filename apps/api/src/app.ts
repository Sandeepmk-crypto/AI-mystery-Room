import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { ENV } from "./config/env.js";
import { apiRouter } from "./routes/index.js";
import { errorHandler } from "./middleware/error.middleware.js";

export const app = express();

app.use(
  helmet({
    contentSecurityPolicy: false,
  })
);

app.use(
  cors({
    origin: [ENV.CLIENT_ORIGIN, "http://localhost:5173", "http://127.0.0.1:5173"],
    credentials: true,
  })
);

app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ extended: true, limit: "2mb" }));

if (ENV.NODE_ENV !== "test") {
  app.use(morgan("dev"));
}

// Mount API v1
app.use("/api/v1", apiRouter);

// Fallback 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: {
      code: "NOT_FOUND",
      message: `The endpoint ${req.method} ${req.path} does not exist.`,
    },
  });
});

// Global Error Handler
app.use(errorHandler);
