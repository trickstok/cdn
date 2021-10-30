import express, { Application, Request, Response, NextFunction } from "express";

// Utilities
import path from "path";
import cors from "cors";
import morgan from "morgan";

// Configurations
import dotenv from "dotenv";
dotenv.config();
import config from "config";

// Routes
import useRoutes from "./routes";

// Custom logger
import logger from "./App/Helpers/utilities/logger";

// Custom Middlewares
import { error404, errorHandler } from "./App/Helpers/middlewares/errorHandler";

// Port
const port: number = config.get<number>("server.port");

// App
const app: Application = express();

// Cors
const corsOrigin: string = config.get<string>("server.corsOrigin");
app.use(
  cors({
    origin: corsOrigin,
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
  })
);

// Utilities
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(morgan("dev"));

// Use routes
useRoutes(app);

// Error handling
app.use(error404);
app.use(errorHandler);

// Start server
app.listen(port, async () => {
  logger.info(`App listening on port ${port}`);
});
