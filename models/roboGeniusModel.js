const mongoose = require('mongoose');

const roboGeniusSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  monthlyPrice: {
    type: Number,
    min: 0, // Ensures positive values
  },
  annualPrice: {
    type: Number,
    min: 0, // Ensures positive values
  },
  category: {
    type: String,
    required: true,
  },
  whatYouLearn: {
    description: {
      type: String,
      required: true, // Ensures a description is provided
    },
    skills: {
      type: String,
      required: true, // Ensures skills are provided
    },
  },
  targetAudience: {
    type: String,
    required: true,
  },
  features: {
    type: String, // Optional
  },
  requirements: {
    type: String, // Optional
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
    required: true,
  },
  videoUrl: {
    type: String,
    required: true,
  },
  image: {
    filename: {
      type: String,
    },
    url: {
      type: String,
    },
  },
});

module.exports = mongoose.model('RoboGenius', roboGeniusSchema);
