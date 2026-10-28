// Health check controller to verify backend readiness

export const getHealthStatus = (req, res) => {
  res.status(200).json({
    status: 'ok',
    message: 'Kisan Market Express API is running',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development',
  });
};
