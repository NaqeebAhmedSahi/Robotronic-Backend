
const roboGenius = require("../models/roboGeniusModel");
// const User = require("../models/User"); // Assuming your user model is named userModel
const multer = require('multer');
const path = require('path');
const fs = require('fs'); // For handling file deletion
// Create a new course (Instructor only
// Multer configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Path to store uploaded files
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName);
  },
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    if (!allowedTypes.includes(file.mimetype)) {
      return cb(new Error('Only JPEG, PNG, and JPG files are allowed'), false);
    }
    cb(null, true);
  },
}).single('image'); // Field name in the form for the file upload


const createRoboGenius = async (req, res) => {
    // Use Multer to handle file upload
    upload(req, res, async (err) => {
      if (err) {
        return res.status(400).json({
          success: false,
          message: "File upload failed.",
          error: err.message,
        });
      }
  
      console.log("Body received:", req.body);
  
      try {
        // Validate required fields
        const {
          title,
          description,
          monthlyPrice,
          annualPrice,
          category,
          whatYouLearnDescription,
          skills,
          targetAudience,
          features,
          averageRating,
          videoUrl,
        } = req.body;
  
        if (
          !title ||
          !description ||
          !category ||
          !whatYouLearnDescription ||
          !skills ||
          !targetAudience ||
          !averageRating ||
          !videoUrl
        ) {
          return res.status(400).json({
            success: false,
            message: "All required fields must be provided.",
          });
        }
  
        // Validate numeric fields
        const parsedMonthlyPrice = parseFloat(monthlyPrice);
        const parsedAnnualPrice = parseFloat(annualPrice);
        const parsedAverageRating = parseFloat(averageRating);
  
        if (parsedMonthlyPrice && parsedMonthlyPrice <= 0) {
          return res.status(400).json({
            success: false,
            message: "Monthly price must be a positive number.",
          });
        }
  
        if (parsedAnnualPrice && parsedAnnualPrice <= 0) {
          return res.status(400).json({
            success: false,
            message: "Annual price must be a positive number.",
          });
        }
  
        if (parsedAverageRating < 1 || parsedAverageRating > 5) {
          return res.status(400).json({
            success: false,
            message: "Average rating must be between 1 and 5.",
          });
        }
  
        // Create the whatYouLearn object
        const whatYouLearn = {
          description: whatYouLearnDescription,
          skills,
        };
  
        // Prepare the image data if a file was uploaded
        const image = req.file
          ? {
              filename: req.file.filename,
              url: `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`,
            }
          : null;
  
        // Create a new course with the uploaded image details
        const newRoboGenius = new roboGenius({
          title,
          description,
          monthlyPrice: parsedMonthlyPrice || null,
          annualPrice: parsedAnnualPrice || null,
          category,
          whatYouLearn, // Pass the whatYouLearn object directly
          targetAudience,
          features,
          rating: parsedAverageRating,
          videoUrl,
          image,
        });
  
        // Save the course to the database
        await newRoboGenius.save();
  
        // Send the success response
        res.status(201).json({
          success: true,
          message: "Course added successfully.",
          course: newRoboGenius,
        });
      } catch (error) {
        console.error("Error adding course:", error);
        res.status(500).json({
          success: false,
          message: "Failed to add course. Please try again later.",
          error: error.message,
        });
      }
    });
  };
  
  
  
  
  
  
  

module.exports = {
    createRoboGenius
};