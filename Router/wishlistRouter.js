const express = require("express");
const {
  addToWishlist,
  getWishlist,
  removeFromWishlist,
} = require("../Controller/wishlistController");
const { protect } = require("../middleware/protect"); // JWT protection

const router = express.Router();

// Wishlist routes
router.post("/wishlist", protect, addToWishlist);
router.get("/wishlist", protect, getWishlist);
router.delete("/wishlist/:productId", protect, removeFromWishlist);

module.exports = router;
