import { Request, Response, NextFunction } from "express";
import { ZodSchema, ZodError } from "zod";

export function validateBody(schema: ZodSchema) {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      req.body = schema.parse(req.body);
      next();
    } catch (err: any) {
      if (err instanceof ZodError || err?.name === "ZodError" || Array.isArray(err?.errors)) {
        const errors = err.errors || [];
        const errorMessages = errors.map((e: any) => `${e.path.join(".")}: ${e.message}`).join(", ");
        res.status(400).json({
          error: {
            code: "VALIDATION_ERROR",
            message: errorMessages || "Invalid request payload",
          },
        });
        return;
      }
      next(err);
    }
  };
}
