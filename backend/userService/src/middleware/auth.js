const { verifyToken } = require("../utils/jwt");

// Expects Authorization: Bearer <token>
const authMiddleware = (req, res, next) => {
  const auth = req.headers.authorization || req.headers.Authorization;
  if (!auth || !auth.startsWith("Bearer ")) return res.status(401).json({ message: "No token provided" });

  const token = auth.split(" ")[1];
  try {
    const payload = verifyToken(token);
    req.userId = payload.id;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

module.exports = authMiddleware;
