/* -------------------- routes/email.js -------------------- */
// Email routes: POST /api/email/send-otp
const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');

// Create transporter lazily so verify logs at startup
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  // sensible timeouts
  connectionTimeout: 10000,
  greetingTimeout: 10000,
  socketTimeout: 10000,
});

transporter.verify((err, success) => {
  if (err) {
    console.error('✗ Email configuration error:', err);
  } else {
    console.log('✓ Email transporter is ready');
  }
});

// Helper: generate 6-digit OTP
function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Route: POST /api/email/send-otp
// body: { email: string, name?: string }
router.post('/send-otp', async (req, res) => {
  try {
    const { email, name } = req.body;
    if (!email) return res.status(400).json({ success: false, message: 'Email is required' });

    const otp = generateOTP();

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; background: #667eea; padding: 20px; border-radius: 10px 10px 0 0; color: white;">
          <h1 style="margin: 0;">Email Verification</h1>
        </div>
        <div style="padding: 30px 20px; background: #f9f9f9;">
          <h2 style="color: #333;">Hello, ${name || 'User'}!</h2>
          <p>Your verification code is:</p>
          <div style="text-align: center; margin: 30px 0;">
            <div style="display: inline-block; background: white; padding: 15px 30px; border-radius: 8px; border: 2px dashed #667eea;">
              <span style="font-size: 32px; font-weight: bold; color: #333;">${otp}</span>
            </div>
          </div>
          <p><strong>This code expires in 10 minutes.</strong></p>
          <p style="color: #999; font-size: 12px;">If you didn't request this, please ignore this email.</p>
        </div>
      </div>
    `;

    const mailOptions = {
      from: process.env.FROM_EMAIL || process.env.EMAIL_USER,
      to: email,
      subject: 'Verify Your Drona Account - OTP Required',
      html,
    };

    await transporter.sendMail(mailOptions);
    console.log(`✓ OTP sent to ${email}`);

    // NOTE: In production you should save OTP + expiry in DB or cache (Redis) and validate later.
    return res.status(200).json({ success: true, message: 'OTP sent', otp });
  } catch (err) {
    console.error('✗ Failed to send OTP:', err);
    return res.status(500).json({ success: false, message: 'Failed to send OTP', details: err.message });
  }
});

module.exports = router;
