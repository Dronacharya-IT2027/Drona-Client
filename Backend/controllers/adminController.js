import bcrypt from 'bcryptjs';
import Student from '../models/Student.js';
import Admin from '../models/Admin.js';
import Test from '../models/Test.js';
import User from '../models/User.js';

export const createStudent = async (req, res) => {
    try {
        const { name, enrollmentNumber, email, password, github, leetcode } = req.body;

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create student record
        const student = new Student({
            name, enrollmentNumber, email, password: hashedPassword, github, leetcode, tests: []
        });
        await student.save();

        // Create user record for authentication
        const userExist = await User.findOne({ email });
        if(userExist) return res.status(400).json({ message: 'User email already exists' });
        const user = new User({ email, password: hashedPassword, userType: 'student' });
        await user.save();

        // Push student to groupMembers array of admin
        const admin = await Admin.findOne({ email: req.user.email });
        if(!admin) return res.status(404).json({ message: 'Admin not found' });

        admin.groupMembers.push(student._id);
        await admin.save();

        res.status(201).json({ message: 'Student created successfully', student });
    } catch(error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

export const createTest = async (req, res) => {
    try {
        const { title, date, startTime, endTime, duration, totalMarks, questions, syllabus } = req.body;

        const test = new Test({ title, date, startTime, endTime, duration, totalMarks, questions, syllabus });
        await test.save();

        res.status(201).json({ message: 'Test created successfully', test });
    } catch(error) {
        res.status(500).json({ message: 'Server error', error });
    }
};
