const express = require("express");
const router = express.Router();
const {
  createRoboGenius,
} = require("../Controller/roboGeniusController");

router.post('/addRoboGenius', createRoboGenius);


module.exports = router;