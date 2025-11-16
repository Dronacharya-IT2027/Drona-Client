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

// Route: POST /api/email/send-otp
// body: { email: string, name?: string }
router.post('/send-otp', async (req, res) => {
  try {
    const { email, name, otp } = req.body;
    if (!email) return res.status(400).json({ success: false, message: 'Email is required' });

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

router.post('/report-cheating', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email)
      return res.status(400).json({
        success: false,
        message: 'Email is required',
      });

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; background: #e53e3e; padding: 20px; border-radius: 10px 10px 0 0; color: white;">
          <h1 style="margin: 0;">Important Notice from DRONAA</h1>
        </div>

        <div style="padding: 30px 20px; background: #fef2f2;">
          <h2 style="color: #222;">Detected Violation of Test Integrity</h2>

          <p style="color: #444; font-size: 15px; line-height: 1.5;">
            During your recent test on <strong>DRONAA</strong>, our monitoring system detected
            activities that violate our Test Integrity & Fair Play Policy.
          </p>

          <p style="color: #444; font-size: 15px; line-height: 1.5;">
            As a result, your test session has been <strong>immediately blocked</strong> and the
            incident has been <strong>reported to the platform administrators</strong> for further review.
          </p>

          <p style="color: #444; font-size: 15px; line-height: 1.5;">
            DRONAA maintains a strict zero-tolerance policy towards any form of cheating,
            misuse, or unfair assistance. Repeated violations may lead to a permanent ban
            from all assessments hosted on the platform.
          </p>

          <div style="margin: 30px 0; text-align: center;">
            <div style="display: inline-block; padding: 15px 25px; background: white; border: 2px solid #e53e3e; border-radius: 8px;">
              <span style="font-size: 18px; font-weight: bold; color: #e53e3e;">
                Test Session Blocked & Report Logged
              </span>
            </div>
          </div>

          <p style="color: #444; font-size: 14px; line-height: 1.5;">
            If you believe this action was taken in error, you may reach out to our support team
            with proper justification. Our team will review the case thoroughly.
          </p>

          <p style="color: #777; font-size: 12px; margin-top: 20px;">
            This is an automated message. Please do not reply directly to this email.
          </p>
        </div>

        <div style="text-align: center; background: #e53e3e; padding: 12px; border-radius: 0 0 10px 10px; color: white;">
          <p style="margin: 0; font-size: 13px;">DRONAA – Empowering Intelligent Assessments</p>
        </div>
      </div>
    `;

    const mailOptions = {
      from: process.env.FROM_EMAIL || process.env.EMAIL_USER,
      to: email,
      subject: 'DRONAA | Test Blocked Due to Cheating Detection',
      html,
    };

    await transporter.sendMail(mailOptions);
    console.log(`✓ Cheating report email sent to ${email}`);

    return res.status(200).json({
      success: true,
      message: 'Cheating report email sent.',
    });
  } catch (err) {
    console.log('✗ Failed to send cheating report email:', err);
    return res.status(500).json({
      success: false,
      message: 'Failed to send cheating report email',
      details: err.message,
    });
  }
});

module.exports = router;
