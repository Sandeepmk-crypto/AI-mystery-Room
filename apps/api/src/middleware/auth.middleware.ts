import { Request, Response, NextFunction } from "express";

declare global {
  namespace Express {
    interface Request {
      sessionToken?: string;
    }
  }
}

export function requireSessionToken(req: Request, res: Response, next: NextFunction): void {
  const token =
    (req.headers["x-session-token"] as string) ||
    (req.query.sessionToken as string) ||
    undefined;

  if (!token || token.trim() === "") {
    res.status(401).json({
      error: {
        code: "INVALID_SESSION",
        message: "Missing x-session-token authorization header for investigation session.",
      },
    });
    return;
  }

  req.sessionToken = token.trim();
  next();
}
