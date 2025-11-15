// routes/users.js
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const auth = require('../middlewares/auth');
const mongoose = require('mongoose');
const {isTestOver} = require('../utils/Testfunction');

router.get('/rankings/branch/:branch', async (req, res) => {
  try {
    const { branch } = req.params;
    if (!branch) return res.status(400).json({ message: 'branch param is required' });

    const limit = Math.max(0, parseInt(req.query.limit || '0', 10));
    const skip = Math.max(0, parseInt(req.query.skip || '0', 10));

    const excludedId = "6917dc4dfa0326a21fb2584c";
    const excludedEmail = "tnpheadit@dronaa.com";

    const pipeline = [
      // Exclude specific user
      {
        $match: {
          _id: { $ne: new mongoose.Types.ObjectId(excludedId) },
          email: { $ne: excludedEmail }
        }
      },
      // Match branch case-insensitive
      {
        $match: {
          branch: { $regex: `^${branch}$`, $options: 'i' }
        }
      },
      {
        $setWindowFields: {
          sortBy: { totalMarks: -1 },
          output: { rank: { $denseRank: {} } }
        }
      },
      { $sort: { totalMarks: -1, name: 1 } },
      {
        $project: {
          passwordHash: 0,
          __v: 0
        }
      }
    ];

    if (skip) pipeline.push({ $skip: skip });
    if (limit) pipeline.push({ $limit: limit });

    const results = await User.aggregate(pipeline).exec();

    const count = await User.countDocuments({
      branch: { $regex: `^${branch}$`, $options: 'i' },
      _id: { $ne: excludedId },
      email: { $ne: excludedEmail }
    });

    return res.json({ branch, count, results });
  } catch (err) {
    console.error('GET /api/users/rankings/branch/:branch error:', err);

    if (err.message && err.message.includes('$setWindowFields')) {
      return res.status(500).json({
        message:
          '$setWindowFields not supported by current MongoDB server. Use MongoDB >= 5.0 or the fallback endpoint /api/users/rankings/branch/:branch/fallback'
      });
    }

    return res.status(500).json({ message: 'Server error', error: err.message });
  }
});


// Complete IT not branch wise rankings
router.get("/rankings/all", async (req, res) => {
  try {
    const excludedId = "6917dc4dfa0326a21fb2584c";
    const excludedEmail = "tnpheadit@dronaa.com";

    const rankings = await User.aggregate([
      // Exclude specific user
      {
        $match: {
          _id: { $ne: new mongoose.Types.ObjectId(excludedId) },
          email: { $ne: excludedEmail }
        }
      },
      {
        $setWindowFields: {
          sortBy: { totalMarks: -1 },
          output: {
            rank: { $denseRank: {} },
          },
        },
      },
      { $sort: { rank: 1, name: 1 } },
      {
        $project: {
          _id: 1,
          name: 1,
          enrollmentNumber: 1,
          totalMarks: 1,
          rank: 1,
          branch: 1,
        },
      },
    ]);

    res.json({ success: true, results: rankings });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error", error: err.message });
  }
});


router.get('/me/tests', auth, async (req, res) => {
  try {
    const userId = req.user && req.user.id;
    if (!userId) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    // load user's testsGiven array (only that field) and lean for performance
    const user = await User.findById(userId)
      .select('testsGiven')
      .populate({
        path: 'testsGiven.test',
        // exclude questions array from the populated test
        select: '-questions -__v'
      })
      .lean();

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // If no testsGiven, return empty array
    const testsGiven = Array.isArray(user.testsGiven) ? user.testsGiven : [];

    // Build results: include populated test object (if still exists) + marks
    // Optionally skip entries where test is null (deleted), but include if you'd prefer.
    const results = testsGiven
      .map((entry) => {
        const testDoc = entry.test || null; // populated document or null
        const marks = typeof entry.marks === 'number' ? entry.marks : null;

        // if test was deleted, skip (or include placeholder). Here we'll skip.
        if (!testDoc) return null;

        // convert _id to string for convenience
        if (testDoc._id && typeof testDoc._id.toString === 'function') {
          testDoc._id = testDoc._id.toString();
        }

        // optionally remove heavy/undesired fields (already removed questions above)
        // ensure dates are stringified for client if needed
        if (testDoc.startDate && testDoc.startDate.toISOString) {
          testDoc.startDate = testDoc.startDate.toISOString();
        }
        if (testDoc.endDate && testDoc.endDate.toISOString) {
          testDoc.endDate = testDoc.endDate.toISOString();
        }

        return {
          test: testDoc,
          isOver: isTestOver(testDoc.endDate, testDoc.endTime),
          marks
        };
      })
      .filter(Boolean);

    // Optionally sort results by test.endDate descending (most recent first)
    results.sort((a, b) => {
      const aDate = a.test && a.test.endDate ? new Date(a.test.endDate).getTime() : 0;
      const bDate = b.test && b.test.endDate ? new Date(b.test.endDate).getTime() : 0;
      return bDate - aDate;
    });

    return res.json({ success: true, results, total: results.length });
  } catch (err) {
    console.error('GET /api/users/me/tests error:', err);
    return res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
});

router.get('/totaluser', async (req, res) => {
  try {
    const count = await User.countDocuments(); // counts all users
     
    res.json({
      success: true,
      totalUsers: count
    });
  } catch (err) {
    console.error('GET /api/users/totaluser error:', err);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: err.message
    });
  }
});


module.exports = router;
