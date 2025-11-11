const crypto = require('crypto');

const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

const generateVerificationToken = () => {
  return crypto.randomBytes(32).toString('hex');
};

const isOTPExpired = (expiresAt) => {
  return new Date() > new Date(expiresAt);
};

module.exports = { generateOTP, generateVerificationToken, isOTPExpired };