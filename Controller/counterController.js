const Course = require("../models/courseModel");
const Product = require('../models/product');
const User = require("../models/User");

const getCounter = async (req, res) => {
    try {
      res.status(200).json({
        success: true,
        data: {
          courses: 10,
          products: 20,
          users: 30,
        },
      });
    } catch (error) {
      console.error("Error in getCounter function:", error.message);
      res.status(500).json({
        success: false,
        message: "Server error",
        error: error.message, // Include the actual error for debugging.
      });
    }
  };
module.exports = {
  getCounter,
};
