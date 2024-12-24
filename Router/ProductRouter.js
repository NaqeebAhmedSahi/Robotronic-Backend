const express = require('express');
const router = express.Router();
const { protectC, isAdmin } = require('../middleware/courseMiddleware');
const { multerMiddleware } = require('../middleware/multerMiddleware'); // Import Multer middleware
const {
  getProducts,
  getProductById,
  addProduct,
  updateProduct,
  deleteProduct,
  getProductsByCategory,
  addReview,
  getProductReviews,
  updateReview,
  deleteReview,
} = require('../Controller/ProductController');

// Public routes
router.get('/getProducts', getProducts);
router.get('/getProductById/:id', getProductById);
router.get('/category/:category', getProductsByCategory);
router.get('/:id/reviews', getProductReviews);
// Add this new route
// router.get('/:id/image', getProductImage);

// Admin-only routes
// router.post('/addProduct', protectC, isAdmin, multerMiddleware, addProduct); // Add multerMiddleware here
// router.post('/addProduct', multerMiddleware, addProduct); // Add multerMiddleware here
router.post('/addProduct', addProduct); // Add multerMiddleware here
router.put('/updateProduct/:id',  updateProduct);
// router.delete('/:id', protectC, isAdmin, deleteProduct);
router.delete('/deleteProduct/:id', deleteProduct);

// Review routes
router.post('/:id/review', protectC, addReview);
router.put('/:id/reviews/:reviewId', protectC, isAdmin, updateReview);
// router.delete('/:id/reviews/:reviewId', protectC, isAdmin, deleteReview);

module.exports = router;
