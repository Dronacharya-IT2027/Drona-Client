// routes/tests.js
const express = require("express");
const router = express.Router();
const Test = require("../models/Test");
const auth = require("../middlewares/auth"); // middleware that sets req.user = { id, role, ... }
const User = require("../models/User");
const mongoose = require("mongoose");

router.post("/create", auth, async (req, res) => {
  try {
    const {
      title,
      startDate,
      startTime,
      endDate,
      endTime,
      qPerTime = null,
      syllabusTags,
      answerDriveLink,
    } = req.body;

    // Basic required validation
    if (!title) return res.status(400).json({ message: "title is required" });
    if (!startDate)
      return res.status(400).json({ message: "startDate is required" });
    if (!startTime)
      return res.status(400).json({ message: "startTime is required" });
    if (!endDate)
      return res.status(400).json({ message: "endDate is required" });
    if (!endTime)
      return res.status(400).json({ message: "endTime is required" });
    if (!syllabusTags)
      return res.status(400).json({ message: "syllabusTags is required" });
    if (!answerDriveLink)
      return res.status(400).json({ message: "answerDriveLink is required" });

    // Parse syllabusTags: accept array or comma-separated string
    let tags = [];
    if (Array.isArray(syllabusTags)) {
      tags = syllabusTags
        .map((t) => (typeof t === "string" ? t.trim() : t))
        .filter(Boolean);
    } else if (typeof syllabusTags === "string") {
      tags = syllabusTags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);
    } else {
      return res
        .status(400)
        .json({
          message: "syllabusTags must be an array or comma-separated string",
        });
    }

    // Parse dates and basic check
    const parsedStartDate = new Date(startDate);
    const parsedEndDate = new Date(endDate);
    if (isNaN(parsedStartDate.getTime()))
      return res.status(400).json({ message: "Invalid startDate" });
    if (isNaN(parsedEndDate.getTime()))
      return res.status(400).json({ message: "Invalid endDate" });

    // Build test object
    const testData = {
      title: String(title).trim(),
      startDate: parsedStartDate,
      startTime: String(startTime).trim(),
      endDate: parsedEndDate,
      endTime: String(endTime).trim(),
      qPerTime:
        qPerTime !== undefined && qPerTime !== null ? Number(qPerTime) : null,
      syllabusTags: tags,
      answerDriveLink: String(answerDriveLink).trim(),
      createdBy: req.user && req.user.id ? req.user.id : null,
    };

    // Create and save
    const test = new Test(testData);
    await test.save();

    return res.status(201).json({ test });
  } catch (err) {
    console.error("POST /api/tests/create error:", err);
    // duplicate title or other mongoose errors will fall here
    return res
      .status(500)
      .json({ message: "Server error", error: err.message });
  }
});

