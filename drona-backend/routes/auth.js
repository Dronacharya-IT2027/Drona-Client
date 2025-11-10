const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const authMiddleware = require('../middlewares/auth');
const Test = require('../models/Test');
const OTP = require('../models/OTP');
const { sendOTPEmail } = require('../utils/emailService');
const { generateOTP, generateVerificationToken, isOTPExpired } = require('../utils/otpGenerator');

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'change_this_secret';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

// Helper: basic email regex
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// POST /api/auth/signup
// Body: { name, enrollmentNumber, email, password, linkedin, leetcode, github }

router.post('/send-signup-otp', async (req, res) => {
  try {
    const { name, enrollmentNumber, email, password, linkedin = '', leetcode = '', github = '', branch } = req.body;

    // Basic validation
    if (!name || !enrollmentNumber || !email || !password) {
      return res.status(400).json({ 
        success: false,
        message: 'Name, enrollmentNumber, email and password are required.' 
      });
    }
    
    if (!emailRegex.test(email)) {
      return res.status(400).json({ 
        success: false,
        message: 'Invalid email format.' 
      });
    }
    
    if (password.length < 6) {
      return res.status(400).json({ 
        success: false,
        message: 'Password must be at least 6 characters.' 
      });
    }

    // Check existing enrollment or email
    const existEnroll = await User.findOne({ enrollmentNumber: enrollmentNumber.trim() });
    if (existEnroll) {
      return res.status(409).json({ 
        success: false,
        message: 'Enrollment number already registered.' 
      });
    }

    const existEmail = await User.findOne({ email: email.trim().toLowerCase() });
    if (existEmail) {
      return res.status(409).json({ 
        success: false,
        message: 'Email already registered.' 
      });
    }

    // Generate OTP and verification token
    const otp = generateOTP();
    const verificationToken = generateVerificationToken();
    const expiresAt = new Date(Date.now() + (process.env.OTP_EXPIRY_MINUTES || 10) * 60 * 1000);

    // Save OTP to database (replace existing if any)
    await OTP.findOneAndDelete({ email });
    await OTP.create({
      email: email.trim().toLowerCase(),
      otp,
      expiresAt,
      verificationToken
    });

    // Hash password for temporary storage
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // Create temporary unverified user (replace existing if any)
    await User.findOneAndDelete({ email: email.trim().toLowerCase(), isVerified: false });
    
    const tempUser = new User({
      name: name.trim(),
      enrollmentNumber: enrollmentNumber.trim(),
      email: email.trim().toLowerCase(),
      passwordHash,
      linkedin: linkedin.trim(),
      leetcode: leetcode.trim(),
      github: github.trim(),
      branch: branch.trim(),
      totalMarks: 0,
      testsGiven: [],
      role: 'student',
      isVerified: false,
      verificationToken
    });

    await tempUser.save();

    // Send OTP email
    await sendOTPEmail(email, otp, name);

    res.json({
      success: true,
      message: 'OTP sent successfully to your email',
      verificationToken,
      email: email.trim().toLowerCase()
    });

  } catch (error) {
    console.error('Send OTP error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error' 
    });
  }
});

