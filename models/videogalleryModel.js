const mongoose = require('mongoose');

// Define the schema for the video gallery filters
const videoGallerySchema = new mongoose.Schema({
  category: {
    type: String,
    required: true,
  },
  minPrice: {
    type: Number,
    required: false,
  },
  maxPrice: {
    type: Number,
    required: false,
  },
  rating: {
    type: Number,
    required: false,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

const VideoGallery = mongoose.model('VideoGallery', videoGallerySchema);
module.exports = VideoGallery;
