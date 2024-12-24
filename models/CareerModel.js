const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema(
  {
    position: { type: String, required: true },
    experience: { type: String, required: true },
    location: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    roleOverview: { type: String, required: true },
    keyResponsibilities: [{ type: String, required: true }],
    requiredSkills: [{ type: String, required: true }],
  },
  {
    timestamps: true, // This adds createdAt and updatedAt fields
  }
);

const Job = mongoose.model("Job", jobSchema);
module.exports = Job;