router.post("/:testId/questions", auth, async (req, res) => {
  try {
    const { testId } = req.params;
    const { questions } = req.body;
    const userId = req.user && req.user.id;

    if (!testId)
      return res.status(400).json({ message: "testId is required in the URL" });

    if (!questions || !Array.isArray(questions) || questions.length === 0) {
      return res
        .status(400)
        .json({ message: "questions must be a non-empty array" });
    }

    // Find test
    const test = await Test.findById(testId);
    if (!test) return res.status(404).json({ message: "Test not found" });

    // Ensure the requester is the creator of the test
    if (!test.createdBy) {
      return res
        .status(403)
        .json({
          message: "Test has no creator information; cannot add questions",
        });
    }
    if (test.createdBy.toString() !== userId.toString()) {
      return res
        .status(403)
        .json({ message: "Only the test creator can add questions" });
    }

    // Validate and build question objects
    const toAdd = [];
    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];

      if (!q || typeof q !== "object") {
        return res
          .status(400)
          .json({
            message: `Each question must be an object (error at index ${i})`,
          });
      }

      const { question, options, correctAnswer } = q;

      if (!question || typeof question !== "string" || !question.trim()) {
        return res
          .status(400)
          .json({
            message: `question is required and must be a non-empty string (error at index ${i})`,
          });
      }

      // options if provided must be an array of non-empty strings
      let opts = [];
      if (options !== undefined && options !== null) {
        if (!Array.isArray(options)) {
          return res
            .status(400)
            .json({
              message: `options must be an array of strings (error at index ${i})`,
            });
        }
        opts = options
          .map((o) => (typeof o === "string" ? o.trim() : ""))
          .filter(Boolean);
      }

      // correctAnswer if provided must be a string
      let corr = undefined;
      if (correctAnswer !== undefined && correctAnswer !== null) {
        if (typeof correctAnswer !== "string") {
          return res
            .status(400)
            .json({
              message: `correctAnswer must be a string (error at index ${i})`,
            });
        }
        corr = correctAnswer.trim();
        // OPTIONAL: enforce correctAnswer exists in options (uncomment if desired)
        // if (opts.length > 0 && !opts.includes(corr)) {
        //   return res.status(400).json({ message: `correctAnswer must match one of the options (error at index ${i})` });
        // }
      }

      toAdd.push({
        question: question.trim(),
        options: opts,
        correctAnswer: corr,
      });
    }

    // Push all questions and save
    test.questions.push(...toAdd);
    await test.save();

    // The newly added questions will be the last `toAdd.length` entries
    const addedQuestions = test.questions.slice(-toAdd.length);

    return res.status(201).json({
      message: `Added ${addedQuestions.length} question(s)`,
      questions: addedQuestions,
      totalQuestions: test.questions.length,
    });
  } catch (err) {
    console.error("POST /api/tests/:testId/questions (bulk) error:", err);
    return res
      .status(500)
      .json({ message: "Server error", error: err.message });
  }
});

