import config from "config";
import express, { Router } from "express";
import HttpStatusCode from "../Enums/HttpStatusCodes";
import checkAuthenticated from "../Helpers/middlewares/checkAuthenticated";

const router: Router = express.Router();

router.get("/", checkAuthenticated, async (req, res) => {
  res.status(HttpStatusCode.OK).json({
    message: `Hello Media CDN`,
  });
});

export default router;
