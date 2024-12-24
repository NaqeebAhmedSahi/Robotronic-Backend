const express = require("express");
const router = express.Router();
const { createContact } = require("../Controller/contactController");

// Define the route for contact form submission
router.post("/contact", createContact);

module.exports = router;
