import { Request, Response, NextFunction } from "express";
import logger from "../utilities/logger";
import jwt from "jsonwebtoken";
import config from "config";
import { throwError } from "../utilities/error";
import HttpStatusCode from "../../Enums/HttpStatusCodes";

const checkAuthenticated = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  logger.info("Validating token");

  const token = req.headers.authorization;

  if (token) {
    return jwt.verify(
      token,
      config.get("server.token.secret"),
      (error, decoded) => {
        if (decoded) {
          res.locals.user = decoded;
          return next();
        }
        return res.status(HttpStatusCode.NOT_FOUND).json({
          error: error,
        });
      }
    );
  }
  return res.status(HttpStatusCode.UNAUTHORIZED).json({
    message: "Unauthorized",
  });
};

export default checkAuthenticated;
