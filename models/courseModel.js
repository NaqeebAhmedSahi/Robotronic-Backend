const mongoose = require('mongoose');

// Define the Video Schema
const VideoSchema = new mongoose.Schema({
  id: { type: String, required: true }, // Unique identifier for the video
  name: { type: String, required: true }, // Video title
  description: { type: String, required: true }, // Description of the video
  link: { type: String, required: false }, // Link to the uploaded video (optional)
});

// Define the Section Schema
const SectionSchema = new mongoose.Schema({
  id: { type: String, required: true }, // Unique identifier for the section
  name: { type: String, required: true }, // Section title
  description: { type: String, required: true }, // Section description
  videos: { type: [VideoSchema], required: true }, // Array of embedded videos
});

// Define the Course Schema
const CourseSchema = new mongoose.Schema({
  title: { type: String, required: true }, // Course title
  description: { type: String, required: true }, // Course description
  instructor: { type: String, required: true }, // Instructor's name or ID (string for now)
  duration: { type: Number, required: true }, // Duration in hours
  price: { type: Number, required: true }, // Price of the course
  category: { type: String, enum: ["course", "product"], required: true }, // Category (course or product)
  level: { type: String, enum: ["Beginner", "Intermediate", "Advanced"], required: true }, // Course difficulty level
  students: { type: [String], default: [] }, // Array of student IDs (strings for now)
  sections: { type: [SectionSchema], required: true }, // Array of embedded sections with videos
  image: {
    filename: { type: String, required: false },
    url: { type: String, required: false },
  },
  createdAt: { type: Date, default: Date.now }, // Timestamp for creation
});

// Export the Course model
module.exports = mongoose.model('Course', CourseSchema);
