const multer = require('multer');
const path = require('path');

// Multer storage configuration
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, 'uploads/courses/'); // Specify the folder for uploaded files
//   },
//   filename: (req, file, cb) => {
//     cb(null, Date.now() + path.extname(file.originalname)); // Generate unique file name
//   },
// });
const storage = multer.memoryStorage();

// // Multer file filter for images
// const fileFilter = (req, file, cb) => {
//   const fileTypes = /jpeg|jpg|png/;
//   const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
//   const mimetype = fileTypes.test(file.mimetype);

//   if (extname && mimetype) {
//     return cb(null, true);
//   } else {
//     cb(new Error('Only images (jpeg, jpg, png) are allowed.'));
//   }
// };

// // Multer middleware setup
// const upload = multer({
//   storage: storage,
//   limits: { fileSize: 5 * 1024 * 1024 }, // Limit file size to 5MB
//   fileFilter: fileFilter,
// }).single('courseImage'); // Expecting the file to be uploaded under 'courseImage' field

// // Multer middleware function
// const multerMiddleware = (req, res, next) => {
//   upload(req, res, (err) => {
//     if (err) {
//       // Handle Multer-specific errors
//       return res.status(400).json({
//         success: false,
//         message: err.message,
//       });
//     }
//     // Proceed to the next middleware or route handler
//     next();
//   });
// };

// Multer file filter for images
const fileFilter = (req, file, cb) => {
  const fileTypes = /jpeg|jpg|png/;
  const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = fileTypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb(new Error('Only images (jpeg, jpg, png) are allowed.'));
  }
};

// Multer middleware setup
const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: fileFilter,
}).single('courseImage');

const multerMiddleware = (req, res, next) => {
  upload(req, res, (err) => {
    if (err) {
      return res.status(400).json({
        success: false,
        message: err.message,
      });
    }
    next();
  });
};

// Exporting the middleware
module.exports = {
  multerMiddleware,
};