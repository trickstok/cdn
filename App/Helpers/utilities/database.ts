import fs from "fs";
import path from "path";
import { Sequelize, Dialect, DataTypes } from "sequelize";
import config from "config";
import logger from "./logger";

const database: string = config.get<string>("db.database");
const username: string = config.get<string>("db.username");
const password: string = config.get<string>("db.password");
const host: string = config.get<string>("db.host");
const port: number = config.get<number>("db.port");
const dialect = config.get("db.dialect") as Dialect;

const sequelize = new Sequelize(database, username, password, {
  host: host,
  port: port,
  dialect: dialect,
  logging: false,
  // Uncomment if you want db logs
  // logging: (message) => logger.info(message),
});

const db: any = {};
const modelsPath: string = path.join(__dirname, "../../Models");

fs.readdirSync(modelsPath).forEach((file) => {
  const model = require(`${modelsPath}/${file}`)(sequelize, DataTypes);
  db[model.name] = model;
});

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

export default db;
