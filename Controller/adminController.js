
const User = require('../models/User');
const Course = require('../models/courseModel');

//   Get a list of all users (Admin only)
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json({
      success: true,
      users,
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({
      success: false,
      message: "Server error. Please try again later.",
    });
  }
};

// Delete a user by ID (Admin only)
const deleteUser = async (req, res) => {
  try {
    // Ensure the user is an admin
    if (!req.user || !req.user.isAdmin) {
      return res.status(403).json({
        success: false,
        message: "Access denied. Only admins can perform this action.",
      });
    }

    // Find and delete the user by ID
    const user = await User.findByIdAndDelete(req.params.id);

    // If the user was not found
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Respond with a success message
    res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({
      success: false,
      message: `Server Error. Please try again later. ${error.message}`,
    });
  }
};

// Get a list of all courses (Admin only).
const getAllCourses = async (req, res) => {
  try {
    const courses = await Course.find().populate(
      "instructor",
      "username email"
    ); // Assuming you want to populate instructor details
    res.status(200).json({
      success: true,
      data: courses,
    });
  } catch (error) {
    console.error("Error fetching courses:", error);
    res.status(500).json({
      success: false,
      message: `Server Error. Please try again later. ${error} `,
    });
  }
};

// Delete a course by ID (Admin only)
const deleteCourse = async (req, res) => {
  try {
    // Ensure the user is an admin
    if (!req.user || !req.user.isAdmin) {
      return res.status(403).json({
        success: false,
        message: "Access denied. Only admins can perform this action.",
      });
    }

    // Find and delete the course by ID
    const course = await Course.findByIdAndDelete(req.params.id);

    // If the course was not found
    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    // Respond with a success message
    res.status(200).json({
      success: true,
      message: "Course deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting course:", error);
    res.status(500).json({
      success: false,
      message: `Server Error. Please try again later. ${error.message}`,
    });
  }
};

// Get site-wide reports and analytics (Admin only)
const getReports = async (req, res) => {
  try {
    // Ensure the user is an admin
    if (!req.user || !req.user.isAdmin) {
      return res.status(403).json({
        success: false,
        message: "Access denied. Only admins can view reports.",
      });
    }

    // Fetch site-wide data for reports
    const totalUsers = await User.countDocuments();
    const totalCourses = await Course.countDocuments();
    const activeUsers = await User.countDocuments({ active: true });
    const inactiveUsers = await User.countDocuments({ active: false });

    // Example of more detailed reports
    const coursesByCategory = await Course.aggregate([
      {
        $group: {
          _id: "$category",
          totalCourses: { $sum: 1 },
          totalStudents: { $sum: { $size: "$students" } },
        },
      },
    ]);

    // Respond with the report data
    res.status(200).json({
      success: true,
      data: {
        totalUsers,
        activeUsers,
        inactiveUsers,
        totalCourses,
        coursesByCategory,
      },
    });
  } catch (error) {
    console.error("Error fetching reports:", error);
    res.status(500).json({
      success: false,
      message: `Server Error. Please try again later. ${error.message}`,
    });
  }
};

module.exports = {
  getAllUsers,
  deleteUser,
  getAllCourses,
  deleteCourse,
  getReports
};