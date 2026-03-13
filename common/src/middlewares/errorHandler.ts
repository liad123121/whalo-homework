import { Request, Response, NextFunction } from "express";
import { logger } from "../utils/logger";

const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  logger.error(err);
  res
    .status(500)
    .send({ status: false, error: err.message || "Unknown error occurred" });
};

export { errorHandler };
