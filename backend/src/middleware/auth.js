const jwt = require('jsonwebtoken');
const config = require('../config/config');
const { User } = require('../models');

const authMiddleware = async (req, res, next) => {
  try {
    // Support token from Authorization header OR query parameter (for audio streaming)
    let token = req.headers.authorization?.split(' ')[1];

    // Fallback to query parameter for direct browser access (e.g., audio playback)
    if (!token && req.query.token) {
      token = req.query.token;
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'No token provided. Authentication required.'
      });
    }

    const decoded = jwt.verify(token, config.jwtSecret);
    const user = await User.findByPk(decoded.id);

    if (!user || !user.is_active) {
      return res.status(401).json({
        success: false,
        message: 'Invalid token or user not active.'
      });
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token expired. Please login again.'
      });
    }
    return res.status(401).json({
      success: false,
      message: 'Invalid token.'
    });
  }
};

module.exports = authMiddleware;
