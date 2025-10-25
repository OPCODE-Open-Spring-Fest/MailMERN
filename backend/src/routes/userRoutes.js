const express = require('express');
const router = express.Router();
const { register, login, sendOtp, verifyOtp, resetPassword } = require('../controllers/userController');
const { validateUser, validateLogin } = require('../middlewares/validationMiddleware');

router.post('/register', validateUser, register);
router.post('/login', validateLogin, login);
router.post("/send-otp",sendOtp)
router.post("/verify-otp",verifyOtp)
router.post("/reset-password",resetPassword)


module.exports = router;
