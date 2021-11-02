import { Request, Response, NextFunction } from "express";
import logger from "../utilities/logger";
import config from "config";
import { throwError } from "../utilities/error";
import HttpStatusCode from "../../Enums/HttpStatusCodes";

const checkAuthenticated = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const reqApiKey = req.headers["api-key"] as string;
    const apiKey = config.get<string>("server.apiKey");

    if (reqApiKey && apiKey) {
      if (reqApiKey === apiKey) return next();
    }

    return res.status(HttpStatusCode.UNAUTHORIZED).json({
      message: "Unauthorized",
    });
  } catch (error: any) {
    logger.info(error.message);
    throw new Error(error);
  }
};

export default checkAuthenticated;
