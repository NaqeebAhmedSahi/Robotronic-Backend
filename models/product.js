const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Define the schema for a product
const ProductSchema = new Schema({
    name: {
        type: String,
        required: false,
        trim: true,
    },
    description: {
        type: String,
        required: false,
        trim: true,
    },
    price: {
        type: Number,
        required: false,
    },
    category: {
        type: String,
        required: false,
    },
    stock: {
        type: Number,
        required: false,
        default: 0,
    },
    image: {
        filename: { type: String, required: false },
        url: { type: String, required: false },
      },
    brand: {
        type: String,
        required: false,
    },
    averageRating: {
        type: Number,
        default: 0,
    },
    numOfReviews: {
        type: Number,
        default: 0,
    },
    createdAt: { 
        type: Date, 
        default: Date.now 
    },
    updatedAt: { 
        type: Date 
    },
}, { timestamps: true });

// Pre-save middleware to calculate averageRating and numOfReviews
ProductSchema.pre('save', function (next) {
    if (this.isModified('ratings')) { // Only recalculate if 'ratings' is modified
        if (this.ratings.length > 0) {
            this.numOfReviews = this.ratings.length;
            this.averageRating = this.ratings.reduce((acc, rating) => acc + rating.rating, 0) / this.ratings.length;
        } else {
            this.numOfReviews = 0;
            this.averageRating = 0;
        }
    }
    next();
});

// Create and export the Product model
const Product = mongoose.model('Product', ProductSchema);

module.exports = Product;
