const jwt = require("jsonwebtoken");
const User = require("../models/User"); // Ensure this path is correct

// Middleware to check if the user is an instructor
const isInstructor = (req, res, next) => {
  if (req.user && req.user.isInstructor) {
    next();
  } else {
    res.status(403).json({
      success: false,
      message: "Access denied. Only instructors can perform this action.",
    });
  }
};

// Middleware to protect routes
const protectC = async (req, res, next) => {
  let token;

  // Check for token in Authorization header
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer ")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  // If no token is found
  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Not authorized, no token",
    });
  }

  try {
    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // Find user by ID and attach to request
    req.user = await User.findById(decoded.id);
    if (!req.user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      message: "Not authorized, token failed",
    });
  }
};

// Middleware to check if the user is an admin
const isAdmin = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    res.status(403).json({
      success: false,
      message: "Access denied. Only admins can perform this action.",
    });
  }
};

module.exports = { protectC, isInstructor, isAdmin };
