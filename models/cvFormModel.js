// models/cvFormModel.js
const mongoose = require('mongoose');

const cvFormSchema = new mongoose.Schema({
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    streetAddress: { type: String, trim: true },
    city: { type: String, trim: true },
    state: { type: String, trim: true },
    postalCode: { type: String, trim: true },
    education: { type: String, trim: true },
    workExperience: { type: String, trim: true },
    skills: { type: String, trim: true },
    cvFile: { type: String, required: true }, // Path or URL of uploaded CV
    coverLetter: { type: String, trim: true },
    createdAt: { type: Date, default: Date.now },
});

const cvFormModel = mongoose.model('JobApplication', cvFormSchema);
module.exports = cvFormModel;
