// routes/adminsList.js
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const auth = require('../middlewares/auth'); // must attach req.user = { id, role, ... }
const User = require('../models/User');
const Test = require('../models/Test');
const Defaulter = require('../models/Defaulter');
const SignupRequest  = require('../models/SignupRequest');
const jwt = require('jsonwebtoken');

/**
 * GET /api/users/admins
 * - Auth required
 * - Only admin role allowed (change if you want public access)
 * - Query params (optional):
 *    - page (default 1)
 *    - limit (default 50)
 *    - q (search by name or email)
 *
 * Response:
 * {
 *   success: true,
 *   total: 123,
 *   page: 1,
 *   limit: 50,
 *   results: [{ _id, name, email, branch, role, enrollmentNumber, createdAt }, ...]
 * }
 */

router.get('/admins', auth, async (req, res) => {
  try {
    const callerId = req.user && req.user.id;
    if (!callerId) return res.status(401).json({ success: false, message: 'Unauthorized' });

    // only allow admins to fetch the list (change if desired)
    if (req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Forbidden: admin only' });
    }

    // parse query params
    const page = Math.max(parseInt(req.query.page || '1', 10), 1);
    const limit = Math.min(Math.max(parseInt(req.query.limit || '50', 10), 1), 500); // limit cap 500
    const q = (req.query.q || '').trim();

    // build filter
    const filter = { role: 'admin' };

    if (q) {
      // search by name or email (case-insensitive)
      filter.$or = [
        { name: { $regex: q, $options: 'i' } },
        { email: { $regex: q, $options: 'i' } }
      ];
    }

    const skip = (page - 1) * limit;

    // total count
    const total = await User.countDocuments(filter);

    // fetch page
    let results = await User.find(filter)
      .select('_id name email branch role enrollmentNumber createdAt')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    results = results.filter(u =>
      u._id.toString() !== "6917dc4dfa0326a21fb2584c" &&
      u.email.toLowerCase() !== "tnpheadit@dronaa.com" &&
      u.enrollmentNumber !== "0000"
    );

    return res.json({
      success: true,
      total,
      page,
      limit,
      results
    });
  } catch (err) {
    console.error('GET /api/users/admins error:', err);
    return res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
});

router.get('/report', auth, async (req, res) => {
  try {
    const callerId = req.user && req.user.id;
    if (!callerId) return res.status(401).json({ success: false, message: 'Unauthorized' });

    // optional admin-only restriction
    if (req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Forbidden: admin only' });
    }

    const { branch } = req.query;
    // pagination (optional)
    const limit = Math.max(1, Math.min(parseInt(req.query.limit || '100', 10), 1000));
    const skip = Math.max(0, parseInt(req.query.skip || '0', 10));

    // build match for Defaulter docs (filter by branch if provided)
    const matchStage = {};
    if (branch) {
      matchStage.branch = branch;
    }

    // Aggregation pipeline:
    // 1) filter defaulter docs (branch optional)
    // 2) unwind defaulters array
    // 3) group by (user, test) to dedupe same user appearing multiple times in same doc
    // 4) group by user to count distinct tests
    // 5) lookup user details
    // 6) project required fields
    // 7) sort by testsCount desc
    const pipeline = [];

    if (Object.keys(matchStage).length > 0) {
      pipeline.push({ $match: matchStage });
    }

    pipeline.push(
      { $unwind: '$defaulters' },
      // dedupe per (user, test) pair
      {
        $group: {
          _id: { user: '$defaulters', test: '$test' }
        }
      },
      // count distinct tests per user
      {
        $group: {
          _id: '$_id.user',
          testsCount: { $sum: 1 }
        }
      },
      // lookup user info
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'user'
        }
      },
      { $unwind: { path: '$user', preserveNullAndEmptyArrays: true } },
      // final shape
      {
        $project: {
          userId: { $toString: '$_id' },
          name: '$user.name',
          enrollmentNumber: '$user.enrollmentNumber',
          email: '$user.email',
          testsCount: 1
        }
      },
      { $sort: { testsCount: -1, name: 1 } }
    );

    // run aggregation with pagination via $facet so we can return total easily
    const facetPipeline = [
      {
        $facet: {
          results: [
            ...pipeline,
            { $skip: skip },
            { $limit: limit }
          ],
          totalCount: [
            ...pipeline,
            { $count: 'count' }
          ]
        }
      }
    ];

    const agg = await Defaulter.aggregate(facetPipeline).exec();

    const results = (agg && agg[0] && agg[0].results) || [];
    const totalCountArr = (agg && agg[0] && agg[0].totalCount) || [];
    const totalUsers = totalCountArr.length > 0 ? totalCountArr[0].count : 0;

    return res.json({
      success: true,
      totalUsers,
      skip,
      limit,
      results
    });
  } catch (err) {
    console.error('GET /api/defaulters/report error:', err);
    return res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
});


