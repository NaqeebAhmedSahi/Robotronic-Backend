const express = require('express');
const { addToCart, getCart, removeFromCart } = require('../controllers/CartController');
const { protect } = require('../middleware/protect'); // JWT protection

const router = express.Router();

// Cart routes
router.post('/cart', protect, addToCart);
router.get('/cart', protect, getCart);
router.delete('/cart/:productId', protect, removeFromCart);

module.exports = router;
