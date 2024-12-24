const express = require("express");
const {
  getAllUsers,
  deleteUser,
  getAllCourses,
  deleteCourse,
} = require("../Controller/adminController");
const { protectC, isAdmin } = require("../middleware/courseMiddleware"); // Assuming you have these middlewares

const router = express.Router();

// Route to get all users (Admin only)
router.get("/admin/users", protectC, isAdmin, getAllUsers);

// Route to delete a user by ID (Admin only)
router.delete("/users/:id", protectC, isAdmin, deleteUser);

// Route to get all courses (Admin only).
router.get("/admin/allusers", protectC, isAdmin, getAllCourses);

// Route to delete a course by ID (Admin only)
router.delete("/courses/:id", protectC, isAdmin, deleteCourse);

module.exports = router;
