
const Contact = require('../models/contactModel'); // Adjust path if needed

const createContact = async (req, res) => {
  console.log("Request body:", req.body); // Check if body data is as expected

  const { name, phone, email, schoolName, address, message } = req.body;

  // Simple validation
  if (!name || !phone || !email || !message) {
      return res.status(400).json({ success: false, message: "All fields are required" });
  }

  try {
      // Debug before saving
      console.log("Saving new contact...");

      const newContact = new Contact({
          name,
          phone,
          email,
          schoolName,
          address,
          message,
      });

      await newContact.save();

      res.status(201).json({
          success: true,
          message: "Message received!",
          data: newContact,
      });
  } catch (error) {
      console.error("Error in createContact function:", error); // Detailed error log
      res.status(500).json({ success: false, message: `Server error: ${error.message}` });
  }
};

// At the end of the file
module.exports = { createContact };