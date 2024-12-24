// routes/notificationRoutes.js
const express = require("express");
const router = express.Router();
const { protectC } = require("../middleware/courseMiddleware");
const {
  getNotifications,
  markAsRead,
} = require("../Controller/notification");

router.get("/" , protectC, getNotifications);

router.put("/:id/read",protectC, markAsRead);

module.exports = router;