// POST /api/auth/verify-signup-otp
router.post('/verify-signup-otp', async (req, res) => {
  try {
    const { email, otp, verificationToken } = req.body;

    if (!email || !otp || !verificationToken) {
      return res.status(400).json({ 
        success: false,
        message: 'Email, OTP and verification token are required.' 
      });
    }

    // Find OTP record
    const otpRecord = await OTP.findOne({ email });
    
    if (!otpRecord) {
      return res.status(400).json({ 
        success: false, 
        message: 'OTP not found or expired. Please request a new OTP.' 
      });
    }

    // Check if OTP is expired
    if (isOTPExpired(otpRecord.expiresAt)) {
      await OTP.findOneAndDelete({ email });
      await User.findOneAndDelete({ email, isVerified: false });
      return res.status(400).json({ 
        success: false, 
        message: 'OTP has expired. Please request a new OTP.' 
      });
    }

    // Verify OTP and token
    if (otpRecord.otp !== otp || otpRecord.verificationToken !== verificationToken) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid OTP.' 
      });
    }

    // Find and verify user
    const user = await User.findOne({ 
      email: email.trim().toLowerCase(), 
      verificationToken,
      isVerified: false 
    });

    if (!user) {
      return res.status(400).json({ 
        success: false, 
        message: 'User not found or already verified.' 
      });
    }

    // Mark user as verified and clear verification token
    user.isVerified = true;
    user.verificationToken = undefined;
    await user.save();

    // Delete used OTP
    await OTP.findOneAndDelete({ email });

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, role: user.role }, 
      JWT_SECRET, 
      { expiresIn: JWT_EXPIRES_IN }
    );

    res.json({
      success: true,
      message: 'Account verified successfully!',
      user: {
        id: user._id,
        name: user.name,
        enrollmentNumber: user.enrollmentNumber,
        email: user.email,
        linkedin: user.linkedin,
        leetcode: user.leetcode,
        github: user.github,
        role: user.role,
        branch: user.branch,
        totalMarks: user.totalMarks,
        testsGiven: user.testsGiven,
        isVerified: user.isVerified
      },
      token
    });

  } catch (error) {
    console.error('Verify OTP error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error' 
    });
  }
});

// POST /api/auth/resend-signup-otp
router.post('/resend-signup-otp', async (req, res) => {
  try {
    const { email, verificationToken } = req.body;

    if (!email || !verificationToken) {
      return res.status(400).json({ 
        success: false,
        message: 'Email and verification token are required.' 
      });
    }

    // Find temporary user
    const user = await User.findOne({ 
      email: email.trim().toLowerCase(), 
      verificationToken,
      isVerified: false 
    });

    if (!user) {
      return res.status(400).json({ 
        success: false, 
        message: 'User not found or already verified.' 
      });
    }

    // Generate new OTP
    const otp = generateOTP();
    const expiresAt = new Date(Date.now() + (process.env.OTP_EXPIRY_MINUTES || 10) * 60 * 1000);

    // Update OTP in database
    await OTP.findOneAndDelete({ email });
    await OTP.create({
      email: email.trim().toLowerCase(),
      otp,
      expiresAt,
      verificationToken
    });

    // Send new OTP email
    await sendOTPEmail(email, otp, user.name);

    res.json({
      success: true,
      message: 'New OTP sent successfully to your email',
      verificationToken
    });

  } catch (error) {
    console.error('Resend OTP error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error' 
    });
  }
});


