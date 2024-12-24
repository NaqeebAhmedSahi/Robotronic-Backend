
const BlogPost = require("../models/blogModel");

// Get all blog posts with pagination
const getAllPosts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1; // Default to page 1 if no query param is provided
    const limit = parseInt(req.query.limit) || 10; // Default to 10 posts per page
    const skip = (page - 1) * limit;

    const totalPosts = await BlogPost.countDocuments(); // Get the total number of posts
    const posts = await BlogPost.find().skip(skip).limit(limit);

    res.json({
      data: posts,
      totalPages: Math.ceil(totalPosts / limit),
      currentPage: page,
    });
  } catch (error) {
    res.status(500).json({ message: `Error retrieving posts ${error}` });
  }
};

// Create a new blog post
const createPost = async (req, res) => {
  const { image, tags, title, description, author, date, shares } = req.body;

  const newPost = new BlogPost({
    image,
    tags,
    title,
    description,
    author,
    date,
    shares,
  });

  try {
    await newPost.save();
    res.status(201).json(newPost);
  } catch (error) {
    res.status(500).json({ message: "Error creating post" });
  }
};

// Get a single blog post by ID
const getPostById = async (req, res) => {
  try {
    const post = await BlogPost.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    res.json(post);
  } catch (error) {
    res.status(500).json({ message: `Error retrieving post hammad ${error}` });
  }
};

// Update a blog post by ID
const updatePost = async (req, res) => {
  try {
    const updatedPost = await BlogPost.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
      }
    );
    if (!updatedPost) {
      return res.status(404).json({ message: "Post not found" });
    }
    res.json(updatedPost);
  } catch (error) {
    res.status(500).json({ message: "Error updating post" });
  }
};

// Delete a blog post by ID
const deletePost = async (req, res) => {
  try {
    const deletedPost = await BlogPost.findByIdAndDelete(req.params.id);
    if (!deletedPost) {
      return res.status(404).json({ message: "Post not found" });
    }
    res.json({ message: "Post deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting post" });
  }
};

module.exports = {
  getAllPosts,
  createPost,
  getPostById,
  updatePost,
  deletePost,
};