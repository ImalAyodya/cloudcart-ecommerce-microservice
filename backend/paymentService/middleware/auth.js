const { validateUser } = require("../services/service");

/**
 * Middleware to authenticate user using Bearer token
 * Validates token by calling User Service
 */
const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    // Check if Authorization header exists
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Not authorized, no token provided" });
    }

    // Validate user through User Service
    const user = await validateUser(authHeader);

    // Attach validated user to request
    req.user = user;
    
    next();
  } catch (error) {
    console.error("Auth middleware error:", error.message);
    
    // Handle different error types
    if (error.response) {
      // User Service returned an error
      const status = error.response.status || 401;
      const message = error.response.data?.message || "Authentication failed";
      return res.status(status).json({ error: message });
    }
    
    return res.status(401).json({ error: "Not authorized, token invalid or expired" });
  }
};

/**
 * Middleware to check if user is admin
 * Must be used after protect middleware
 */
const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    return res.status(403).json({ error: "Access denied. Admin privileges required." });
  }
};

module.exports = { protect, adminOnly };
