import { Application } from "express-serve-static-core";
import indexRouter from "./App/Controllers/indexController";
import imageRouter from "./App/Controllers/imageController";
import checkAuthenticated from "./App/Helpers/middlewares/checkAuthenticated";

const routes = (app: Application) => {
  app.use("/", indexRouter);
  app.use("/image", checkAuthenticated, imageRouter);
};

export default routes;
