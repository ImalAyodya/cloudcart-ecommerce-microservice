const { validateUser } = require("../services/externalServices");

const normalizeAuthenticatedUser = (payload) => {
  const user = payload?.user || payload || {};

  return {
    id: String(user?._id || user?.id || "").trim(),
    email: String(user?.email || "").trim(),
    role: String(user?.role || "user").trim().toLowerCase(),
    raw: user,
  };
};

const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Authorization token is required" });
    }

    const profilePayload = await validateUser(authHeader);
    const user = normalizeAuthenticatedUser(profilePayload);

    if (!user.id) {
      return res.status(401).json({ message: "Invalid token or user not found" });
    }

    req.user = user;
    return next();
  } catch (error) {
    const statusCode = Number(error?.response?.status) || 503;
    const message =
      error?.response?.data?.message ||
      error?.response?.data?.error ||
      (statusCode === 503 ? "User service unavailable" : "Authentication failed");

    return res.status(statusCode).json({ message });
  }
};

const adminOnly = (req, res, next) => {
  if (String(req.user?.role || "").toLowerCase() === "admin") {
    return next();
  }

  return res.status(403).json({ message: "Access denied, admin only" });
};

module.exports = {
  protect,
  adminOnly,
};
