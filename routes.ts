import { Application } from "express-serve-static-core";
import indexRouter from "./App/Controllers/indexController";
import checkAuthenticated from "./App/Helpers/middlewares/checkAuthenticated";

const routes = (app: Application) => {
  app.use("/", indexRouter);
};

export default routes;
