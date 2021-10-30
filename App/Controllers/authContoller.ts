import express, { Router } from "express";
import validateResource from "../Helpers/middlewares/validateResource";
import db from "../Helpers/utilities/database";
import { throwError } from "../Helpers/utilities/error";
import { createUserSchema, logInUserSchema } from "../Validations/userSchema";
import bcrypt from "bcryptjs";
import checkAuthenticated from "../Helpers/middlewares/extractJWT";
import { UserAttributes } from "../Interfaces/UserInterface";
import logger from "../Helpers/utilities/logger";
import HttpStatusCode from "../Enums/HttpStatusCodes";
import config from "config";
import { createUser, getUserByUsername } from "../Services/userService";
import { validatePassword, signJWT } from "../Services/authService";

const router: Router = express.Router();

router.post(
  "/register",
  validateResource(createUserSchema),
  async (req, res, next) => {
    try {
      const user: UserAttributes = await createUser(req.body);
      logger.info(`User with id: ${user.id} created`);
      return res.status(HttpStatusCode.OK).json({
        message: "Registration Successful",
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
        },
      });
    } catch (error: any) {
      next(
        throwError(
          error.message || "Server Error",
          HttpStatusCode.INTERNAL_SERVER_ERROR
        )
      );
    }
  }
);

router.post(
  "/login",
  validateResource(logInUserSchema),
  async (req, res, next) => {
    try {
      const { username, password } = req.body;
      const user: UserAttributes = await getUserByUsername(username);
      const isValid = await validatePassword(password, user?.password);

      if (isValid) {
        return signJWT(user, (error, token) => {
          if (token) {
            logger.info(`User with id: ${user.id} successfully logged in`);
            return res.status(HttpStatusCode.OK).json({
              message: "Authorized",
              token: token,
              expireTime: config.get("server.token.expireTime"),
              user: {
                id: user.id,
                username: user.username,
                email: user.email,
              },
            });
          }
          return next(
            throwError("Unable to Sign JWT", HttpStatusCode.UNAUTHORIZED)
          );
        });
      }
      return next(
        throwError("Wrong username or password", HttpStatusCode.UNAUTHORIZED)
      );
    } catch (error: any) {
      return next(
        throwError(
          error.message || "Server Error",
          HttpStatusCode.INTERNAL_SERVER_ERROR
        )
      );
    }
  }
);

export default router;
