const config = require("config");

const cfg = {
  app: {
    name: config.get("app.name"),
    port: config.get("app.port"),
    secret: config.get("app.secret"),
    url: config.get("app.url"),
    jwtDuration: config.get("app.jwtDuration") || "20m",
    jwtDurationLong: config.get("app.jwtDurationLong") || "7m",
    otpValidateDuration: config.get("app.otpValidateDuration") || 300,
    enablePasswordAuthentication: config.get(
      "app.enablePasswordAuthentication"
    ),
    autoUserApprove: config.get("app.autoUserApprove") || false,
  },
  db: {
    username: config.get("db.username"),
    password: config.get("db.password"),
    dialect: "postgres",
    //ToDo Change default db name
    database: config.get("db.database") || "backend-seed",
    host: config.get("db.host") || "localhost",
  },
  cors: config.get("cors")[process.env.ENV_TYPE],
};

module.exports = cfg;
