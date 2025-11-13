const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

const sendOTPEmail = async (email, otp, name) => {
  console.log(`→ Preparing to send OTP to ${otp}`);
  const mailOptions = {
    from: `"Drona Platform" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: 'Verify Your Drona Account - OTP Required',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; background: #667eea; padding: 20px; border-radius: 10px 10px 0 0; color: white;">
          <h1 style="margin: 0;">Email Verification</h1>
        </div>
        <div style="padding: 30px 20px; background: #f9f9f9;">
          <h2 style="color: #333;">Hello, ${name}!</h2>
          <p>Your verification code is:</p>
          <div style="text-align: center; margin: 30px 0;">
            <div style="display: inline-block; background: white; padding: 15px 30px; border-radius: 8px; border: 2px dashed #667eea;">
              <span style="font-size: 32px; font-weight: bold; color: #333;">${otp}</span>
            </div>
          </div>
          <p><strong>This code expires in 10 minutes.</strong></p>
          <p style="color: #999; font-size: 12px;">
            If you didn't request this, please ignore this email.
          </p>
        </div>
      </div>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`✓ OTP sent to ${email}`);
    return true;
  } catch (error) {
    console.error('✗ Failed to send OTP:', error.message);
    throw new Error('Failed to send verification email');
  }
};

// Make sure to export the function correctly
module.exports = { sendOTPEmail };