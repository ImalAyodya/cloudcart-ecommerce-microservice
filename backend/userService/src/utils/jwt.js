const jwt = require("jsonwebtoken");
const { JWT_SECRET, TOKEN_EXPIRES_IN } = require("../config/env");

const generateToken = (userId) => {
  return jwt.sign({ id: userId }, JWT_SECRET || "change_this_secret", {
    expiresIn: TOKEN_EXPIRES_IN || "7d",
  });
};

const verifyToken = (token) => {
  return jwt.verify(token, JWT_SECRET || "change_this_secret");
};

module.exports = { generateToken, verifyToken };
