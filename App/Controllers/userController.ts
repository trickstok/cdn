import express, { Router } from "express";
import db from "../Helpers/utilities/database";
import HttpStatusCode from "../Enums/HttpStatusCodes";
import { getAllUsers } from "../Services/userService";
import { UserAttributes } from "../Interfaces/UserInterface";

const router: Router = express.Router();

router.get("/get/all", async (req, res) => {
  const users: UserAttributes[] = await getAllUsers();

  res.status(HttpStatusCode.OK).json({
    count: users.length,
    users: users,
  });
});

router.get("/get/current", async (req, res) => {
  const user = res.locals.user;
  
  res.status(HttpStatusCode.OK).send(user);
});

export default router;
