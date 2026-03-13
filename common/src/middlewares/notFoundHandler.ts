import { NextFunction, Request, Response } from "express";

const notFoundHandler = (req: Request, res: Response, next: NextFunction) => {
  res.status(404).send({ status: false, message: "Not Found" });
};

export default notFoundHandler;
