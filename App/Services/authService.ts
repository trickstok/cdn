import bcrypt from "bcryptjs";
import config from "config";
import logger from "../Helpers/utilities/logger";
import jwt from "jsonwebtoken";
import { UserAttributes } from "../Interfaces/UserInterface";

async function validatePassword(password: string, passwordHash: string) {
  try {
    return await bcrypt.compare(password, passwordHash);
  } catch (error: any) {
    throw new Error("Validation Error");
  }
}

function signJWT(
  user: UserAttributes,
  callback: (error: Error | null, token: string | null) => void
): void {
  const expirationTime = config.get<any>("server.token.expireTime");

  try {
    jwt.sign(
      {
        id: user.id,
        username: user.username,
        email: user.email,
      },
      config.get("server.token.secret"),
      {
        issuer: config.get("server.token.issuer"),
        algorithm: "HS256",
        expiresIn: expirationTime,
      },
      (error, token) => {
        if (token) return callback(null, token);
        return callback(error, null);
      }
    );
  } catch (error: any) {
    logger.error(error.message, error);
    callback(error, null);
  }
}

export { validatePassword, signJWT };
