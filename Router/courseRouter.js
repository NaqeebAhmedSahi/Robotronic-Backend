const express = require("express");
const router = express.Router();
const {
  createCourse,
  getAllCourses,
  getCourseById,
  updateCourseById,
  getCoursesByCategory,
  deleteCourse,
  getEnrolledStudents,
  enrollInCourse,
  getEnrolledCourses,
  unenrollFromCourse,
  getStudentsInCourse,
} = require("../Controller/courseController");
const { protectC, isInstructor,  } = require("../middleware/courseMiddleware"); // Assuming you have these middlewares
const { multerMiddleware } = require("../middleware/multerMiddleware")

// Route to create a new course (Instructor only)
router.post('/create-course', createCourse);

// Route to get all courses (Open to everyone)
router.get("/all/courses", getAllCourses);

// Route to get a specific course by ID
router.get("/courses/:id", getCourseById);

// Route to update a specific course by ID (Instructor only)
router.put("/courses/:id", updateCourseById);
// router.put("/courses/:id", protectC, isInstructor, updateCourseById);


// Route to get courses by category
router.get("/courses/category", getCoursesByCategory);

// DELETE /api/courses/:id - Delete a course by ID (Instructor only)
router.delete('/coursesById/:id', deleteCourse);

// GET /api/courses/:id/students - Get a list of students enrolled in a specific course (Instructor only)
router.get('/:id/students', protectC, isInstructor, getEnrolledStudents);

// Enroll the authenticated user in a course
router.post('/:id/enroll', protectC, enrollInCourse);

// Get a list of courses the authenticated user is enrolled in
router.get('/enrolled', protectC, getEnrolledCourses);

// Unenroll the authenticated user from a course
// router.delete('/:id/unenroll', protectC, unenrollFromCourse);

// Get a list of students enrolled in a specific course
router.get('/:id/students', protectC, isInstructor, getStudentsInCourse);

module.exports = router;