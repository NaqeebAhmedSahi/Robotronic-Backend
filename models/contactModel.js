// models/Contact.js

const mongoose = require('mongoose');

// Define the schema for the Contact
const contactSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    phone: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        trim: true,
    },
    schoolName: {
        type: String,
        trim: true,
    },
    address: {
        type: String,
        trim: true,
    },
    message: {
        type: String,
        required: true,
        trim: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

// Create the Contact model using the schema
const Contact = mongoose.model('Contact', contactSchema);

// Export the model
module.exports = Contact;
