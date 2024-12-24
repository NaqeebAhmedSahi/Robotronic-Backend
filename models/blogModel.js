const mongoose = require("mongoose");

// Blog Post Schema
const blogPostSchema = new mongoose.Schema({
  image: {
    type: String, // Assuming `img1`, `img2`, etc. are paths or URLs
    required: true,
  },
  tags: {
    type: [String], // Array of strings
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  author: {
    name: {
      type: String,
      required: true,
    },
    avatar: {
      type: String, // URL to the avatar
      required: true,
    },
  },
  date: {
    type: Date,
    required: true,
  },
  shares: {
    type: String, // If shares include "K", it's better to store them as a string
    required: true,
  },
});
const BlogPost = mongoose.model("BlogPost", blogPostSchema);
module.exports = BlogPost;
