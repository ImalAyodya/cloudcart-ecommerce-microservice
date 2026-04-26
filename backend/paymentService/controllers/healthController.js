// healthController.js
exports.healthCheck = (req, res) => {
  res.status(200).json({
    status: 'healthy',
    service: 'payment',
    timestamp: new Date().toISOString()
  });
};
