import Test from '../models/Test.js';
import Student from '../models/Student.js';
import mongoose from 'mongoose';

export const getCurrentActiveTest = async (req, res) => {
    try {
        const now = new Date();
        // find tests whose date is today (range) AND whose startTime/endTime envelope current time
        const startOfDay = new Date(now);
        startOfDay.setUTCHours(0,0,0,0);
        const endOfDay = new Date(startOfDay);
        endOfDay.setUTCDate(endOfDay.getUTCDate()+1);

        // or if timezones are important, adjust accordingly

        const currentHM = now.toTimeString().substr(0,5); // "HH:mm"
        const tests = await Test.find({
        date: { $gte: startOfDay, $lt: endOfDay },
        startTime: { $lte: currentHM },
        endTime: { $gte: currentHM }
        });

        // Alternatively, you might want a more sophisticated query to match exact timings
        if (tests.length === 0) {
            return res.status(404).json({ message: 'No active test in next 4 hours' });
        }

        res.status(200).json(tests);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

export const getTestForStudent = async (req, res) => {
    try {
        const { testId } = req.params;
        const studentEmail = req.user.email;

        const test = await Test.findById(testId);
        if (!test) return res.status(404).json({ message: 'Test not found' });

        const student = await Student.findOne({ email: studentEmail });
        if (!student) return res.status(404).json({ message: 'Student not found' });

        // Check if test has started
        const now = new Date();

        const testDateString = test.date.toISOString().split('T')[0];
        const nowDateString = now.toISOString().split('T')[0];
        if (testDateString !== nowDateString) {
            return res.status(400).json({ message: 'This test is not scheduled for today' });
        }

        const currentTime = now.toTimeString().substr(0, 5);
        if (currentTime < test.startTime) {
            return res.status(400).json({ message: 'Test has not started yet' });
        }
        if (currentTime > test.endTime) {
            return res.status(400).json({ message: 'Test has ended' });
        }

        // Check if student already submitted test
        const existing = student.tests.find(t => t.test.toString() === testId);
        if (existing) {
            return res.status(403).json({ message: 'You have already submitted this test' });
        }

        // Return test details without answers (to prevent cheating)
        const testWithoutAnswers = test.toObject();
        testWithoutAnswers.questions = testWithoutAnswers.questions.map(q => {
            return { id: q.id, question: q.question, options: q.options };
        });

        res.status(200).json(testWithoutAnswers);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

export const submitTest = async (req, res) => {
    try {
        const { testId, answers } = req.body; // answers is array of user's responses
        const userEmail = req.user.email;

        const test = await Test.findById(testId);
        if (!test) return res.status(404).json({ message: 'Test not found' });

        const student = await Student.findOne({ email: userEmail });
        if (!student) return res.status(404).json({ message: 'Student not found' });

        // Check if test already submitted
        const existingTestIndex = student.tests.findIndex(t => t.test.toString() === testId);
        if (existingTestIndex !== -1) {
            return res.status(403).json({ message: 'Test already submitted' });
        }

        // Calculate score by comparing with test questions
        let score = 0;
        test.questions.forEach((question, index) => {
            if (answers[index] && answers[index] === question.response) {
                score++;
            }
        });

        student.tests.push({ test: test._id, score });
        await student.save();

        res.status(200).json({ message: 'Test submitted successfully', score });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

export const getTestResult = async (req, res) => {
    try {
        const { testId } = req.params;
        const userEmail = req.user.email;

        const student = await Student.findOne({ email: userEmail });
        if (!student) return res.status(404).json({ message: 'Student not found' });

        const testResult = student.tests.find(t => t.test.toString() === testId);
        if (!testResult) return res.status(404).json({ message: 'Result not found for this test' });

        res.status(200).json({ testId, score: testResult.score });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

export const getLeaderboard = async (req, res) => {
    try {
        const { testId } = req.params;

        const leaderboard = await Student.aggregate([
            { $unwind: "$tests" },
            { $match: { "tests.test": mongoose.Types.ObjectId(testId) } },
            { $project: { name:1, enrollmentNumber:1, score: "$tests.score" } },
            { $sort: { score: -1 } },
            { $limit: 100 } // optional
        ]);

        res.status(200).json(leaderboard);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

export const getStudentsNotSubmittedTest = async (req, res) => {
    try {
        const { testId } = req.params;

        // Fetch all students
        const students = await Student.find({});

        // Filter students who haven't submitted the test
        const notSubmitted = students.filter(stu => {
            return !stu.tests.some(t => t.test.toString() === testId);
        }).map(s => ({
            name: s.name,
            enrollmentNumber: s.enrollmentNumber,
            email: s.email
        }));

        res.status(200).json(notSubmitted);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};
