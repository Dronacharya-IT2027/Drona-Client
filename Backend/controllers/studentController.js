import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import Test from '../models/Test.js';
import Student from '../models/Student.js';

export const submitTest = async (req, res) => {
    try {
        const { testId, answers } = req.body; // answers is array of user's responses
        const userEmail = req.user.email;

        const test = await Test.findById(testId);
        if (!test) return res.status(404).json({ message: 'Test not found' });

        // Calculate score by comparing with test questions
        let score = 0;
        test.questions.forEach((question, index) => {
            if (answers[index] && answers[index] === question.response) {
                score++;
            }
        });

        // Update student's test score or add test result
        const student = await Student.findOne({ email: userEmail });
        if (!student) return res.status(404).json({ message: 'Student not found' });

        // Check if test already submitted
        const existingTestIndex = student.tests.findIndex(t => t.test.toString() === testId);
        if (existingTestIndex !== -1) {
            student.tests[existingTestIndex].score = score; // update score
        } else {
            student.tests.push({ test: test._id, score });
        }

        await student.save();

        res.status(200).json({ message: 'Test submitted successfully', score });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

// Student login to get JWT token
export const loginStudent = async (req, res) => {
    try {
        const { email, password } = req.body;

        const student = await Student.findOne({ email });
        if (!student) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const validPassword = await bcrypt.compare(password, student.password);
        if (!validPassword) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign({ email: student.email, userType: 'student' }, process.env.JWT_SECRET, { expiresIn: '1d' });

        res.status(200).json({ token });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

// Fetch student details using JWT
export const getStudentDetails = async (req, res) => {
    try {
        const student = await Student.findOne({ email: req.user.email }).select('-password').populate('tests.test', 'title date');
        if (!student) return res.status(404).json({ message: 'Student not found' });

        res.status(200).json(student);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

// Fetch specific test with student's score
export const getTestWithScore = async (req, res) => {
    try {
        const { testId } = req.params;
        const studentEmail = req.user.email;

        const student = await Student.findOne({ email: studentEmail }).populate('tests.test');
        if (!student) return res.status(404).json({ message: 'Student not found' });

        const testScoreObj = student.tests.find(t => t.test._id.toString() === testId);
        if (!testScoreObj) return res.status(404).json({ message: 'Test result not found' });

        const test = testScoreObj.test.toObject();
        // Remove answers from questions so student does not get answer key
        test.questions = test.questions.map(q => ({
            id: q.id,
            question: q.question,
            options: q.options
        }));

        res.status(200).json({ test, score: testScoreObj.score });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

// Fetch all test scores for the logged-in student
export const getAllTestScores = async (req, res) => {
    try {
        const student = await Student.findOne({ email: req.user.email }).populate('tests.test', 'title date');
        if (!student) return res.status(404).json({ message: 'Student not found' });

        const results = student.tests.map(t => ({
            testId: t.test._id,
            title: t.test.title,
            date: t.test.date,
            score: t.score
        }));

        res.status(200).json(results);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};
