// routes/admin-management.js
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User'); // adjust path to your models
const JWT_SECRET = process.env.JWT_SECRET || 'your_fallback_secret_here';

/**
 * Middleware: authenticate and ensure caller is admin
 * Attaches `req.admin` with the admin User doc (selected fields).
 */
async function requireAdmin(req, res, next) {
  try {
    const authHeader = req.header('Authorization') || '';
    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;
    if (!token) return res.status(401).json({ success: false, message: 'No token provided. Authorization denied.' });

    let decoded;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch (err) {
      return res.status(401).json({ success: false, message: 'Invalid or expired token.' });
    }

    const admin = await User.findById(decoded.id).select('name email role');
    if (!admin) return res.status(404).json({ success: false, message: 'Admin not found.' });
    if (admin.role !== 'admin') return res.status(403).json({ success: false, message: 'Access denied. Admins only.' });

    req.admin = admin;
    next();
  } catch (err) {
    console.error('requireAdmin middleware error:', err);
    return res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
}

/**
 * ADMIN — promote a user to admin
 * POST /api/admin/make-admin
 * Body: { email: "user@example.com" }
 */
router.post('/admin/make-admin', requireAdmin, async (req, res) => {
  try {
    const { email } = req.body || {};
    if (!email || typeof email !== 'string') {
      return res.status(400).json({ success: false, message: 'Missing or invalid "email" in request body.' });
    }

    const target = await User.findOne({ email: email.trim().toLowerCase() });
    if (!target) {
      return res.status(404).json({
        success: false,
        message: 'User with provided email does not exist. Please ask admin to make an account first.',
      });
    }

    if (target.role === 'admin') {
      return res.status(400).json({ success: false, message: 'User is already an admin.' });
    }

    target.role = 'admin';
    await target.save();

    return res.json({
      success: true,
      message: 'User promoted to admin successfully.',
      user: {
        id: target._id,
        name: target.name,
        email: target.email,
        role: target.role,
      },
    });
  } catch (err) {
    console.error('POST /admin/make-admin error:', err);
    return res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
});

/**
 * ADMIN — demote an admin back to student
 * POST /api/admin/remove-admin
 * Body: { email: "user@example.com" }
 */
router.post('/admin/remove-admin', requireAdmin, async (req, res) => {
  try {
    const { email } = req.body || {};
    if (!email || typeof email !== 'string') {
      return res.status(400).json({ success: false, message: 'Missing or invalid "email" in request body.' });
    }

    const target = await User.findOne({ email: email.trim().toLowerCase() });
    if (!target) {
      return res.status(404).json({
        success: false,
        message: 'User with provided email does not exist. Please ask admin to make an account first.',
      });
    }

    if (target.role !== 'admin') {
      return res.status(400).json({ success: false, message: 'Target user is not an admin.' });
    }

    // Prevent admin from demoting themselves to avoid accidental lockout.
    if (req.admin && String(req.admin._id) === String(target._id)) {
      return res.status(400).json({
        success: false,
        message: 'You cannot demote yourself. Ask another admin to perform this action.',
      });
    }

    target.role = 'student';
    await target.save();

    return res.json({
      success: true,
      message: 'Admin role removed; user is now a student.',
      user: {
        id: target._id,
        name: target.name,
        email: target.email,
        role: target.role,
      },
    });
  } catch (err) {
    console.error('POST /admin/remove-admin error:', err);
    return res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
});

module.exports = router;
