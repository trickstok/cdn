import { Application } from "express-serve-static-core";
import indexRouter from "./App/Controllers/indexController";
import mediaRouter from "./App/Controllers/mediaController";
import checkAuthenticated from "./App/Helpers/middlewares/checkAuthenticated";

const routes = (app: Application) => {
  app.use("/", indexRouter);
  app.use("/media", checkAuthenticated, mediaRouter);
};

export default routes;
