import express, { Router } from "express";
import db from "../Helpers/utilities/database";
import checkAuthenticated from "../Helpers/middlewares/extractJWT";

const router: Router = express.Router();

router.get("/", checkAuthenticated, async (req, res) => {
  const user = res.locals.user;

  res.json({
    message: `Hello ${user.username}`,
  });
});

export default router;
