const express = require("express");
const router = express.Router();
const {
  register,
  login,
  getUserProfile,
  updateUserProfile,
  createUser,
  allUser,
  getUser,
  forgotPassword,
  resetPassword,
  logout
  // deleteUser,
} = require("../Controller/authController");

const { verifyTokenAdmin, verifyToken} = require("../middleware/verifyToken");
const {protect} = require("../middleware/protect");

// Registration route (does not require token)
router.post("/register", register);
// Login route (does not require token)
router.post("/login", login);

// Logout route
router.post('/logout', protect, logout);

// Get user profile (requires authentication)
router.get("/me", getUserProfile);    //router.get("/me", protect, getUserProfile);

// update user profile
router.put("/me", updateUserProfile); //router.put("/me", protect, updateUserProfile);

// create new user
router.post('/',createUser);

// get all users
router.get('/',allUser);

// get user by id
router.get('/find/:id',getUser);    //  http://localhost:8080/find/66b612746f3c27988f47175d

// not tested !!

// forgot-password || /reset-password/:resetToken
router.post('/forgot-password', forgotPassword);
router.put('/reset-password/:resetToken', resetPassword);

// router.delete('/:id',deleteUser);
// router.put('/',updateUser);


// Example of a protected route that requires authentication and admin privileges
router.get("/admin-dashboard", verifyToken, verifyTokenAdmin, (req, res) => {
  res.status(200).json({ msg: "Welcome to the admin dashboard" });
});

module.exports = router;
