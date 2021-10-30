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
  logger.info("Validating Api Key");

  const reqApiKey = req.headers.authorization as string;
  const apiKey = config.get<string>("server.apiKey");

  if (reqApiKey && apiKey) {
    if (reqApiKey === apiKey) return next();
  }

  return res.status(HttpStatusCode.UNAUTHORIZED).json({
    message: "Unauthorized",
  });
};

export default checkAuthenticated;
