import db from "../Helpers/utilities/database";
import { UserAttributes } from "../Interfaces/UserInterface";

async function createUser(user: UserAttributes) {
  try {
    return await db.User.create(user);
  } catch (error: any) {
    throw new Error(error);
  }
}

async function getUserByUsername(username: string) {
  try {
    return await db.User.findOne({
      where: {
        username: username,
      },
    });
  } catch (error: any) {
    throw new Error(error);
  }
}

async function getAllUsers(): Promise<UserAttributes[]> {
  try {
    return await db.User.findAll({ attributes: ["id", "username", "email"] });
  } catch (error: any) {
    throw new Error(error);
  }
}

export { createUser, getUserByUsername, getAllUsers };
