const express = require("express");
const { register, login, sendOtp, verifyOtp, resetPassword } = require("../controllers/userController");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/send-otp",sendOtp)
router.post("/verify-otp",verifyOtp)
router.post("/reset-password",resetPassword)

module.exports = router;
