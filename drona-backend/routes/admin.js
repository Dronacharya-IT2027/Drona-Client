// routes/adminLatestUnattempted.js
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const auth = require('../middlewares/auth'); // must set req.user = { id, role, ... }
const User = require('../models/User');
const Test = require('../models/Test');

/**
 * GET /api/admin/latest-unattempted
 * - Auth required
 * - Only admin role allowed
 * - Finds admin.branch via User.findById(req.user.id)
 * - Finds latest test created by that admin (most recent createdAt)
 * - Finds students in the same branch who have NOT attempted that test
 *
 * Response includes:
 *  - test: latest test object (no questions)
 *  - tests: all tests created by this admin (no questions) sorted desc by createdAt
 *  - students: list of students who haven't attempted the latest test
 */
router.get('/latest-unattempted', auth, async (req, res) => {
  try {
    const callerId = req.user && req.user.id;
    if (!callerId) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    // load admin user to get branch & role
    const adminUser = await User.findById(callerId).select('role branch name email').lean();
    if (!adminUser) {
      return res.status(404).json({ success: false, message: 'Admin user not found' });
    }

    if (adminUser.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Forbidden: admin only' });
    }

    const adminBranch = adminUser.branch;
    if (!adminBranch) {
      return res.status(400).json({ success: false, message: 'Admin branch not set' });
    }

    // Build find filter for tests created by this admin
    const createdByFilter = mongoose.isValidObjectId(callerId)
      ? { createdBy: new mongoose.Types.ObjectId(callerId) }
      : { createdBy: callerId };

    // Load all tests created by this admin (exclude questions, __v) sorted newest first
    const tests = await Test.find(createdByFilter)
      .sort({ createdAt: -1 })
      .select('-questions -__v')
      .lean();

    if (!tests || tests.length === 0) {
      // still return success but with empty tests array for client convenience
      return res.json({
        success: true,
        message: 'No tests found for this admin',
        admin: {
          id: String(adminUser._id || callerId),
          name: adminUser.name || null,
          email: adminUser.email || null,
          branch: adminBranch
        },
        tests: [],
        test: null,
        notAttemptedCount: 0,
        students: []
      });
    }

    // latest test is first in sorted list
    const latestTest = tests[0];
    const testIdStr = latestTest._id ? String(latestTest._id) : null;

    // Fetch students in same branch (role student), exclude admin id,
    // select small set of fields including testsGiven (to check attempts)
    const studentQuery = {
      branch: adminBranch,
      role: 'student'
    };

    if (mongoose.isValidObjectId(callerId)) {
      studentQuery._id = { $ne: new mongoose.Types.ObjectId(callerId) };
    } else {
      studentQuery._id = { $ne: callerId };
    }

    const branchStudents = await User.find(studentQuery)
      .select('name email enrollmentNumber testsGiven')
      .lean();

    // Filter students who have NOT attempted this latest test
    const notAttempted = branchStudents.filter((stu) => {
      if (!Array.isArray(stu.testsGiven) || stu.testsGiven.length === 0) return true;
      return !stu.testsGiven.some((tg) => {
        try {
          return String(tg.test) === testIdStr;
        } catch (e) {
          return false;
        }
      });
    });

    // Map returned students to clean shape for client
    const studentsClean = notAttempted.map((s) => ({
      _id: String(s._id),
      name: s.name || '',
      email: s.email || '',
      enrollmentNumber: s.enrollmentNumber || null
    }));

    return res.json({
      success: true,
      message: 'Latest test and unattempted students fetched for admin',
      admin: {
        id: String(adminUser._id || callerId),
        name: adminUser.name || null,
        email: adminUser.email || null,
        branch: adminBranch
      },
      // include all tests (newest first) plus the latest single item for compatibility
      tests,
      test: latestTest,
      notAttemptedCount: studentsClean.length,
      students: studentsClean
    });
  } catch (err) {
    console.error('GET /api/admin/latest-unattempted error:', err);
    return res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
});


// POST /api/admin/unattempted-for-test
// Body: { testId: "<test id>" }
// Returns: test (the requested test), tests (all admin tests), students (unattempted for requested test)
router.post('/unattempted-for-test', auth, async (req, res) => {
  try {
    const callerId = req.user && req.user.id;
    if (!callerId) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const { testId } = req.body;
    if (!testId) {
      return res.status(400).json({ success: false, message: 'testId is required in body' });
    }

    if (!mongoose.Types.ObjectId.isValid(testId)) {
      return res.status(400).json({ success: false, message: 'Invalid testId' });
    }

    // load admin user to get role & branch
    const adminUser = await User.findById(callerId).select('role branch name email').lean();
    if (!adminUser) {
      return res.status(404).json({ success: false, message: 'Admin user not found' });
    }

    if (adminUser.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Forbidden: admin only' });
    }

    const adminBranch = adminUser.branch;
    if (!adminBranch) {
      return res.status(400).json({ success: false, message: 'Admin branch not set' });
    }

    // load the test requested (exclude questions to keep payload light)
    const test = await Test.findById(testId).select('-questions -__v').lean();
    if (!test) {
      return res.status(404).json({ success: false, message: 'Test not found' });
    }

    // Ensure the test belongs to this admin (createdBy). If you want to allow any admin of the branch
    // to query tests not created by them, remove/comment this check.
    if (test.createdBy && String(test.createdBy) !== String(callerId)) {
      return res.status(403).json({ success: false, message: 'Forbidden: you did not create this test' });
    }

    // Also fetch all tests created by this admin for the response (same as GET route)
    const createdByFilter = mongoose.isValidObjectId(callerId)
      ? { createdBy: new mongoose.Types.ObjectId(callerId) }
      : { createdBy: callerId };

    const tests = await Test.find(createdByFilter)
      .sort({ createdAt: -1 })
      .select('-questions -__v')
      .lean();

    // Find students in same branch (role student), exclude admin user
    const studentQuery = {
      branch: adminBranch,
      role: 'student'
    };

    if (mongoose.isValidObjectId(callerId)) {
      studentQuery._id = { $ne: new mongoose.Types.ObjectId(callerId) };
    } else {
      studentQuery._id = { $ne: callerId };
    }

    const branchStudents = await User.find(studentQuery)
      .select('name email enrollmentNumber testsGiven')
      .lean();

    // Filter students who have NOT attempted this requested test
    const testIdStr = String(test._id);
    const notAttempted = branchStudents.filter((stu) => {
      if (!Array.isArray(stu.testsGiven) || stu.testsGiven.length === 0) return true;
      // testsGiven array items may look like { test: ObjectId, marks: Number, ... }
      return !stu.testsGiven.some((tg) => {
        try {
          return String(tg.test) === testIdStr;
        } catch (e) {
          return false;
        }
      });
    });

    const studentsClean = notAttempted.map((s) => ({
      _id: String(s._id),
      name: s.name || '',
      email: s.email || '',
      enrollmentNumber: s.enrollmentNumber || null
    }));

    return res.json({
      success: true,
      message: 'Test and not-attempted students fetched for admin',
      admin: {
        id: String(adminUser._id || callerId),
        name: adminUser.name || null,
        email: adminUser.email || null,
        branch: adminBranch
      },
      tests,
      test,
      notAttemptedCount: studentsClean.length,
      students: studentsClean
    });
  } catch (err) {
    console.error('POST /api/admin/unattempted-for-test error:', err);
    return res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
});

module.exports = router;
