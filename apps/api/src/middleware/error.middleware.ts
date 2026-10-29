import { Request, Response, NextFunction } from "express";

export interface AppError extends Error {
  statusCode?: number;
  code?: string;
}

export function errorHandler(
  err: AppError,
  req: Request,
  res: Response,
  next: NextFunction
): void {
  console.error("[API Error]", err);
  const statusCode = err.statusCode || 500;
  const errorCode = err.code || (statusCode === 500 ? "INTERNAL_SERVER_ERROR" : "ERROR");
  const message =
    statusCode === 500 && process.env.NODE_ENV === "production"
      ? "An unexpected internal server error occurred."
      : err.message || "An unexpected error occurred.";

  const requestId = (req.headers["x-request-id"] as string) || undefined;

  res.status(statusCode).json({
    error: {
      code: errorCode,
      message,
      requestId,
    },
  });
}