router.post('/signup', async (req, res) => {
  try {
    const { name, enrollmentNumber, email, password, linkedin = '', leetcode = '', github = '', branch} = req.body;

    // Basic validation
    if (!name || !enrollmentNumber || !email || !password) {
      return res.status(400).json({ message: 'name, enrollmentNumber, email and password are required.' });
    }
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: 'Invalid email format.' });
    }
    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters.' });
    }

    // Check existing enrollment or email
    const existEnroll = await User.findOne({ enrollmentNumber: enrollmentNumber.trim() });
    if (existEnroll) return res.status(409).json({ message: 'Enrollment number already registered.' });

    const existEmail = await User.findOne({ email: email.trim().toLowerCase() });
    if (existEmail) return res.status(409).json({ message: 'Email already registered.' });

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // Save user
    const user = new User({
      name: name.trim(),
      enrollmentNumber: enrollmentNumber.trim(),
      email: email.trim().toLowerCase(),
      passwordHash,
      linkedin: linkedin.trim(),
      leetcode: leetcode.trim(),
      github: github.trim(),
      branch: branch.trim(),
      totalMarks: 0,
      testsGiven: [],
      role: 'student'
    });

    await user.save();

    // Create JWT
    const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

    // Return minimal user data + token
    return res.status(201).json({
      message: 'User created successfully',
      user: {
        id: user._id,
        name: user.name,
        enrollmentNumber: user.enrollmentNumber,
        email: user.email,
        linkedin: user.linkedin,
        leetcode: user.leetcode,
        github: user.github,
        role: user.role,
        branch: user.branch,
        totalMarks: user.totalMarks,
        testsGiven: user.testsGiven
      },
      token
    });
  } catch (err) {
    console.error('Signup error:', err);
    // handle duplicate key error more clearly
    if (err.code === 11000) {
      const field = Object.keys(err.keyPattern || { })[0] || 'field';
      return res.status(409).json({ message: `${field} already exists.` });
    }
    return res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/auth/login
// Body: { email, password }
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'email and password required.' });

    const user = await User.findOne({ email: email.trim().toLowerCase() });
    if (!user) return res.status(401).json({ message: 'Invalid credentials.' });

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) return res.status(401).json({ message: 'Invalid credentials.' });

    const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

    return res.json({
      message: 'Login successful',
      user: {
        id: user._id,
        name: user.name,
        enrollmentNumber: user.enrollmentNumber,
        email: user.email,
        linkedin: user.linkedin,
        leetcode: user.leetcode,
        github: user.github,
        role: user.role,
        branch: user.branch,
        totalMarks: user.totalMarks,
        testsGiven: user.testsGiven
      },
      token
    });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/auth/me
router.get('/me', authMiddleware, async (req, res) => {
  try {
    // auth middleware attached decoded token to req.user { id, role, iat, exp }
    const userId = req.user && req.user.id;
    if (!userId) return res.status(401).json({ message: 'Unauthorized' });

    const user = await User.findById(userId).select('-passwordHash -__v');
    if (!user) return res.status(404).json({ message: 'User not found' });

    return res.json({ user });
  } catch (err) {
    console.error('GET /me error', err);
    return res.status(500).json({ message: 'Server error' });
  }
});

router.get("/role", async (req, res) => {
  try {
    // Get token from header
    const token = req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "No token provided. Authorization denied.",
      });
    }

    // Verify token
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return res.status(401).json({
        success: false,
        message: "Invalid or expired token.",
      });
    }

    // Find user using decoded ID
    const user = await User.findById(decoded.id).select("name email role");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Return user role
    return res.status(200).json({
      success: true,
      message: "User role fetched successfully",
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Error fetching user role:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while fetching user role",
      error: error.message,
    });
  }
});

/**
 * GET /api/users/admin/tests
 * - Auth: Bearer token required
 * - Behavior:
 *    * Verifies JWT from Authorization header
 *    * Loads user by decoded id
 *    * If user.role === 'admin' => returns tests created by that admin
 *    * Else => 403 Forbidden
 *
 * Response (200):
 * { success: true, tests: [ ... ] }
 *
 * Error responses:
 * 401 - missing/invalid token
 * 403 - user not admin
 * 404 - user not found
 * 500 - server error
 */
router.get('/admin/tests', async (req, res) => {
  try {
    const authHeader = req.header('Authorization') || '';
    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;

    if (!token) {
      return res.status(401).json({ success: false, message: 'No token provided. Authorization denied.' });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return res.status(401).json({ success: false, message: 'Invalid or expired token.' });
    }

    // load user
    const user = await User.findById(decoded.id).select('name email role');
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    // only admin allowed
    if (user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Access denied. Admins only.' });
    }

    // find tests created by this admin
    const tests = await Test.find({ createdBy: user._id })
      .sort({ createdAt: -1 })
      .lean()
      .exec();

    return res.status(200).json({
      success: true,
      message: 'Tests fetched for admin.',
      admin: { id: user._id, name: user.name, email: user.email },
      tests
    });
  } catch (err) {
    console.error('GET /api/users/admin/tests error:', err);
    return res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
});

module.exports = router;

