// controllers/productController.js
const Product = require('../models/product');
const Review = require('../models/reviews');
const multer = require('multer');
const path = require('path');
const fs = require('fs'); // For handling file deletion


// Get all products with filters
// const getProducts = async (req, res) => {
//   try {
//     const { category, minPrice, maxPrice, minRating, maxRating } = req.query;

//     // Create a filter object
//     let filter = {};

//     // Add category filter if provided
//     if (category) {
//       filter.category = category;
//     }

//     // Add price range filter if provided
//     if (minPrice || maxPrice) {
//       filter.price = {};
//       if (minPrice) {
//         filter.price.$gte = minPrice; // Price greater than or equal to minPrice
//       }
//       if (maxPrice) {
//         filter.price.$lte = maxPrice; // Price less than or equal to maxPrice
//       }
//     }

//     // Add rating range filter if provided
//     if (minRating || maxRating) {
//       filter.rating = {};
//       if (minRating) {
//         filter.rating.$gte = minRating; // Rating greater than or equal to minRating
//       }
//       if (maxRating) {
//         filter.rating.$lte = maxRating; // Rating less than or equal to maxRating
//       }
//     }

//     // Fetch products based on the filters
//     const products = await Product.find(filter);

//     // Respond with the filtered products
//     res.status(200).json({ success: true, count: products.length, products });
//   } catch (error) {
//     res.status(500).json({ success: false, message: 'Server error' });
//   }
// };
const getProducts = async (req, res) => {
  try {
    // Fetch all courses from the database
    const products = await Product.find();

    // Return the products as a response
    res.status(200).json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch products. Please try again later.',
      error: error.message,
    });
  }
};

//     Get a product by ID
const getProductById = async (req, res) => {
  console.log(req.params.id);
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    res.status(200).json({ success: true, product });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

//     Add a new product
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Specify the folder for storing images
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname)); // Append a unique suffix to avoid name conflicts
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB file size limit
  fileFilter: (req, file, cb) => {
    const fileTypes = /jpeg|jpg|png/; // Allow only specific file types
    const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
    const mimeType = fileTypes.test(file.mimetype);

    if (extname && mimeType) {
      cb(null, true);
    } else {
      cb(new Error('Only images (jpeg, jpg, png) are allowed.'));
    }
  },
}).single('image'); // Single image upload with the field name 'image'

// Controller function
const addProduct = (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ error: err.message });
    }

    const { name, description, price, category, stock, brand, ratings } = req.body;

    try {
      // Create a new product object
      const newProduct = new Product({
        name,
        description,
        price: parseFloat(price),
        category,
        stock: parseInt(stock, 10),
        brand,
        averageRating: ratings ? parseFloat(ratings) : 0,
      });

      // Add image details if an image was uploaded
      if (req.file) {
        newProduct.image = {
          filename: req.file.filename,
          url: `http://localhost:8080/uploads/${req.file.filename}`, // Set the accessible URL for the image
        };
      }

      // Save the product to the database
      const savedProduct = await newProduct.save();
      res.status(201).json({ success: true, product: savedProduct });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, error: 'Failed to add product.' });
    }
  });
};

//    Update a product by ID
// const updateProduct = async (req, res) => {
//   try {
//     const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
//       new: true,
//       runValidators: true,
//     });

//     if (!product) {
//       return res.status(404).json({ success: false, message: 'Product not found' });
//     }

//     res.status(200).json({ success: true, product });
//   } catch (error) {
//     res.status(400).json({ success: false, message: 'Error updating product' });
//   }
// };

const updateProduct = async (req, res) => {
  // Use Multer to handle file upload
  upload(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ success: false, message: 'File upload failed.', error: err.message });
    }
    console.log("Body", req.body);
    try {
      const { name, description, price, category, stock, brand, ratings } = req.body;
      const productId = req.params.id; // Product ID from the URL parameter

      // Check if the product exists
      const product = await Product.findById(productId);
      if (!product) {
        return res.status(404).json({
          success: false,
          message: 'Product not found.',
        });
      }

      // Check if at least one field is provided for the update
      if (!name && !description && !price && !category && !stock && !brand && !ratings) {
        return res.status(400).json({
          success: false,
          message: 'At least one field must be provided for update.',
        });
      }

      // Validate price if provided
      if (price && price <= 0) {
        return res.status(400).json({
          success: false,
          message: 'Price must be a positive number.',
        });
      }

      // Prepare the image data if a new file was uploaded
      let image = product.image; // Keep the existing image if no new file is uploaded
      if (req.file) {
        // Delete the old image from the file system
        if (product.image && product.image.filename) {
          const oldImagePath = `uploads/${product.image.filename}`;
          if (fs.existsSync(oldImagePath)) {
            fs.unlinkSync(oldImagePath); // Delete the file
          }
        }

        image = {
          filename: req.file.filename,
          url: `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`,
        };
      }

      // Update the product details with the new data
      product.name = name || product.name;
      product.description = description || product.description;
      product.price = price || product.price;
      product.category = category || product.category;
      product.stock = stock || product.stock;
      product.brand = brand || product.brand;
      product.ratings = ratings || product.ratings;
      product.image = image; // Update the image if a new one is uploaded

      await product.save();

      res.status(200).json({
        success: true,
        message: 'Product updated successfully.',
        product,
      });
    } catch (error) {
      console.error('Error updating product:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to update product. Please try again later.',
        error: error.message,
      });
    }
  });
};

module.exports = updateProduct;



//    Delete a product by ID
const deleteProduct = async (req, res) => {
  console.log(req.params.id);
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    res.status(200).json({ success: true, message: 'Product deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

//    Get products by category
const getProductsByCategory = async (req, res) => {
  try {
    const products = await Product.find({ category: req.params.category });
    res.status(200).json({ success: true, count: products.length, products });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

//    Add a review to a product
const addReview = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    const review = await Review.create({
      product: req.params.id,
      user: req.user._id,
      rating: req.body.rating,
      comment: req.body.comment,
    });

    res.status(201).json({ success: true, review });
  } catch (error) {
    res.status(400).json({ success: false, message: 'Error adding review' });
  }
};

//    Get reviews for a product
const getProductReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ product: req.params.id });
    res.status(200).json({ success: true, count: reviews.length, reviews });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

//    Update a review by ID
const updateReview = async (req, res) => {
  try {
    const review = await Review.findByIdAndUpdate(req.params.reviewId, req.body, {
      new: true,
      runValidators: true,
    });

    if (!review) {
      return res.status(404).json({ success: false, message: 'Review not found' });
    }

    res.status(200).json({ success: true, review });
  } catch (error) {
    res.status(400).json({ success: false, message: 'Error updating review' });
  }
};

//    Delete a review by ID
const  deleteReview = async (req, res) => {
  try {
    const review = await Review.findByIdAndDelete(req.params.reviewId);

    if (!review) {
      return res.status(404).json({ success: false, message: 'Review not found' });
    }

    res.status(200).json({ success: true, message: 'Review deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

module.exports = {
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
}
