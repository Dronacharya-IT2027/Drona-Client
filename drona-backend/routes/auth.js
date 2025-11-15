// routes/auth.js
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/User');
const Test = require('../models/Test');
const OTP = require('../models/OTP');
const SignupRequest = require('../models/SignupRequest');

const authMiddleware = require('../middlewares/auth');
const { sendOTPEmail } = require('../utils/emailService');
const { generateOTP, generateVerificationToken, isOTPExpired } = require('../utils/otpGenerator');

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'change_this_secret';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * STEP 1 — Request OTP for signup (no User is created here)
 */
router.post('/send-signup-otp', async (req, res) => {
  try {
    const { name, enrollmentNumber, email, password, linkedin = '', leetcode = '', github = '', branch } = req.body;

    if (!name || !enrollmentNumber || !email || !password || !branch) {
      return res.status(400).json({
        success: false,
        message: 'Name, enrollmentNumber, email, password and branch are required.'
      });
    }
    if (!emailRegex.test(email)) {
      return res.status(400).json({ success: false, message: 'Invalid email format.' });
    }
    if (password.length < 6) {
      return res.status(400).json({ success: false, message: 'Password must be at least 6 characters.' });
    }

    // hard uniqueness: no final User with same email/enrollment
    const existEnrollUser = await User.findOne({ enrollmentNumber: enrollmentNumber.trim() });
    if (existEnrollUser) {
      return res.status(409).json({ success: false, message: 'Enrollment number already registered.' });
    }
    const existEmailUser = await User.findOne({ email: email.trim().toLowerCase() });
    if (existEmailUser) {
      return res.status(409).json({ success: false, message: 'Email already registered.' });
    }

    // soft uniqueness for pending requests that are still under review
    const pendingSameEmail = await SignupRequest.findOne({ email: email.trim().toLowerCase(), status: 'under_review' });
    if (pendingSameEmail) {
      return res.status(409).json({ success: false, message: 'A signup request with this email is already under review.' });
    }
    const pendingSameEnroll = await SignupRequest.findOne({ enrollmentNumber: enrollmentNumber.trim(), status: 'under_review' });
    if (pendingSameEnroll) {
      return res.status(409).json({ success: false, message: 'A signup request with this enrollment number is already under review.' });
    }

    const otp = generateOTP();
    const verificationToken = generateVerificationToken();
    const expiresAt = new Date(Date.now() + (process.env.OTP_EXPIRY_MINUTES || 10) * 60 * 1000);

    // Hash password once here; we will store in OTP.draft and reuse after OTP verification
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // Clear old OTP (if any) and create a new one carrying draft data
    await OTP.findOneAndDelete({ email: email.trim().toLowerCase() });
    await OTP.create({
      email: email.trim().toLowerCase(),
      otp,
      expiresAt,
      verificationToken,
      draft: {
        name: name.trim(),
        enrollmentNumber: enrollmentNumber.trim(),
        branch: branch.trim(),
        linkedin: linkedin.trim(),
        leetcode: leetcode.trim(),
        github: github.trim(),
        passwordHash
      }
    });
    console.log(otp);
    // send email
    await sendOTPEmail(email, otp, name);

    res.json({
      success: true,
      message: 'OTP sent successfully to your email',
      verificationToken,
      email: email.trim().toLowerCase()
    });
  } catch (error) {
    console.error('Send OTP error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

/**
 * STEP 2 — Verify OTP -> create SignupRequest (UNDER REVIEW)
 */
router.post('/verify-signup-otp', async (req, res) => {
  try {
    const { email, otp, verificationToken } = req.body;
    if (!email || !otp || !verificationToken) {
      return res.status(400).json({ success: false, message: 'Email, OTP and verification token are required.' });
    }

    const otpRecord = await OTP.findOne({ email: email.trim().toLowerCase() });
    if (!otpRecord) {
      return res.status(400).json({ success: false, message: 'OTP not found or expired. Please request a new OTP.' });
    }

    if (isOTPExpired(otpRecord.expiresAt)) {
      await OTP.findOneAndDelete({ email: email.trim().toLowerCase() });
      return res.status(400).json({ success: false, message: 'OTP has expired. Please request a new OTP.' });
    }

    if (otpRecord.otp !== otp || otpRecord.verificationToken !== verificationToken) {
      return res.status(400).json({ success: false, message: 'Invalid OTP.' });
    }

    // Prevent duplicates: if a request already exists & is under_review, short-circuit
    const existingPending = await SignupRequest.findOne({ email: email.trim().toLowerCase(), status: 'under_review' });
    if (existingPending) {
      await OTP.findOneAndDelete({ email: email.trim().toLowerCase() });
      return res.json({
        success: true,
        message: 'Your signup request is already under review.',
        requestId: existingPending._id
      });
    }

    const draft = otpRecord.draft || {};
    if (!draft?.passwordHash || !draft?.enrollmentNumber || !draft?.name || !draft?.branch) {
      await OTP.findOneAndDelete({ email: email.trim().toLowerCase() });
      return res.status(400).json({ success: false, message: 'Incomplete signup draft. Please start again.' });
    }

    // Hard check again against existing final Users right before creating request
    const dupeUserEmail = await User.findOne({ email: email.trim().toLowerCase() });
    const dupeUserEnroll = await User.findOne({ enrollmentNumber: draft.enrollmentNumber.trim() });
    if (dupeUserEmail || dupeUserEnroll) {
      await OTP.findOneAndDelete({ email: email.trim().toLowerCase() });
      return res.status(409).json({ success: false, message: 'A user already exists with the provided email/enrollment.' });
    }

    // Create the pending request
    const request = await SignupRequest.create({
      name: draft.name,
      enrollmentNumber: draft.enrollmentNumber,
      email: email.trim().toLowerCase(),
      passwordHash: draft.passwordHash,
      branch: draft.branch,
      linkedin: draft.linkedin || '',
      leetcode: draft.leetcode || '',
      github: draft.github || '',
      status: 'under_review'
    });

    // OTP no longer needed
    await OTP.findOneAndDelete({ email: email.trim().toLowerCase() });

    return res.json({
      success: true,
      message: 'Your account request has been submitted for review.',
      requestId: request._id
    });

  } catch (error) {
    console.error('Verify OTP error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

/**
 * Resend OTP — works off OTP record only (no temp User anymore)
 */
router.post('/resend-signup-otp', async (req, res) => {
  try {
    const { email, verificationToken } = req.body;
    if (!email || !verificationToken) {
      return res.status(400).json({ success: false, message: 'Email and verification token are required.' });
    }

    const otpRecord = await OTP.findOne({ email: email.trim().toLowerCase() });
    if (!otpRecord || otpRecord.verificationToken !== verificationToken) {
      return res.status(400).json({ success: false, message: 'No matching OTP session found. Please start signup again.' });
    }

    const otp = generateOTP();
    const expiresAt = new Date(Date.now() + (process.env.OTP_EXPIRY_MINUTES || 10) * 60 * 1000);

    await OTP.updateOne(
      { email: email.trim().toLowerCase() },
      { $set: { otp, expiresAt } }
    );

    await sendOTPEmail(email, otp, otpRecord.draft?.name || 'User');

    res.json({ success: true, message: 'New OTP sent successfully to your email', verificationToken });
  } catch (error) {
    console.error('Resend OTP error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

/**
 * (Optional legacy) Direct signup (unchanged). Prefer OTP + review flow on frontend.
 */
router.post('/signup', async (req, res) => {
  try {
    const { name, enrollmentNumber, email, password, linkedin = '', leetcode = '', github = '', branch } = req.body;

    if (!name || !enrollmentNumber || !email || !password || !branch) {
      return res.status(400).json({ message: 'name, enrollmentNumber, email, password and branch are required.' });
    }
    if (!emailRegex.test(email)) return res.status(400).json({ message: 'Invalid email format.' });
    if (password.length < 6) return res.status(400).json({ message: 'Password must be at least 6 characters.' });

    const existEnroll = await User.findOne({ enrollmentNumber: enrollmentNumber.trim() });
    if (existEnroll) return res.status(409).json({ message: 'Enrollment number already registered.' });

    const existEmail = await User.findOne({ email: email.trim().toLowerCase() });
    if (existEmail) return res.status(409).json({ message: 'Email already registered.' });

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

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

    const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

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
    if (err.code === 11000) {
      const field = Object.keys(err.keyPattern || {})[0] || 'field';
      return res.status(409).json({ message: `${field} already exists.` });
    }
    return res.status(500).json({ message: 'Server error' });
  }
});

/**
 * Login (unchanged)
 */
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

/**
 * Current user (unchanged)
 */
router.get('/me', authMiddleware, async (req, res) => {
  try {
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

/**
 * Get role by token (unchanged)
 */
router.get('/role', async (req, res) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) return res.status(401).json({ success: false, message: 'No token provided. Authorization denied.' });

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET || JWT_SECRET);
    } catch (err) {
      return res.status(401).json({ success: false, message: 'Invalid or expired token.' });
    }

    const user = await User.findById(decoded.id).select('name email role');
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    return res.status(200).json({
      success: true,
      message: 'User role fetched successfully',
      data: { id: user._id, name: user.name, email: user.email, role: user.role }
    });
  } catch (error) {
    console.error('Error fetching user role:', error);
    return res.status(500).json({ success: false, message: 'Server error while fetching user role', error: error.message });
  }
});

/**
 * ADMIN — list pending requests for the admin's branch
 * GET /api/admin/signup-requests?status=under_review
 * Auth: Bearer token (admin). Only sees same-branch requests.
 */
router.get('/admin/signup-requests', async (req, res) => {
  try {
    const authHeader = req.header('Authorization') || '';
    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;
    if (!token) return res.status(401).json({ success: false, message: 'No token provided. Authorization denied.' });

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET || JWT_SECRET);
    } catch (err) {
      return res.status(401).json({ success: false, message: 'Invalid or expired token.' });
    }

    const admin = await User.findById(decoded.id).select('name email role branch');
    if (!admin) return res.status(404).json({ success: false, message: 'Admin not found.' });
    if (admin.role !== 'admin') return res.status(403).json({ success: false, message: 'Access denied. Admins only.' });

    const status = (req.query.status || 'under_review');
    const requests = await SignupRequest.find({ branch: admin.branch, status })
      .sort({ createdAt: -1 })
      .lean()
      .exec();

    return res.json({ success: true, admin: { id: admin._id, branch: admin.branch }, requests });
  } catch (err) {
    console.error('GET /admin/signup-requests error:', err);
    return res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
});

/**
 * ADMIN — accept a request (same branch)
 * POST /api/admin/signup-requests/:id/accept
 */
router.post('/admin/signup-requests/:id/accept', async (req, res) => {
  try {
    const authHeader = req.header('Authorization') || '';
    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;
    if (!token) return res.status(401).json({ success: false, message: 'No token provided. Authorization denied.' });

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET || JWT_SECRET);
    } catch (err) {
      return res.status(401).json({ success: false, message: 'Invalid or expired token.' });
    }

    const admin = await User.findById(decoded.id).select('name email role branch');
    if (!admin) return res.status(404).json({ success: false, message: 'Admin not found.' });
    if (admin.role !== 'admin') return res.status(403).json({ success: false, message: 'Access denied. Admins only.' });

    const reqId = req.params.id;
    const request = await SignupRequest.findById(reqId);
    if (!request) return res.status(404).json({ success: false, message: 'Request not found.' });
    if (request.status !== 'under_review') {
      return res.status(400).json({ success: false, message: `Request already ${request.status}.` });
    }
    if (request.branch !== admin.branch) {
      return res.status(403).json({ success: false, message: 'Cannot accept request from another branch.' });
    }

    // Final uniqueness check before creating User
    const dupeEmail = await User.findOne({ email: request.email });
    const dupeEnroll = await User.findOne({ enrollmentNumber: request.enrollmentNumber });
    if (dupeEmail || dupeEnroll) {
      // mark as rejected since a conflicting user already exists
      request.status = 'rejected';
      request.decidedAt = new Date();
      request.decidedBy = admin._id;
      await request.save();
      return res.status(409).json({ success: false, message: 'User with same email/enrollment already exists. Request rejected.' });
    }

    // Create the actual user
    const user = await User.create({
      name: request.name,
      enrollmentNumber: request.enrollmentNumber,
      email: request.email,
      passwordHash: request.passwordHash,
      branch: request.branch,
      linkedin: request.linkedin,
      leetcode: request.leetcode,
      github: request.github,
      role: 'student',
      isVerified: true // or keep false if you still want email verification later
    });

    // Update request status
    request.status = 'accepted';
    request.decidedAt = new Date();
    request.decidedBy = admin._id;
    request.createdUserId = user._id;
    await request.save();

    return res.json({
      success: true,
      message: 'Signup request accepted and user created.',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        branch: user.branch,
        enrollmentNumber: user.enrollmentNumber,
        role: user.role
      },
      request: {
        id: request._id,
        status: request.status,
        decidedAt: request.decidedAt,
        decidedBy: request.decidedBy
      }
    });
  } catch (err) {
    console.error('POST /admin/signup-requests/:id/accept error:', err);
    return res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
});

/**
 * ADMIN — reject a request (same branch)
 * POST /api/admin/signup-requests/:id/reject
 */
router.post('/admin/signup-requests/:id/reject', async (req, res) => {
  try {
    const authHeader = req.header('Authorization') || '';
    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;
    if (!token) return res.status(401).json({ success: false, message: 'No token provided. Authorization denied.' });

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET || JWT_SECRET);
    } catch (err) {
      return res.status(401).json({ success: false, message: 'Invalid or expired token.' });
    }

    const admin = await User.findById(decoded.id).select('name email role branch');
    if (!admin) return res.status(404).json({ success: false, message: 'Admin not found.' });
    if (admin.role !== 'admin') return res.status(403).json({ success: false, message: 'Access denied. Admins only.' });

    const reqId = req.params.id;
    const request = await SignupRequest.findById(reqId);
    if (!request) return res.status(404).json({ success: false, message: 'Request not found.' });
    if (request.status !== 'under_review') {
      return res.status(400).json({ success: false, message: `Request already ${request.status}.` });
    }
    if (request.branch !== admin.branch) {
      return res.status(403).json({ success: false, message: 'Cannot reject request from another branch.' });
    }

    request.status = 'rejected';
    request.decidedAt = new Date();
    request.decidedBy = admin._id;
    await request.save();

    return res.json({ success: true, message: 'Signup request rejected.', requestId: request._id });
  } catch (err) {
    console.error('POST /admin/signup-requests/:id/reject error:', err);
    return res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
});

/**
 * Existing admin tests route (unchanged)
 */
// GET /api/admin/tests
// GET /api/admin/tests  (normalized on server)
router.get('/admin/tests', async (req, res) => {
  try {
    const authHeader = req.header('Authorization') || '';
    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;

    if (!token) {
      return res.status(401).json({ success: false, message: 'No token provided. Authorization denied.' });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET || JWT_SECRET);
    } catch (err) {
      return res.status(401).json({ success: false, message: 'Invalid or expired token.' });
    }

    // load requesting user (the admin)
    const user = await User.findById(decoded.id).select('name email role branch').lean();
    if (!user) return res.status(404).json({ success: false, message: 'User not found.' });
    if (user.role !== 'admin') return res.status(403).json({ success: false, message: 'Access denied. Admins only.' });

    // find all admins in the same branch
    const adminsInBranch = await User.find({ role: 'admin', branch: user.branch }).select('_id').lean();
    const adminIds = adminsInBranch.map(a => a._id).filter(Boolean);

    // if none found, return empty lists
    if (adminIds.length === 0) {
      return res.status(200).json({
        success: true,
        message: 'No admin-created tests found for this branch.',
        admin: { id: user._id, name: user.name, email: user.email, branch: user.branch },
        activeTests: [],
        pastTests: []
      });
    }

    // fetch tests created by any admin in this branch (newest first) and include creator info
    const tests = await Test.find({ createdBy: { $in: adminIds } })
      .sort({ createdAt: -1 })
      .populate('createdBy', 'name email branch')
      .lean()
      .exec();

    // helper: robustly extract date string (handles Date objects, ISO strings, mongo extended JSON)
    const extractDateString = (val) => {
      if (!val && val !== 0) return '';
      if (typeof val === 'string') return val;
      if (val instanceof Date) return val.toISOString();
      if (typeof val === 'number') {
        const d = new Date(val);
        return isNaN(d.getTime()) ? '' : d.toISOString();
      }
      if (typeof val === 'object' && val !== null) {
        if ('$date' in val) {
          const dval = val.$date;
          if (typeof dval === 'string') return dval;
          if (typeof dval === 'number') return new Date(dval).toISOString();
          if (typeof dval === 'object' && '$numberLong' in dval) {
            const num = Number(dval.$numberLong);
            if (!Number.isNaN(num)) return new Date(num).toISOString();
          }
        }
      }
      return '';
    };

    // helper: compute end datetime (returns Date object or null)
    const computeEndDateTime = (test) => {
      try {
        // pull normalized date/time values (raw doc may have string or Date)
        const endDateRaw = test.endDate ?? test.end_date ?? test.end;
        const endTimeRaw = test.endTime ?? test.end_time ?? test.endAt ?? test.end_time;

        const endDateStr = extractDateString(endDateRaw);
        // if no endDate at all — consider it past by returning epoch
        if (!endDateStr) return new Date(0);

        // If endDateStr already contains a time (ISO) we can parse it; else combine with endTime
        let datePart = endDateStr;
        // If endDateStr contains "T", it's an ISO with possible time
        if (datePart.includes('T')) {
          const dt = new Date(datePart);
          // If endTimeRaw exists, override time portion
          if (!isNaN(dt.getTime()) && endTimeRaw && typeof endTimeRaw === 'string') {
            // parse HH:mm
            const parts = endTimeRaw.split(':').map(p => parseInt(p, 10));
            const hours = parts.length >= 1 && !Number.isNaN(parts[0]) ? Math.min(Math.max(parts[0], 0), 23) : dt.getHours();
            const minutes = parts.length >= 2 && !Number.isNaN(parts[1]) ? Math.min(Math.max(parts[1], 0), 59) : dt.getMinutes();
            dt.setHours(hours, minutes, 59, 999);
            return dt;
          }
          if (!isNaN(dt.getTime())) {
            dt.setHours(dt.getHours(), dt.getMinutes(), 59, 999);
            return dt;
          }
        }

        // parse endTime (HH:mm) default to 23:59 if missing or invalid
        let hours = 23;
        let minutes = 59;
        if (endTimeRaw && typeof endTimeRaw === 'string') {
          const parts = endTimeRaw.split(':').map(p => parseInt(p, 10));
          if (parts.length >= 1 && !Number.isNaN(parts[0])) hours = Math.min(Math.max(parts[0], 0), 23);
          if (parts.length >= 2 && !Number.isNaN(parts[1])) minutes = Math.min(Math.max(parts[1], 0), 59);
        }

        // create Date from date part (datePart may be "YYYY-MM-DD" or other ISO)
        // ensure we build an ISO string acceptable by Date
        let isoDate;
        if (datePart.includes('-')) {
          // if it's full ISO, keep date portion
          isoDate = datePart.split('T')[0];
        } else {
          isoDate = datePart;
        }

        // final ISO-like string
        const iso = `${isoDate}T${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:59.999Z`;
        const final = new Date(iso);
        // If parsed invalid (timezone issues), fallback to local construct
        if (isNaN(final.getTime())) {
          const local = new Date(isoDate);
          local.setHours(hours, minutes, 59, 999);
          return local;
        }
        return final;
      } catch (e) {
        return new Date(0);
      }
    };

    const now = new Date();
    const activeTests = [];
    const pastTests = [];

    // helper: normalize a test doc into UI-friendly shape
    const normalizeForUI = (t) => {
      const startDateStr = extractDateString(t.startDate ?? t.start_date ?? t.start ?? '');
      const endDateStr = extractDateString(t.endDate ?? t.end_date ?? t.end ?? '');
      const startTime = t.startTime ?? t.start_time ?? t.startAt ?? '';
      const endTime = t.endTime ?? t.end_time ?? t.endAt ?? t.endTime ?? '';
      const qPerTime = (t.qPerTime !== undefined && t.qPerTime !== null) ? t.qPerTime : (t.q_per_time ?? '');
      const syllabus = Array.isArray(t.syllabusTags) ? t.syllabusTags : Array.isArray(t.syllabus) ? t.syllabus : (typeof t.syllabusTags === 'string' ? t.syllabusTags.split(',').map(s => s.trim()).filter(Boolean) : []);
      const answerDriveLink = t.answerDriveLink || t.answer_drive_link || t.answerLink || t.answer_link || '';

      const displayDate = startDateStr ? startDateStr.slice(0, 10) : endDateStr ? endDateStr.slice(0, 10) : '';
      const displayTime = startTime || endTime || '';

      const endDT = computeEndDateTime(t);
      // ensure creator info is present
      const createdBy = (t.createdBy && typeof t.createdBy === 'object') ? {
        _id: t.createdBy._id || t.createdBy.id || null,
        name: t.createdBy.name || '',
        email: t.createdBy.email || '',
        branch: t.createdBy.branch || ''
      } : { _id: t.createdBy || null };

      return {
        id: t._id || t.id || '',
        title: t.title || t.name || '',
        name: t.title || t.name || '',
        startDateStr,
        startTime,
        endDateStr,
        endTime,
        date: displayDate,
        time: displayTime,
        qPerTime,
        syllabus,
        answerDriveLink,
        createdBy,
        endDateTime: endDT ? (endDT instanceof Date ? endDT.toISOString() : new Date(endDT).toISOString()) : null,
        raw: t
      };
    };

    for (const t of tests) {
      const normalized = normalizeForUI(t);
      // parse endDateTime as Date for comparison
      const endDT = normalized.endDateTime ? new Date(normalized.endDateTime) : new Date(0);
      if (endDT.getTime() > now.getTime()) activeTests.push(normalized);
      else pastTests.push(normalized);
    }

    return res.status(200).json({
      success: true,
      message: 'Tests fetched and grouped by active / past for admins in your branch.',
      admin: { id: user._id, name: user.name, email: user.email, branch: user.branch },
      activeTests,
      pastTests
    });
  } catch (err) {
    console.error('GET /api/admin/tests error:', err);
    return res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
});



module.exports = router;
