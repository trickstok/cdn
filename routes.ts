import { Application } from "express-serve-static-core";
import indexRouter from "./App/Controllers/indexController";
import userRouter from "./App/Controllers/userController";
import authRouter from "./App/Controllers/authContoller";
import checkAuthenticated from "./App/Helpers/middlewares/extractJWT";

const routes = (app: Application) => {
  app.use("/", indexRouter);
  app.use("/auth", authRouter);
  app.use("/users", checkAuthenticated, userRouter);
};

export default routes;
