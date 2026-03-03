/**
 * Health Controller
 * Handles health check requests
 */

const getHealth = (req, res) => {
  const healthStatus = {
    success: true,
    service: 'Notification Service',
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: {
      nodeVersion: process.version,
      platform: process.platform,
      memory: {
        used: `${Math.round(process.memoryUsage().heapUsed / 1024 / 1024)}MB`,
        total: `${Math.round(process.memoryUsage().heapTotal / 1024 / 1024)}MB`
      }
    },
    emailConfigured: !!(process.env.EMAIL_USER && process.env.EMAIL_PASSWORD)
  };

  res.status(200).json(healthStatus);
};

module.exports = {
  getHealth
};
