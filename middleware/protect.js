const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Middleware to protect routes
const protect = async (req, res, next) => {
  let token;

  // Check for token in Authorization header
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Extract token
      token = req.headers.authorization.split(' ')[1];
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      // Find user by ID
      req.user = await User.findById(decoded.id);
      // Continue to next middleware/route
      next();
    } catch (error) {
      res.status(401).json({
        success: false,
        message: 'Not authorized, token failed',
      });
    }
  } else {
    res.status(401).json({
      success: false,
      message: 'Not authorized, no token',
    });
  }
};

module.exports = { protect }

