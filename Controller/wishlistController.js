const Wishlist = require('../models/wishlistModel');

// Add product to wishlist
const addToWishlist = async (req, res) => {
    try {
        const { productId } = req.body;
        let wishlist = await Wishlist.findOne({ user: req.user._id });

        if (!wishlist) {
            wishlist = new Wishlist({ user: req.user._id, products: [productId] });
        } else {
            if (!wishlist.products.includes(productId)) {
                wishlist.products.push(productId);
            }
        }
        const savedWishlist = await wishlist.save();
        res.status(200).json(savedWishlist);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get user wishlist
const getWishlist = async (req, res) => {
    try {
        const wishlist = await Wishlist.findOne({ user: req.user._id }).populate('products');
        res.status(200).json(wishlist);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Remove product from wishlist
const removeFromWishlist = async (req, res) => {
    try {
        const { productId } = req.params;
        const wishlist = await Wishlist.findOne({ user: req.user._id });

        if (!wishlist) {
            return res.status(404).json({ message: 'Wishlist not found' });
        }

        wishlist.products = wishlist.products.filter(product => product.toString() !== productId);
        const savedWishlist = await wishlist.save();
        res.status(200).json(savedWishlist);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


module.exports = {
    addToWishlist,
    getWishlist,
    removeFromWishlist,
  };