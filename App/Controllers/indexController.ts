import config from "config";
import express, { Router } from "express";
import checkAuthenticated from "../Helpers/middlewares/checkAuthenticated";

const router: Router = express.Router();

router.get("/", checkAuthenticated, async (req, res) => {
  res.json({
    message: `Hello Api`,
  });
});

export default router;
