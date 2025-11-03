// routes/googleRoute.js
const express = require("express");
const {
  getAuthUrl,
  oauthCallback,
  scheduleMeeting,
} = require("../controllers/googleController");

const router = express.Router();

router.get("/auth", getAuthUrl);
router.get("/oauth2callback", oauthCallback);
router.post("/schedule", scheduleMeeting);

module.exports = router;
