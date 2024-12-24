const express = require('express');
const { applyVideoFilters } = require('../controllers/videogalleryController');
const router = express.Router();

// POST request to apply filters and redirect to Facebook
router.post('/apply-filters', applyVideoFilters);

module.exports = router;