// GET /api/tests/active
// Returns active tests for the logged-in user where test creator's branch === user's branch
// Does NOT include `questions` in the response
router.get('/active', auth, async (req, res) => {
  try {
    console.log('User info in /api/tests/active:', req.user);

    // fetch branch from DB using id from token (req.user.id)
    const storeduser = await User.findById(req.user.id).select('branch').lean();
    if (!storeduser || !storeduser.branch) {
      return res.status(400).json({ success: false, message: 'User branch not found' });
    }
    const userBranch = storeduser.branch;

    // use server 'now' (absolute instant) for comparison
    const now = new Date();

    /**
     * Aggregation pipeline:
     * - split endTime into hour/minute
     * - dateFromParts (with timezone) to build local endDateTime
     * - lookup creator to get branch
     * - match endDateTime > now and creator.branch === userBranch
     * - project to remove questions and internal helper fields
     */
    const pipeline = [
      {
        $addFields: {
          _endTimeParts: {
            $cond: [{ $ifNull: ['$endTime', false] }, { $split: ['$endTime', ':'] }, []]
          }
        }
      },
      {
        $addFields: {
          _endHour: {
            $cond: [{ $gt: [{ $size: '$_endTimeParts' }, 0] }, { $toInt: { $arrayElemAt: ['$_endTimeParts', 0] } }, 0]
          },
          _endMinute: {
            $cond: [{ $gt: [{ $size: '$_endTimeParts' }, 1] }, { $toInt: { $arrayElemAt: ['$_endTimeParts', 1] } }, 0]
          }
        }
      },
      {
        // Build endDateTime in specified timezone so "2025-11-08" + "12:11" becomes 2025-11-08 12:11 (Asia/Kolkata),
        // which Mongo stores as the corresponding UTC instant.
        $addFields: {
          endDateTime: {
            $dateFromParts: {
              year: { $year: { $ifNull: ['$endDate', now] } },
              month: { $month: { $ifNull: ['$endDate', now] } },
              day: { $dayOfMonth: { $ifNull: ['$endDate', now] } },
              hour: { $ifNull: ['$_endHour', 0] },
              minute: { $ifNull: ['$_endMinute', 0] },
              second: 0,
              millisecond: 0,
              timezone: 'Asia/Kolkata' // <-- IMPORTANT: interpret the date+time in Asia/Kolkata
            }
          }
        }
      },
      {
        $lookup: {
          from: 'users',
          localField: 'createdBy',
          foreignField: '_id',
          as: '_creator'
        }
      },
      {
        $unwind: {
          path: '$_creator',
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $match: {
          endDateTime: { $gt: now },
          '_creator.branch': userBranch
        }
      },
      {
        $project: {
          questions: 0,
          _endTimeParts: 0,
          _endHour: 0,
          _endMinute: 0,
          '_creator.passwordHash': 0,
          '_creator.testsGiven': 0,
          '_creator.__v': 0
        }
      },
      { $sort: { startDate: 1, startTime: 1 } }
    ];

    const results = await Test.aggregate(pipeline).allowDiskUse(true);

    // sanitize ObjectIds -> strings and expose creator branch if present
    const tests = results.map((t) => {
      const out = { ...t };
      if (out._id && out._id.toString) out._id = out._id.toString();
      if (out.createdBy && out.createdBy.toString) out.createdBy = out.createdBy.toString();
      if (out._creator) {
        out.createdByBranch = out._creator.branch || null;
        delete out._creator;
      }
      return out;
    });

    return res.json({ success: true, tests });
  } catch (err) {
    console.error('GET /api/tests/active error:', err);
    return res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
});


router.post("/attempt", auth, async (req, res) => {
  try {
    const userId = req.user && req.user.id;
    const { testId } = req.body;

    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }
    if (!testId) {
      return res
        .status(400)
        .json({ success: false, message: "testId is required in body" });
    }

    // validate testId format
    if (!mongoose.Types.ObjectId.isValid(testId)) {
      // allow non-objectId ids if you use custom string ids; remove this check then
      // For safety, if your test ids are ObjectIds, reject invalid
      // If your Test model uses string id, skip validation and comment out next lines.
      // Here we assume ObjectId
      return res
        .status(400)
        .json({ success: false, message: "Invalid testId format" });
    }

    // Fetch user and check testsGiven
    const user = await User.findById(userId).select("testsGiven");
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // testsGiven: [{ test: ObjectId, marks: Number }, ...]
    const already = Array.isArray(user.testsGiven) &&
      user.testsGiven.some((tg) => {
        if (!tg || !tg.test) return false;
        // compare string forms
        return String(tg.test) === String(testId);
      });

    if (already) {
      return res.status(403).json({
        success: false,
        message: "You have already submitted this test"
      });
    }

    // Fetch test (exclude nothing for now, we'll exclude correctAnswer manually)
    const test = await Test.findById(testId).lean();
    if (!test) {
      return res.status(404).json({ success: false, message: "Test not found" });
    }

    // Build questionTime: take qPerTime (assumed seconds per question) fallback 120
    let questionTime = 120; // seconds
    if (test.qPerTime !== undefined && test.qPerTime !== null) {
      const n = Number(test.qPerTime);
      if (!Number.isNaN(n) && isFinite(n)) questionTime = n;
    }

    const rawQuestions = Array.isArray(test.questions) ? test.questions : [];

    // Map questions removing correctAnswer
    const questions = rawQuestions.map((q, idx) => {
      const out = {
        id: q._id ? String(q._id) : `Q${idx + 1}`,
        question: q.question || "",
        options: Array.isArray(q.options) ? q.options : []
        // DO NOT include correctAnswer
      };
      return out;
    });

    const totalDuration = questionTime * questions.length; // seconds

    const testData = {
      testId: String(test._id || test.id || test.testId || ""),
      title: test.title || "",
      totalDuration,       // seconds
      questionTime,        // seconds per question
      questions            // array without correctAnswer
    };

    return res.status(200).json({ success: true, test: testData });
  } catch (err) {
    console.error("POST /api/tests/attempt error:", err);
    return res.status(500).json({ success: false, message: "Server error", error: err.message });
  }
});


router.post('/:testId/submit', auth, async (req, res) => {
  try {
    const { testId } = req.params;
    if (!testId || !mongoose.Types.ObjectId.isValid(testId)) {
      return res.status(400).json({ success: false, message: 'Invalid or missing testId' });
    }

    // Prefer token user; fallback to body.userId if auth middleware didn't provide req.user
    const userId = (req.user && req.user.id) || req.body.userId;
    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(401).json({ success: false, message: 'User not authenticated (token missing) or invalid userId' });
    }

    const { answers } = req.body;
    if (!answers || !Array.isArray(answers)) {
      return res.status(400).json({ success: false, message: 'answers must be an array' });
    }

    // Load user & test
    const [user, test] = await Promise.all([
      User.findById(userId).select('testsGiven totalMarks name email'),
      Test.findById(testId).lean()
    ]);

    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    if (!test) return res.status(404).json({ success: false, message: 'Test not found' });

    // Prevent double submission: check testsGiven for same test id
    const already = (user.testsGiven || []).some(entry => {
      if (!entry || !entry.test) return false;
      try {
        return String(entry.test) === String(test._id);
      } catch (e) {
        return false;
      }
    });
    if (already) {
      return res.status(400).json({ success: false, message: 'You have already submitted this test' });
    }

    // Prepare lookup map for test questions
    // test.questions is expected to be array of objects: { _id, question, options, correctAnswer }
    const qArr = Array.isArray(test.questions) ? test.questions : [];
    const qById = new Map();
    const qByText = new Map();
    qArr.forEach(q => {
      if (q && q._id) qById.set(String(q._id), q);
      if (q && q.question) qByText.set(String(q.question).trim(), q);
    });

    // Grade submission
    let score = 0;
    const perCorrectMarks = 2;

    // We'll also build feedback array (optional) to return per-question correctness (without exposing correctAnswer)
    const feedback = []; // { questionId, matched: true/false, correct: true/false }

    for (let i = 0; i < answers.length; i++) {
      const ans = answers[i];
      if (!ans || typeof ans !== 'object') {
        feedback.push({ index: i, matched: false, correct: false, note: 'Invalid answer object' });
        continue;
      }

      const submittedAnswer = (ans.answer !== undefined && ans.answer !== null) ? String(ans.answer).trim() : '';
      let matchedQuestion = null;

      // Try match by questionId (preferred)
      if (ans.questionId) {
        const qid = String(ans.questionId);
        if (qById.has(qid)) matchedQuestion = qById.get(qid);
      }

      // fallback: match by question text
      if (!matchedQuestion && ans.question) {
        const qtext = String(ans.question).trim();
        if (qByText.has(qtext)) matchedQuestion = qByText.get(qtext);
      }

      // fallback: if only one question present and ids missing, assume index mapping (risky)
      if (!matchedQuestion && qArr.length === answers.length && qArr[i]) {
        matchedQuestion = qArr[i];
      }

      if (!matchedQuestion) {
        feedback.push({ index: i, matched: false, correct: false, note: 'Question not found in test' });
        continue;
      }

      // Compare answer with correctAnswer (both trimmed strings)
      const correctAns = (matchedQuestion.correctAnswer !== undefined && matchedQuestion.correctAnswer !== null)
        ? String(matchedQuestion.correctAnswer).trim()
        : null;

      const isCorrect = correctAns !== null && submittedAnswer !== '' && (submittedAnswer === correctAns);

      if (isCorrect) score += perCorrectMarks;

      feedback.push({
        questionId: String(matchedQuestion._id),
        matched: true,
        correct: isCorrect
      });
    }

    // Now persist: add entry into user.testsGiven and increment totalMarks
    // Use a single atomic update to avoid races
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        $push: { testsGiven: { test: test._id, marks: score } },
        $inc: { totalMarks: score }
      },
      { new: true, select: 'testsGiven totalMarks name email' }
    );

    if (!updatedUser) {
      return res.status(500).json({ success: false, message: 'Failed to update user scoring' });
    }

    // Optional: If you want to track submissions inside Test model, you could push there too.
    // e.g.
    // await Test.findByIdAndUpdate(test._id, { $push: { submissions: { user: userId, marks: score, answers: answers } } });

    return res.status(201).json({
      success: true,
      message: 'Test submitted and graded',
      score,
      perCorrectMarks,
      totalMarks: updatedUser.totalMarks,
      testsGivenEntry: { test: String(test._id), marks: score },
      feedback // does NOT contain correctAnswer values, only whether matched + correctness
    });
  } catch (err) {
    console.error('POST /api/tests/:testId/submit error:', err);
    return res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
});

module.exports = router;
