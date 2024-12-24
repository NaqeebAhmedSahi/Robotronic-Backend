// routes/cvFormRouter.js
const express = require('express');
const multer = require('multer');
const path = require('path');
const { createJobApplication } = require('../Controller/cvFormController');

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    },
});

const upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        const ext = path.extname(file.originalname).toLowerCase();
        if (ext === '.pdf' || ext === '.doc' || ext === '.docx') {
            cb(null, true);
        } else {
            cb(new Error('Only PDF and DOC files are allowed'));
        }
    },
});

router.post('/', upload.single('cvFile'), createJobApplication);

module.exports = router;
