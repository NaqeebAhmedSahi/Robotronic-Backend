
const Course = require("../models/courseModel");
const User = require("../models/User"); // Assuming your user model is named userModel
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


// Updated createCourse function
const createCourse = async (req, res) => {
  // Use Multer to handle file upload
  upload(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ success: false, message: 'File upload failed.', error: err.message });
    }

    try {
      const { title, description, instructor, duration, price, category, level, sections } = req.body;

      // Check if all required fields are provided
      if (!title || !description || !instructor || !duration || !price || !category || !level || !sections) {
        return res.status(400).json({
          success: false,
          message: 'All required fields must be provided.',
        });
      }

      // Validate that price is a positive number
      if (price <= 0) {
        return res.status(400).json({
          success: false,
          message: 'Price must be a positive number.',
        });
      }

      // Parse sections if provided as a string
      let parsedSections;
      try {
        parsedSections = typeof sections === 'string' ? JSON.parse(sections) : sections;
      } catch (parseError) {
        return res.status(400).json({
          success: false,
          message: 'Invalid JSON format for sections.',
        });
      }

      // Prepare the image data if a file was uploaded
      const image = req.file
        ? {
            filename: req.file.filename,
            url: `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`,
          }
        : null;

      // Create a new course with the uploaded image details
      const newCourse = new Course({
        title,
        description,
        instructor,
        duration,
        price,
        category,
        level,
        sections: parsedSections, // Use the parsed sections
        image, // Add the image object
      });

      await newCourse.save();

      res.status(201).json({
        success: true,
        message: 'Course added successfully.',
        course: newCourse,
      });
    } catch (error) {
      console.error('Error adding course:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to add course. Please try again later.',
        error: error.message,
      });
    }
  });
};












// Get all courses with filters
// const getAllCourses = async (req, res) => {
//   try {
//     const { category, level, minPrice, maxPrice, minDuration, maxDuration } = req.query;

//     // Create a filter object
//     let filter = {};

//     // Add category filter if provided
//     if (category) {
//       filter.category = category;
//     }

//     // Add level filter if provided
//     if (level) {
//       filter.level = level;
//     }

//     // Add price range filter if provided
//     if (minPrice || maxPrice) {
//       filter.price = {};
//       if (minPrice) {
//         filter.price.$gte = minPrice; // Price greater than or equal to minPrice
//       }
//       if (maxPrice) {
//         filter.price.$lte = maxPrice; // Price less than or equal to maxPrice
//       }
//     }

//     // Add duration range filter if provided
//     if (minDuration || maxDuration) {
//       filter.duration = {};
//       if (minDuration) {
//         filter.duration.$gte = minDuration; // Duration greater than or equal to minDuration
//       }
//       if (maxDuration) {
//         filter.duration.$lte = maxDuration; // Duration less than or equal to maxDuration
//       }
//     }

//     // Fetch courses based on the filters
//     const courses = await Course.find(filter).populate("instructor", "username email");

//     // Respond with the filtered courses
//     res.status(200).json({
//       success: true,
//       data: courses,
//     });
//   } catch (error) {
//     console.error("Error fetching courses:", error);
//     res.status(500).json({
//       success: false,
//       message: `Server Error. Please try again later. ${error}`,
//     });
//   }
// };
// Controller function to fetch all courses
const getAllCourses = async (req, res) => {
  try {
    // Fetch all courses from the database
    const courses = await Course.find();

    // Return the courses as a response
    res.status(200).json(courses);
  } catch (error) {
    console.error('Error fetching courses:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch courses. Please try again later.',
      error: error.message,
    });
  }
};


// Get details of a specific course by ID
const getCourseById = async (req, res) => {
  try {
    const { id } = req.params;

    // Find course by ID and populate instructor details
    const course = await Course.findById(id).populate(
      "instructor",
      "username email"
    );

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    res.status(200).json({
      success: true,
      data: course,
    });
  } catch (error) {
    console.error("Error fetching course:", error);
    res.status(500).json({
      success: false,
      message: `Server Error. Please try again later. ${error}`,
    });
  }
};



const updateCourseById = async (req, res) => {
  // Use Multer to handle file upload
  upload(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ success: false, message: 'File upload failed.', error: err.message });
    }

    try {
      const { title, description, instructor, duration, price, category, level, sections } = req.body;
      const courseId = req.params.id;  // Course ID from the URL parameter

      // Check if the course exists
      const course = await Course.findById(courseId);
      if (!course) {
        return res.status(404).json({
          success: false,
          message: 'Course not found.',
        });
      }

      // Check if all required fields are provided (only validate fields that are part of the update)
      if (!title && !description && !instructor && !duration && !price && !category && !level && !sections) {
        return res.status(400).json({
          success: false,
          message: 'At least one field must be provided for update.',
        });
      }

      // Validate price if it's provided
      if (price && price <= 0) {
        return res.status(400).json({
          success: false,
          message: 'Price must be a positive number.',
        });
      }

      // Parse sections if provided as a string
      let parsedSections = course.sections; // Keep existing sections if none provided
      if (sections) {
        try {
          parsedSections = typeof sections === 'string' ? JSON.parse(sections) : sections;
        } catch (parseError) {
          return res.status(400).json({
            success: false,
            message: 'Invalid JSON format for sections.',
          });
        }
      }

      // Prepare the image data if a new file was uploaded
      let image = course.image;  // Keep the existing image if no new file is uploaded
      if (req.file) {
        // Delete the old image from the file system
        if (course.image && course.image.filename) {
          const oldImagePath = `uploads/${course.image.filename}`;
          if (fs.existsSync(oldImagePath)) {
            fs.unlinkSync(oldImagePath); // Delete the file
          }
        }

        image = {
          filename: req.file.filename,
          url: `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`,
        };
      }

      // Update the course details with the new data
      course.title = title || course.title;
      course.description = description || course.description;
      course.instructor = instructor || course.instructor;
      course.duration = duration || course.duration;
      course.price = price || course.price;
      course.category = category || course.category;
      course.level = level || course.level;
      course.sections = parsedSections;  // Use the parsed sections
      course.image = image;  // Update the image if a new one is uploaded

      await course.save();

      res.status(200).json({
        success: true,
        message: 'Course updated successfully.',
        course,
      });
    } catch (error) {
      console.error('Error updating course:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to update course. Please try again later.',
        error: error.message,
      });
    }
  });
};








