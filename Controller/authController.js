
require("dotenv").config();

console.log("JWT_SECRET:", process.env.JWT_SECRET); // Debug line to check JWT_SECRET

const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require('nodemailer');
const mongoose = require('mongoose');

// Register a new user
const register = async (req, res) => {
  try {
    // Check if the user already exists
    const isExisting = await User.findOne({ email: req.body.email });
    if (isExisting) {
      return res.status(409).json({ msg: "User already registered" });
    }

    // Check if all fields are filled
    if (!req.body.username || !req.body.email || !req.body.password) {
      return res.status(400).json({ msg: "All fields must be populated" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    // Create the user
    const user = await User.create({ ...req.body, password: hashedPassword });

    // Convert user to a plain object and remove the password
    const userObject = user.toObject();
    delete userObject.password;

    // Create JWT token
    const token = createToken(user);

    // Return the user data and token
    return res.status(201).json({ user: userObject, token });
  } catch (error) {
    return res
      .status(500)
      .json({ msg: `Error on register: ${error.message}` });
  }
};

// Login user
const login = async (req, res) => {
  const { email, password } = req.body;

  // Check if all fields are filled
  if (!email || !password) {
    return res.status(400).json({ msg: "All fields must be populated " }); // 400 for bad request
  }

  try {
    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ msg: "Invalid credentials" }); // 401 for unauthorized
    }

    // Compare the provided password with the stored password
    const comparePass = await bcrypt.compare(password, user.password);
    if (!comparePass) {
      return res.status(401).json({ msg: "Invalid credentials" }); // 401 for unauthorized
    }

    // Convert user to a plain object and remove password field
    const userObject = user.toObject();
    delete userObject.password;

    // Create JWT token
    const token = createToken(user);

    // Return the user data and token
    return res.status(200).json({ user: userObject, token });
  } catch (error) {
    return res.status(500).json({ error: `Error: ${error.message}` });
  }
};

// Update user profile
const updateUserProfile = async (req, res) => {
  const user = await User.findById(req.user.id);

  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;

    if (req.body.password) {
      user.password = req.body.password;
    }

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role,
      token: generateToken(updatedUser._id),
    });
  } else {
    res.status(404).json({ message: "User not found" });
  }
};

// Delete user

// create a new user
const createUser = async (req, res) => {
  const User = new User(req.body);
  try {
    const saveUser = await User.save();
    res.status(200).json({
      success: true,
      message: "User is Ceated",
      data: saveUser,
    });
  } catch (e) {
    res.status(500).json({
      success: false,
      message: `internal server error ${e}`,
    });
  }
};

// Get all User
const allUser = async (req, res) => {
  try {
    const user = await User.find();
    res.status(200).json({
      success: true,
      message: "Successfull",
      data: user,
    });
  } catch (e) {
    res.status(500).json({
      success: true,
      message: `Internal Server Error${e}`,
    });
  }
};

// get one user
const getUser = async (req, res) => {
  // Get ID from request parameters
  const id = req.params.id;

  // Check if the ID is a valid MongoDB ObjectId
  const isValidObjectId = mongoose.Types.ObjectId.isValid(id);
  if (!isValidObjectId) {
    return res.status(400).json({
      success: false,
      message: `Invalid ID: ${id}`,
    });
  }

  try {
    // Attempt to find the user by ID
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // If user is found, return the user data
    res.status(200).json({
      success: true,
      message: "Successful",
      data: user,
    });
  } catch (error) {
    // Log the error for server-side debugging
    console.error('Error fetching user:', error);

    // Send a generic error message to the client
    res.status(500).json({
      success: false,
      message: 'Server Error. Please try again later.',
    });
  }
};

// Get user profile
const getUserProfile = async (req, res) => {
  const user = await User.findById(req.user.id);

  if (user) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    });
  } else {
    res.status(404).json({ message: "User not found" });
  }
};

// Helper function to create JWT token
const createToken = (user) => {
  const payload = {
    id: user._id.toString(),
    isAdmin: user.isAdmin,
  };

  // Check if JWT_SECRET is correctly loaded
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined");
  }

  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });

  return token;
};

// @route   PUT /api/auth/reset-password/:resetToken
const resetPassword = async (req, res) => {
  // Get hashed token
  const resetPasswordToken = crypto.createHash('sha256').update(req.params.resetToken).digest('hex');

  try {
      const user = await User.findOne({
          resetPasswordToken,
          resetPasswordExpire: { $gt: Date.now() },
      });

      if (!user) {
          return res.status(400).json({ message: 'Invalid token' });
      }

      // Set new password
      user.password = req.body.password;
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;

      await user.save();

      res.status(200).json({ message: 'Password updated successfully' });
  } catch (error) {
      res.status(500).json({ message: 'Error resetting password' });
  }
};
// forgotPassword
const forgotPassword = async (req, res) => {
    const { email } = req.body;

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: 'No user found with this email' });
        }

        // Generate reset token
        const resetToken = user.getResetPasswordToken();
        await user.save({ validateBeforeSave: false });

        // Create reset URL
        const resetUrl = `${req.protocol}://${req.get('host')}/api/auth/reset-password/${resetToken}`;

        const message = `You requested a password reset. Please go to the following link to reset your password: \n\n ${resetUrl}`;

        // Set up email transporter
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USERNAME,
                pass: process.env.EMAIL_PASSWORD,
            },
        });

        await transporter.sendMail({
            from: `Your App <${process.env.EMAIL_FROM}>`,
            to: user.email,
            subject: 'Password Reset Request',
            text: message,
        });

        res.status(200).json({ message: 'Email sent' });
    } catch (error) {
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        await user.save({ validateBeforeSave: false });

        res.status(500).json({ message: 'Email could not be sent' });
    }
};

// Logout user
const logout = async (req, res) => {
  try {
    // Invalidate the token on the client side (remove from storage)

    // Clear the token from cookies (if you are using cookies for auth)
    res.clearCookie('token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
    });

    // Send response indicating successful logout
    res.status(200).json({
      success: true,
      message: 'User logged out successfully',
    });
  } catch (error) {
    console.error('Error logging out:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error. Please try again later.',
    });
  }
};

module.exports = {
  login,
  register,
  updateUserProfile,
  getUserProfile,
  getUser,
  allUser,
  createUser,
  resetPassword,
  forgotPassword,
  logout
};
