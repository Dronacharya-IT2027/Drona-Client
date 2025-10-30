import mongoose from 'mongoose';
import Test from './Test.js';

const testScoreSchema = new mongoose.Schema({
    test: { type: mongoose.Schema.Types.ObjectId, ref: 'Test', required: true },
    score: { type: Number, required: true }
});

const studentSchema = new mongoose.Schema({
    name: { type: String, required: true },
    enrollmentNumber: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    github: { type: String },
    leetcode: { type: String },
    tests: [testScoreSchema]    
});

export default mongoose.model('Student', studentSchema);
