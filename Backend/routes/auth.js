const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const router = express.Router();

// Generate Random OTP
const generateOTP = () => Math.floor(1000 + Math.random() * 9000).toString();

// 📌 API: Login (Send OTP)
router.post("/login", async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ success: false, message: "Email is required" });

  const otp = generateOTP();
  await User.findOneAndUpdate({ email }, { otp }, { upsert: true });

  console.log(`📩 OTP for ${email}: ${otp}`); // In real apps, send via Email
  res.json({ success: true, message: `OTP sent to ${email}` });
});

// 📌 API: Verify OTP & Generate JWT
router.post("/verify-otp", async (req, res) => {
  const { email, otp } = req.body;
  const user = await User.findOne({ email });

  if (!user || user.otp !== otp) {
    return res.status(400).json({ success: false, message: "Entered OTP is wrong" });
  }

  const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: "1h" });
  res.json({ success: true, message: "Login successful", token });
});

// 📌 API: Resend OTP
router.post("/resend-otp", async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ success: false, message: "Email is required" });

  const otp = generateOTP();
  await User.findOneAndUpdate({ email }, { otp }, { upsert: true });

  console.log(`📩 Resent OTP for ${email}: ${otp}`); // Replace with email sending logic
  res.json({ success: true, message: `OTP sent to ${email}` });
});

module.exports = router;
