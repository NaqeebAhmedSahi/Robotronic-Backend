const express = require("express");
const router = express.Router();
const {
  getCounter,
} = require("../Controller/counterController.js");

// Route to get all count of all the api
router.get("/getAllCounter", getCounter);

module.exports = router;