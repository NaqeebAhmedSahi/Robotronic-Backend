// // controllers/cvFormController.js
const cvFormModel = require('../models/cvFormModel');

const createJobApplication = async (req, res) => {
    try {
        const { firstName, lastName, email, phone, streetAddress, city, state, postalCode, education, workExperience, skills, coverLetter } = req.body;

        if (!req.file) {
            return res.status(400).json({ success: false, message: "CV file is required" });
        }

        const newJobApplication = new cvFormModel({
            firstName,
            lastName,
            email,
            phone,
            streetAddress,
            city,
            state,
            postalCode,
            education,
            workExperience,
            skills,
            cvFile: req.file.path,
            coverLetter,
        });

        await newJobApplication.save();

        res.status(201).json({
            success: true,
            message: "Application submitted successfully",
            data: newJobApplication,
        });
    } catch (error) {
        console.error("Error in createJobApplication function:", error);
        res.status(500).json({ success: false, message: `Server error: ${error.message}` });
    }
};

module.exports = { createJobApplication };



// for postman testing
// const cvFormModel = require('../models/cvFormModel');

// const createJobApplication = async (req, res) => {
//     try {
//         const { firstName, lastName, email, phone, streetAddress, city, state, postalCode, education, workExperience, skills, coverLetter, cvFile } = req.body;

//         // Ensure the cvFile field is present in the JSON object (you can remove this in production)
//         if (!cvFile) {
//             return res.status(400).json({ success: false, message: "CV file path is required for testing" });
//         }

//         const newJobApplication = new cvFormModel({
//             firstName,
//             lastName,
//             email,
//             phone,
//             streetAddress,
//             city,
//             state,
//             postalCode,
//             education,
//             workExperience,
//             skills,
//             cvFile, // Expecting a string path for testing
//             coverLetter,
//         });

//         await newJobApplication.save();

//         res.status(201).json({
//             success: true,
//             message: "Application submitted successfully",
//             data: newJobApplication,
//         });
//     } catch (error) {
//         console.error("Error in createJobApplication function:", error);
//         res.status(500).json({ success: false, message: `Server error: ${error.message}` });
//     }
// };

// module.exports = { createJobApplication };