const express = require('express');
const router = express.Router();
const {
  getAllPosts,
  createPost,
  getPostById,
  updatePost,
  deletePost,
} = require('../Controller/blogController');

// API routes
router.get('/blog', getAllPosts);
router.post('/', createPost);
// router.get('/:id', getPostById);
router.put('/:id', updatePost);
router.delete('/:id', deletePost);

module.exports = router;