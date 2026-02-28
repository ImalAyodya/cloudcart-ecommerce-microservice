const dotenv = require("dotenv");
const fs = require("fs");
const path = require("path");

// prefer root .env, fallback to src/.env
const rootEnv = path.resolve(process.cwd(), ".env");
const srcEnv = path.resolve(__dirname, "../.env");

if (fs.existsSync(rootEnv)) {
  dotenv.config({ path: rootEnv });
} else if (fs.existsSync(srcEnv)) {
  dotenv.config({ path: srcEnv });
} else {
  dotenv.config();
}

module.exports = {
  PORT: process.env.PORT || 5001,
  MONGO_URI: process.env.MONGO_URI,
  JWT_SECRET: process.env.JWT_SECRET || "changeme",
  TOKEN_EXPIRES_IN: process.env.TOKEN_EXPIRES_IN || "7d",
};