router.get('/branches/summary', auth, async (req, res) => {
  try {
    const callerId = req.user && req.user.id;
    if (!callerId) return res.status(401).json({ success: false, message: 'Unauthorized' });

    // Admin-only
    if (req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Forbidden: admin only' });
    }

    const { branch: singleBranch } = req.query;
    let limitStudents = parseInt(req.query.limitStudents || '0', 10);
    if (isNaN(limitStudents) || limitStudents < 0) limitStudents = 0;

    // Build student aggregation: group students by branch
    // Only include users with role 'student'
    const studentMatch = { role: 'student' };
    if (singleBranch) studentMatch.branch = singleBranch;

    const studentPipeline = [
      { $match: studentMatch },
      {
        $group: {
          _id: { $ifNull: ['$branch', null] },
          studentCount: { $sum: 1 },
          students: {
            $push: {
              _id: '$_id',
              name: '$name',
              email: '$email',
              enrollmentNumber: '$enrollmentNumber'
            }
          }
        }
      },
      {
        $project: {
          branch: '$_id',
          studentCount: 1,
          students: 1
        }
      },
      { $sort: { branch: 1 } }
    ];

    // run student aggregation
    const studentGroups = await User.aggregate(studentPipeline).exec();

    // If caller requested a student limit per branch, slice arrays locally
    const studentGroupsNormalized = studentGroups.map((g) => {
      const studentsArray = Array.isArray(g.students) ? g.students : [];
      return {
        branch: g.branch,
        studentCount: g.studentCount || 0,
        students: limitStudents > 0 ? studentsArray.slice(0, limitStudents) : studentsArray
      };
    });

    // Build tests aggregation: count tests by creator's branch.
    // We assume Test.createdBy references User._id — lookup creator to get branch.
    const testMatch = {}; // no filter; if singleBranch supplied, we'll restrict after lookup
    const testPipeline = [
      { $match: testMatch },
      {
        $lookup: {
          from: 'users',
          localField: 'createdBy',
          foreignField: '_id',
          as: 'creator'
        }
      },
      { $unwind: { path: '$creator', preserveNullAndEmptyArrays: true } },
      {
        $group: {
          _id: { $ifNull: ['$creator.branch', null] },
          testsCount: { $sum: 1 }
        }
      },
      {
        $project: {
          branch: '$_id',
          testsCount: 1
        }
      }
    ];

    let testsGrouped = await Test.aggregate(testPipeline).exec();

    // If singleBranch requested, filter testsGrouped
    if (singleBranch) {
      testsGrouped = testsGrouped.filter((t) => String(t.branch) === String(singleBranch));
    }

    // Build a map branch -> testsCount
    const testsCountByBranch = {};
    (testsGrouped || []).forEach((t) => {
      const key = t.branch === null ? null : String(t.branch);
      testsCountByBranch[key] = (testsCountByBranch[key] || 0) + (t.testsCount || 0);
    });

    // Prepare final combined result:
    // include branches that have students OR tests (so union)
    const branchSet = new Set();
    studentGroupsNormalized.forEach((g) => branchSet.add(String(g.branch)));
    Object.keys(testsCountByBranch).forEach((b) => branchSet.add(String(b)));

    const results = Array.from(branchSet).map((bKey) => {
      // normalize null branch to null (not string 'null')
      const branchValue = bKey === 'null' ? null : bKey;
      const studentGroup = studentGroupsNormalized.find((s) =>
        (s.branch === null && branchValue === null) || String(s.branch) === String(branchValue)
      );
      return {
        branch: branchValue,
        studentCount: studentGroup ? studentGroup.studentCount : 0,
        students: studentGroup ? studentGroup.students : [],
        testsCount: testsCountByBranch[branchValue] || testsCountByBranch[String(branchValue)] || 0
      };
    });

    // Sort results by testsCount desc then branch name
    results.sort((a, b) => {
      if (b.testsCount !== a.testsCount) return b.testsCount - a.testsCount;
      const an = a.branch || '';
      const bn = b.branch || '';
      return an.localeCompare(bn);
    });

    return res.json({
      success: true,
      message: 'Branch summary fetched',
      totalBranches: results.length,
      results
    });
  } catch (err) {
    console.error('GET /api/admin/branches/summary error:', err);
    return res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
});


router.get('/tests/scheduled', auth, async (req, res) => {
  try {
    const callerId = req.user && req.user.id;
    if (!callerId) return res.status(401).json({ success: false, message: 'Unauthorized' });

    // Admin-only
    if (req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Forbidden: admin only' });
    }

    const { branch: queryBranch } = req.query;
    let limitTests = parseInt(req.query.limitTests || '0', 10);
    if (isNaN(limitTests) || limitTests < 0) limitTests = 0;

    const now = new Date();

    // Aggregation pipeline:
    // 1) match scheduled tests (startDate > now)
    // 2) lookup creator (users) to get branch if test doesn't have explicit branch
    // 3) compute branch = ifNull(test.branch, creator.branch)
    // 4) optionally filter by queryBranch
    // 5) group by branch and push tests
    const pipeline = [
      {
        $match: {
          startDate: { $gt: now } // scheduled = strictly future
        }
      },
      // populate creator to derive branch (if needed)
      {
        $lookup: {
          from: 'users',
          localField: 'createdBy',
          foreignField: '_id',
          as: 'creator'
        }
      },
      { $unwind: { path: '$creator', preserveNullAndEmptyArrays: true } },
      // derive branch: prefer test.branch if present, else creator.branch, else null
      {
        $addFields: {
          branchResolved: {
            $cond: [
              { $ifNull: ['$branch', false] },
              '$branch',
              { $ifNull: ['$creator.branch', null] }
            ]
          }
        }
      },
      // optional branch filter from query param
      ...(queryBranch ? [{ $match: { branchResolved: queryBranch } }] : []),
      // project required test fields (keep createdBy for reference)
      {
        $project: {
          _id: 1,
          title: 1,
          startDate: 1,
          startTime: 1,
          createdBy: 1,
          createdAt: 1,
          branchResolved: 1
        }
      },
      // group by branchResolved
      {
        $group: {
          _id: '$branchResolved',
          testsCount: { $sum: 1 },
          tests: {
            $push: {
              _id: '$_id',
              title: '$title',
              startDate: '$startDate',
              startTime: '$startTime',
              createdBy: '$createdBy',
              createdAt: '$createdAt'
            }
          }
        }
      },
      // convert _id to branch field
      {
        $project: {
          branch: '$_id',
          testsCount: 1,
          tests: 1
        }
      },
      { $sort: { testsCount: -1, branch: 1 } }
    ];

    let grouped = await Test.aggregate(pipeline).exec();

    // apply per-branch limit if requested
    if (limitTests > 0 && Array.isArray(grouped)) {
      grouped = grouped.map((g) => ({
        branch: g.branch,
        testsCount: g.testsCount,
        tests: Array.isArray(g.tests) ? g.tests.slice(0, limitTests) : []
      }));
    }

    return res.json({
      success: true,
      message: 'Scheduled tests fetched',
      totalBranches: grouped.length,
      results: grouped
    });
  } catch (err) {
    console.error('GET /api/admin/tests/scheduled error:', err);
    return res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
});


router.get('/reports/branch-averages', auth, async (req, res) => {
  try {
    const callerId = req.user && req.user.id;
    if (!callerId) return res.status(401).json({ success: false, message: 'Unauthorized' });

    // Admin only
    if (req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Forbidden: admin only' });
    }

    const { branch: branchFilter, minSubmissions = '0', limit = '0' } = req.query;
    const minSub = parseInt(minSubmissions, 10) || 0;
    const limitNum = parseInt(limit, 10) || 0;

    // Aggregation pipeline:
    // 1) match students only (role: 'student') and branch exists (if branchFilter given)
    // 2) unwind testsGiven (skip users without testsGiven)
    // 3) convert testsGiven.marks to double (onError -> null)
    // 4) filter out null marks
    // 5) group by branch: avg, sum submissions, collect distinct student ids
    // 6) project counts and round average to 2 decimals
    // 7) optionally filter by minSubmissions
    // 8) sort by avg desc
    const pipeline = [];

    // match students and branch filter (if provided)
    const match = { role: 'student' };
    if (branchFilter) match.branch = branchFilter;
    pipeline.push({ $match: match });

    // unwind testsGiven entries
    pipeline.push({
      $unwind: {
        path: '$testsGiven',
        preserveNullAndEmptyArrays: false // skip users without testsGiven entries
      }
    });

    // convert marks to double and place branch & studentId
    pipeline.push({
      $project: {
        branch: { $ifNull: ['$branch', null] },
        studentId: '$_id',
        // use $convert to force numeric, onError/onNull produce null and will be filtered out
        mark: {
          $convert: {
            input: '$testsGiven.marks',
            to: 'double',
            onError: null,
            onNull: null
          }
        }
      }
    });

    // filter only entries with non-null numeric mark and branch not null
    pipeline.push({
      $match: {
        mark: { $ne: null },
        branch: { $ne: null }
      }
    });

    // group by branch
    pipeline.push({
      $group: {
        _id: '$branch',
        avgMark: { $avg: '$mark' },
        submissionsCount: { $sum: 1 },
        distinctStudents: { $addToSet: '$studentId' }
      }
    });

    // project final shape and compute distinctStudentsCount and rounded avg
    pipeline.push({
      $project: {
        branch: '$_id',
        _id: 0,
        avgMark: { $round: ['$avgMark', 2] },
        submissionsCount: 1,
        distinctStudentsCount: { $size: '$distinctStudents' }
      }
    });

    // optionally filter by minSubmissions
    if (minSub > 0) {
      pipeline.push({ $match: { submissionsCount: { $gte: minSub } } });
    }

    // sort by avgMark desc
    pipeline.push({ $sort: { avgMark: -1, submissionsCount: -1, branch: 1 } });

    // apply limit if requested
    if (limitNum > 0) pipeline.push({ $limit: limitNum });

    const results = await User.aggregate(pipeline).exec();

    return res.json({
      success: true,
      message: 'Branch averages fetched',
      totalBranches: results.length,
      results
    });
  } catch (err) {
    console.error('GET /api/reports/branch-averages error:', err);
    return res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
});


router.get('/admin/signup-requests', async (req, res) => {
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

    const admin = await User.findById(decoded.id).select('name email role branch');
    if (!admin) return res.status(404).json({ success: false, message: 'Admin not found.' });
    if (admin.role !== 'admin') return res.status(403).json({ success: false, message: 'Access denied. Admins only.' });

    // NOTE: no branch filtering here — admin sees requests from all branches
    const status = (req.query.status || 'under_review');
    const requests = await SignupRequest.find({ status })
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
 * ADMIN — accept a request (any branch allowed)
 * POST /api/admin/signup-requests/:id/accept
 */

const JWT_SECRET = process.env.JWT_SECRET || 'your_fallback_secret_here';

router.post('/admin/signup-requests/:id/accept', async (req, res) => {
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

    const admin = await User.findById(decoded.id).select('name email role branch');
    if (!admin) return res.status(404).json({ success: false, message: 'Admin not found.' });
    if (admin.role !== 'admin') return res.status(403).json({ success: false, message: 'Access denied. Admins only.' });

    const reqId = req.params.id;
    const request = await SignupRequest.findById(reqId);
    if (!request) return res.status(404).json({ success: false, message: 'Request not found.' });
    if (request.status !== 'under_review') {
      return res.status(400).json({ success: false, message: `Request already ${request.status}.` });
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

    // Create the actual user (preserve branch from request)
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
      isVerified: true // or false if you want email verification later
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
 * ADMIN — reject a request (any branch allowed)
 * POST /api/admin/signup-requests/:id/reject
 */
router.post('/admin/signup-requests/:id/reject', async (req, res) => {
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

    const admin = await User.findById(decoded.id).select('name email role branch');
    if (!admin) return res.status(404).json({ success: false, message: 'Admin not found.' });
    if (admin.role !== 'admin') return res.status(403).json({ success: false, message: 'Access denied. Admins only.' });

    const reqId = req.params.id;
    const request = await SignupRequest.findById(reqId);
    if (!request) return res.status(404).json({ success: false, message: 'Request not found.' });
    if (request.status !== 'under_review') {
      return res.status(400).json({ success: false, message: `Request already ${request.status}.` });
    }

    // No branch check here — admin can reject any request
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


module.exports = router;
