// routes/defaulters.js
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Defaulter = require('../models/Defaulter');
const User = require('../models/User');
const Test = require('../models/Test');
const auth = require('../middlewares/auth'); // sets req.user = { id, role, ... }
const {reportCheatingEmail} = require('../utils/emailService');

/**
 * Helper: safe ObjectId conversion
 */
function toObjectId(id) {
  try {
    return mongoose.Types.ObjectId(id);
  } catch (e) {
    return null;
  }
}

/**
 * POST /api/defaulters/mark
 * Payload: { testId, userId }
 * Adds userId to defaulters array for the test (creates doc if not present).
 * Uses $addToSet to avoid duplicates.
 */
// POST /defaulters/mark  — mark the JWT user as defaulter for given testId
router.post('/mark', auth, async (req, res) => {
  try {
    const callerId = req.user && req.user.id;
    if (!callerId) return res.status(401).json({ success: false, message: 'Unauthorized' });

    const { testId } = req.body;
    if (!testId) {
      return res.status(400).json({ success: false, message: 'testId is required' });
    }

    if (!mongoose.Types.ObjectId.isValid(testId)) {
      return res.status(400).json({ success: false, message: 'Invalid testId' });
    }

    // optional: confirm test exists
    const testDoc = await Test.findById(testId).select('_id createdBy branch').lean();
    if (!testDoc) return res.status(404).json({ success: false, message: 'Test not found' });

    // upsert: add callerId to defaulters array for this test
    const update = {
      $addToSet: { defaulters: callerId }, // push string id; mongoose will cast
      $setOnInsert: {
        test: testId,
        branch: testDoc.branch || undefined
      }
    };
    const options = { upsert: true, new: true, setDefaultsOnInsert: true };

    let doc = await Defaulter.findOneAndUpdate({ test: testId }, update, options).exec();

    // ensure meta.totalDefaulters is in sync
    if (doc) {
      const count = Array.isArray(doc.defaulters) ? doc.defaulters.length : 0;
      doc.meta = doc.meta || {};
      doc.meta.totalDefaulters = count;
      await doc.save();
    }

    // populate for response
    doc = await Defaulter.findById(doc._id)
      .populate('test', 'title startDate startTime endDate endTime createdBy')
      .populate('defaulters', 'name email enrollmentNumber')
      .lean();

    // try {
    //   const caller = await User.findById(callerId).select('email name').lean();
    //   if (caller && caller.email) {
    //     // call the report function; if it fails we log but still return success to frontend
    //     const reported = await reportCheatingEmail(caller.email);
    //     if (reported) {
    //       console.log(`reportCheatingEmail: report sent for ${caller.email}`);
    //     } else {
    //       console.warn(`reportCheatingEmail: reporting returned false for ${caller.email}`);
    //     }
    //   } else {
    //     console.warn(`reportCheatingEmail: could not find email for user ${callerId}`);
    //   }
    // } catch (reportErr) {
    //   // protect the main flow from reporting failures
    //   console.error('Error while calling reportCheatingEmail:', reportErr);
    // }

    return res.json({ success: true, message: 'Defaulter recorded', defaulter: doc });
  } catch (err) {
    console.error('POST /api/defaulters/mark error:', err);
    return res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
});


/**
 * GET /api/defaulters/admin/latest
 * Admin-only.
 * Finds all Defaulter docs whose tests were created by this admin, returns the list
 * and the "latest" one (based on populated test.createdAt descending).
 */
router.get('/admin/latest', auth, async (req, res) => {
  try {
    const callerId = req.user && req.user.id;
    if (!callerId) return res.status(401).json({ success: false, message: 'Unauthorized' });

    const adminUser = await User.findById(callerId).select('role branch name email').lean();
    if (!adminUser) return res.status(404).json({ success: false, message: 'User not found' });
    if (adminUser.role !== 'admin') return res.status(403).json({ success: false, message: 'Forbidden: admin only' });

    // Find tests created by this admin
    const createdByFilter = mongoose.isValidObjectId(callerId)
      ? { createdBy: new mongoose.Types.ObjectId(callerId) }
      : { createdBy: callerId };

    const adminTests = await Test.find(createdByFilter)
      .select('_id title startDate createdAt')
      .lean();

    if (!adminTests || adminTests.length === 0) {
      return res.json({
        success: true,
        message: 'No tests found for admin',
        admin: { id: String(adminUser._id), name: adminUser.name, email: adminUser.email, branch: adminUser.branch },
        allDefaulters: [],
        latest: null,
        tests: []
      });
    }

    // Build ObjectId list for $in
    const adminTestIds = adminTests
      .map((t) => (t && t._id ? String(t._id) : null))
      .filter(Boolean)
      .map((id) => new mongoose.Types.ObjectId(id));

    // Find Defaulter docs for those tests, populate test and defaulters
    const defaulterDocs = await Defaulter.find({ test: { $in: adminTestIds } })
      .populate('test', 'title startDate createdAt createdBy')
      .populate('defaulters', 'name email enrollmentNumber')
      .sort({ createdAt: -1 })
      .lean();

    // Determine latest defaulter doc using test.createdAt (prefer) then doc.createdAt
    let latest = null;
    if (Array.isArray(defaulterDocs) && defaulterDocs.length > 0) {
      defaulterDocs.sort((a, b) => {
        const aTestDate = a.test && a.test.createdAt ? new Date(a.test.createdAt).getTime() : 0;
        const bTestDate = b.test && b.test.createdAt ? new Date(b.test.createdAt).getTime() : 0;
        if (aTestDate !== bTestDate) return bTestDate - aTestDate;
        const aDocDate = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const bDocDate = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return bDocDate - aDocDate;
      });
      latest = defaulterDocs[0] || null;
    }

    // Build unique tests array from defaulterDocs (populated)
    const testsMap = new Map();
    if (Array.isArray(defaulterDocs)) {
      for (const doc of defaulterDocs) {
        const t = doc.test;
        if (t && t._id) {
          const idStr = String(t._id);
          if (!testsMap.has(idStr)) {
            testsMap.set(idStr, t);
          }
        }
      }
    }
    const tests = Array.from(testsMap.values());

    return res.json({
      success: true,
      message: 'Defaulters for admin tests fetched',
      admin: { id: String(adminUser._id), name: adminUser.name, email: adminUser.email, branch: adminUser.branch },
      allDefaulters: defaulterDocs,
      latest,
      tests
    });
  } catch (err) {
    console.error('GET /api/defaulters/admin/latest error:', err);
    return res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
});

/**
 * POST /api/defaulters/for-test
 * - Body: { testId }
 * - returns: { success, test, defaulters, meta, tests }
 *   where `tests` is the same list of populated tests from defaulter docs for this admin.
 */
router.post('/for-test', auth, async (req, res) => {
  try {
    const callerId = req.user && req.user.id;
    if (!callerId) return res.status(401).json({ success: false, message: 'Unauthorized' });

    const { testId } = req.body;
    if (!testId) return res.status(400).json({ success: false, message: 'testId is required' });
    if (!mongoose.Types.ObjectId.isValid(testId)) return res.status(400).json({ success: false, message: 'Invalid testId' });

    // Verify admin
    const adminUser = await User.findById(callerId).select('role branch name email').lean();
    if (!adminUser) return res.status(404).json({ success: false, message: 'User not found' });
    if (adminUser.role !== 'admin') return res.status(403).json({ success: false, message: 'Forbidden: admin only' });

    // Load test and ensure it belongs to caller
    const testDoc = await Test.findById(testId).select('_id createdBy title startDate createdAt').lean();
    if (!testDoc) return res.status(404).json({ success: false, message: 'Test not found' });

    if (testDoc.createdBy && String(testDoc.createdBy) !== String(callerId)) {
      return res.status(403).json({ success: false, message: 'Forbidden: you did not create this test' });
    }

    // Find the defaulter doc for this test
    const defaulterDoc = await Defaulter.findOne({ test: new mongoose.Types.ObjectId(testId) })
      .populate('test', 'title startDate createdBy createdAt')
      .populate('defaulters', 'name email enrollmentNumber')
      .lean();

    // Additionally build the same tests list (all tests present in defaulter docs for this admin)
    // We'll fetch admin's tests that appear in Defaulter documents
    const createdByFilter = mongoose.isValidObjectId(callerId)
      ? { createdBy: new mongoose.Types.ObjectId(callerId) }
      : { createdBy: callerId };

    const adminTests = await Test.find(createdByFilter).select('_id title startDate createdAt').lean();
    const adminTestIds = adminTests.map(t => String(t._id)).filter(Boolean).map(id => new mongoose.Types.ObjectId(id));

    const defaulterDocs = await Defaulter.find({ test: { $in: adminTestIds } })
      .populate('test', 'title startDate createdAt createdBy')
      .sort({ createdAt: -1 })
      .lean();

    const testsMap = new Map();
    if (Array.isArray(defaulterDocs)) {
      for (const doc of defaulterDocs) {
        const t = doc.test;
        if (t && t._id) {
          const idStr = String(t._id);
          if (!testsMap.has(idStr)) testsMap.set(idStr, t);
        }
      }
    }
    const tests = Array.from(testsMap.values());

    if (!defaulterDoc) {
      return res.json({
        success: true,
        message: 'No defaulters recorded for this test',
        test: testDoc,
        defaulters: [],
        meta: {},
        tests
      });
    }

    return res.json({
      success: true,
      message: 'Defaulters fetched for test',
      test: defaulterDoc.test,
      defaulters: defaulterDoc.defaulters || [],
      meta: defaulterDoc.meta || {},
      tests
    });
  } catch (err) {
    console.error('POST /api/defaulters/for-test error:', err);
    return res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
});

module.exports = router;