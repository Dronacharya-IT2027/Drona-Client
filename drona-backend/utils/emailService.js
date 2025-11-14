const fetchImpl = require('node-fetch');

const sendOTPEmail = async (email, otp, name) => {
  if (!email || !otp) {
    console.error('sendOtpEmail: email and otp are required');
    return false;
  }

  const url = 'https://drona-client-git-main-dronacharyas-projects.vercel.app/api/email/send-otp';

  // Build payload exactly as requested
  const payload = { email, otp, name };

  const headers = { 'Content-Type': 'application/json' };

  try {
    const res = await fetchImpl(url, {
      method: 'POST',
      headers,
      body: JSON.stringify(payload),
    });

    if (!res) {
      console.error('sendOtpEmail: no response from Vercel endpoint');
      return false;
    }

    // Try to parse JSON; if parse fails, treat non-2xx as failure
    let body;
    try {
      body = await res.json();
    } catch (e) {
      console.log('sendOtpEmail: response not JSON', e);
      body = null;
    }

    if (res.ok) {
      // If remote explicitly returns success boolean, trust it
      if (body && typeof body.success !== 'undefined') {
        return Boolean(body.success);
      }
      // If remote returned 200 but no body.success, assume success
      return true;
    } else {
      // not ok (4xx/5xx) - log remote body/text for debugging
      const text = body ? JSON.stringify(body) : await res.text().catch(() => '');
      console.error(`sendOtpEmail: remote responded ${res.status} ${res.statusText} — ${text}`);
      return false;
    }
  } catch (err) {
    // network / timeout / aborted
    if (err && err.name === 'AbortError') {
      console.error('sendOtpEmail: request aborted (timeout)');
    } else {
      console.error('sendOtpEmail error:', err && err.message ? err.message : err);
    }
    return false;
  }
}

module.exports = {sendOTPEmail};
