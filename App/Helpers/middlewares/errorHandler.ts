import { Request, Response, NextFunction } from "express";
import HttpStatusCode from "../../Enums/HttpStatusCodes";

// 404 Not found error
export const error404 = (req: Request, res: Response, next: NextFunction) => {
  const error: any = new Error("Not Found");
  error.status = HttpStatusCode.NOT_FOUND;
  next(error);
};

// All errors
export const errorHandler = (error: any, req: Request, res: Response, next: NextFunction) => {
  res.status(error.status || HttpStatusCode.INTERNAL_SERVER_ERROR);
  res.json({
    error: {
      message: error.message,
    },
  });
};
