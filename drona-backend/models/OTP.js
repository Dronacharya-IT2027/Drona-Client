// models/OTP.js
const mongoose = require('mongoose');

const otpSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, lowercase: true, trim: true, index: true },
    otp: { type: String, required: true },
    expiresAt: { type: Date, required: true, index: true },
    verificationToken: { type: String, required: true, index: true },

    // store draft signup data to create SignupRequest after OTP verify
    draft: {
      name: String,
      enrollmentNumber: String,
      branch: String,
      linkedin: { type: String, default: '' },
      leetcode: { type: String, default: '' },
      github: { type: String, default: '' },
      passwordHash: String, // already hashed in /send-signup-otp
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('OTP', otpSchema);
