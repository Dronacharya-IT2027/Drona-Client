const axios = require('axios');

const sendOTPEmail = async (email, otp, name) => {
  if (!email || !otp) {
    console.error('sendOtpEmail: email and otp are required');
    return false;
  }

  const url = 'http://3.111.39.191:3000/api/email/send-otp';
  const payload = { email, otp, name };

  try {
    const res = await axios.post(url, payload, {
      headers: { 'Content-Type': 'application/json' },
    });

    const body = res.data;

    // If API returns { success: true }
    if (body && typeof body.success !== 'undefined') {
      return Boolean(body.success);
    }

    // otherwise assume 2xx success
    return true;

  } catch (err) {
    if (err.response) {
      console.error(
        `sendOtpEmail: remote responded ${err.response.status}`,
        err.response.data
      );
    } else {
      console.error('sendOtpEmail error:', err.message);
    }
    return false;
  }
};

module.exports = { sendOTPEmail };
