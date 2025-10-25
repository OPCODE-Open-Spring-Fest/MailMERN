const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { sendEmail } = require("../services/emailService");
require('dotenv').config();


exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: "User already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashedPassword });

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: { id: user._id, name: user.name, email: user.email },
    });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ success: false, message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Invalid email or password" });
    }

    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};
exports.sendOtp = async (req,res) => {
  try {
    const {email} = req.body;
    const user = await User.findOne({email});
    if (!user) return res.status(400).json({message:"User does not exist."});

    const otp = Math.floor(1000 + Math.random() * 9000).toString(); // 4-digit OTP
    user.resetOtp = otp;
    user.otpExpires = Date.now() + 5*60*1000; // 5 minutes
    user.isOtpVerified = false;
    await user.save();

    await sendEmail
    
    
    
    
    ({ to: email, otp }); // ✅ Correct usage
    return res.status(200).json({message:"OTP sent successfully"});
  } catch (error) {
     return res.status(500).json({message: `send otp error ${error}`});
  }  
};


exports.verifyOtp = async (req,res) => {
  try {
    const {email, otp} = req.body;
    const user = await User.findOne({email});
    if (!user || user.resetOtp !== otp || user.otpExpires < Date.now()) {
      return res.status(400).json({message:"Invalid/expired OTP"});
    }

    user.isOtpVerified = true;
    user.resetOtp = undefined;
    user.otpExpires = undefined;
    await user.save();

    return res.status(200).json({message:"OTP verified successfully"});
  } catch (error) {
     return res.status(500).json({message: `verify otp error ${error}`});
  }
};

exports.resetPassword = async (req,res) => {
  try {
    const {email, newPassword} = req.body;
    const user = await User.findOne({email});
    if (!user || !user.isOtpVerified) {
      return res.status(400).json({message:"OTP verification required"});
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    user.isOtpVerified = false; // reset verification
    await user.save();

    return res.status(200).json({message:"Password reset successfully"});
  } catch (error) {
     return res.status(500).json({message: `reset password error ${error}`});
  }
};

