const { USER_SERVICE_URL } = require('../config/env');

const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization || '';

    if (!authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Not authorized, no token provided' });
    }

    const token = authHeader.split(' ')[1];
    const response = await fetch(`${USER_SERVICE_URL}/api/auth/profile`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
      },
    });

    if (!response.ok) {
      const payload = await response.json().catch(() => ({}));
      return res.status(response.status === 403 ? 403 : 401).json({
        message: payload.message || 'Not authorized, token invalid',
      });
    }

    req.user = await response.json();
    next();
  } catch (error) {
    console.error('Auth middleware error:', error.message);
    return res.status(503).json({ message: 'Authorization service unavailable' });
  }
};

const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    return next();
  }

  return res.status(403).json({ message: 'Access denied, admin only' });
};

module.exports = { protect, adminOnly };