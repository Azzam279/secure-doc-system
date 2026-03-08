import { Request, Response, NextFunction } from "express";
import { logError } from "../utils/logger";

export function errorHandler(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) {
  logError("Unhandled error", { error: err.message });

  res.status(500).json({
    message: "Internal Server Error",
  });
}
