const VideoGallery = require('../models/videogallery');

// Apply filters and redirect to Facebook page
const applyVideoFilters = async (req, res) => {
  try {
    const { category, minPrice, maxPrice, rating } = req.body;

    // Store the filters in the database (optional)
    const filterData = new VideoGallery({
      category,
      minPrice,
      maxPrice,
      rating,
      userId: req.user._id, // Assuming the user is logged in
    });

    await filterData.save();

    // Modify Facebook URL if necessary based on filters
    const facebookUrl = 'https://www.facebook.com/yourFacebookPage'; 

    // Redirect the user to Facebook
    res.redirect(facebookUrl);
  } catch (error) {
    console.error('Error applying video gallery filters:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error. Please try again later.',
    });
  }
};

module.exports = { applyVideoFilters };
