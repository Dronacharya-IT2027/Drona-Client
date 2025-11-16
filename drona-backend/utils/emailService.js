const axios = require('axios');
// very first lines of your app
require('dotenv').config();

const sendOTPEmail = async (email, otp, name) => {
  if (!email || !otp) {
    console.error('sendOtpEmail: email and otp are required');
    return false;
  }

  const url = 'http://localhost:3000/api/email/send-otp';
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

const reportCheatingEmail = async (email) => {
  if (!email) {
    console.error("reportCheatingEmail: email is required");
    return false;
  }

  const url = "http://localhost:3000/api/email/report-cheating";
  const payload = { email };

  try {
    const res = await axios.post(url, payload, {
      headers: { "Content-Type": "application/json" },
    });

    const body = res.data;

    if (body && typeof body.success !== "undefined") {
      return Boolean(body.success);
    }

    return true;

  } catch (err) {
    if (err.response) {
      console.error(
        `reportCheatingEmail: remote responded ${err}`,
        err.response.data
      );
    } else {
      console.error("reportCheatingEmail error:", err.message);
    }
    return false;
  }
};

module.exports = { sendOTPEmail, reportCheatingEmail };