// Get courses by category
const getCoursesByCategory = async (req, res) => {
  try {
    const category = req.params.category;

    // Find courses with the specified category
    const courses = await Course.find({ category });

    // If no courses are found, respond with a message
    if (courses.length === 0) {
      return res.status(404).json({
        success: false,
        message: `No courses found in the category: ${category}`,
      });
    }

    // Respond with the list of courses
    res.status(200).json({
      success: true,
      data: courses,
    });
  } catch (error) {
    console.error("Error fetching courses by category:", error);
    res.status(500).json({
      success: false,
      message: `Server Error. Please try again later. ${error}`,
    });
  }
};

const deleteCourse = async (req, res) => {
  try {
    console.log("Entered");
    const courseId = req.params.id;
    // Find and delete the course by its ID
    const course = await Course.findByIdAndDelete(courseId);

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    res.json({ message: "Course deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};


// Get enrolled students in a specific course (Instructor only)
const getEnrolledStudents = async (req, res) => {
  try {
    const courseId = req.params.id;

    // Find the course by ID and populate the 'students' field
    const course = await Course.findById(courseId).populate(
      "students",
      "username email"
    );

    // Check if the course exists
    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    // Check if the logged-in user is the instructor of the course
    if (course.instructor.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message:
          "Access denied. Only the course instructor can view enrolled students.",
      });
    }

    // Return the list of students
    res.status(200).json({
      success: true,
      students: course.students,
    });
  } catch (error) {
    console.error("Error fetching enrolled students:", error);
    res.status(500).json({
      success: false,
      message: `Server Error. Please try again later. ${error}`,
    });
  }
};

// Enroll the authenticated user in a course
const enrollInCourse = async (req, res) => {
  try {
    const courseId = req.params.id;
    const userId = req.user._id;

    // Find the course by ID
    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    // Check if the user is already enrolled
    if (course.students.includes(userId)) {
      return res.status(400).json({
        success: false,
        message: "You are already enrolled in this course",
      });
    }

    // Add the user to the list of students
    course.students.push(userId);

    // Save the updated course
    await course.save();

    // Optionally, add the course to the user's enrolled courses list
    const user = await User.findById(userId);
    user.enrolledCourses = user.enrolledCourses || [];
    user.enrolledCourses.push(courseId);
    await user.save();

    res.status(200).json({
      success: true,
      message: "Successfully enrolled in the course",
      data: course,
    });
  } catch (error) {
    console.error("Error enrolling in course:", error);
    res.status(500).json({
      success: false,
      message: `Server Error. Please try again later. ${error.message}`,
    });
  }
};

// Get a list of courses the authenticated user is enrolled in
const getEnrolledCourses = async (req, res) => {
  try {
    // Find courses where the user is enrolled
    const courses = await Course.find({ students: req.user._id });

    if (!courses || courses.length === 0) {
      return res.status(404).json({
        success: false,
        message: "You are not enrolled in any courses.",
      });
    }

    res.status(200).json({
      success: true,
      data: courses,
    });
  } catch (error) {
    console.error("Error fetching enrolled courses:", error);
    res.status(500).json({
      success: false,
      message: `Server Error. Please try again later. ${error}`,
    });
  }
};

// Unenroll the authenticated user from a course
const unenrollFromCourse = async (req, res) => {
  try {
    const courseId = req.params.id;
    const userId = req.user._id;

    // Find the course by ID
    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    // Check if the user is enrolled in the course
    const isEnrolled = course.students.includes(userId);
    if (!isEnrolled) {
      return res.status(400).json({
        success: false,
        message: "You are not enrolled in this course",
      });
    }

    // Unenroll the user from the course
    course.students = course.students.filter(
      (student) => student.toString() !== userId.toString()
    );
    await course.save();

    res.status(200).json({
      success: true,
      message: "You have been unenrolled from the course",
    });
  } catch (error) {
    console.error("Error unenrolling from course:", error);
    res.status(500).json({
      success: false,
      message: `Server Error. Please try again later. ${error}`,
    });
  }
};

// Get a list of students enrolled in a specific course
const getStudentsInCourse = async (req, res) => {
  try {
    const courseId = req.params.id;

    // Find the course by ID and populate the students field
    const course = await Course.findById(courseId).populate('students', 'username email');

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found',
      });
    }

    // Ensure the requesting user is the instructor of the course
    if (course.instructor.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Only the instructor of this course can view enrolled students.',
      });
    }

    // Respond with the list of students
    res.status(200).json({
      success: true,
      data: course.students,
    });
  } catch (error) {
    console.error('Error getting students in course:', error);
    res.status(500).json({
      success: false,
      message: `Server Error. Please try again later. ${error}`,
    });
  }
};

module.exports = {
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
};