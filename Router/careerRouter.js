const express = require("express");
const {
  createJob,
  getAllJobs,
  getJobById,
  updateJob,
  deleteJob,
} = require("../Controller/careerController");

const router = express.Router();

// POST /api/jobs - Create a new job
router.post("/jobs", createJob);

// GET /api/jobs - Get all jobs
router.get("/jobs", getAllJobs);

// GET /api/jobs/:id - Get job details by ID
router.get("/jobs/:id", getJobById);

// PUT /api/jobs/:id - Update a job by ID
router.put("/jobs/:id", updateJob);

// DELETE /api/jobs/:id - Delete a job by ID
router.delete("/jobs/:id", deleteJob);

module.exports = router;
