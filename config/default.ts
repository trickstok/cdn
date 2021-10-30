export default {
  server: {
    port: process.env.PORT || 3000,
    host: process.env.HOST || "localhost",
    corsOrigin: process.env.CORS_ORIGIN || "http://localhost:3000",
    token: {
      expireTime: process.env.TOKEN_EXPIRE_TIME || 900,
      issuer: process.env.TOKEN_ISSUER || "coolIssuerr",
      secret: process.env.TOKEN_SECRET || "superencryptedsecret",
    },
  },
  db: {
    database: process.env.DB_DATABASE_NAME || "node_rest_api",
    username: process.env.DB_USERNAME || "root",
    password: process.env.DB_PASSWORD || "",
    host: process.env.DB_HOST || "localhost",
    port: process.env.DB_PORT || 3306,
    dialect: process.env.DB_DIALECT || "mysql",
  },
};
