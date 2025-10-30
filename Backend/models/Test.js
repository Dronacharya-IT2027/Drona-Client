import mongoose from 'mongoose';

const questionSchema = new mongoose.Schema({
    id: String,
    question: String,
    options: [String],
    response: String
});

const syllabusSchema = new mongoose.Schema({
    topic: String,
    description: String
});

const testSchema = new mongoose.Schema({
    title: { type: String, required: true },
    date: { type: Date, required: true },
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
    duration: { type: Number, required: true },
    totalMarks: { type: Number, required: true },
    questions: [questionSchema],
    syllabus: [syllabusSchema]
});

export default mongoose.model('Test', testSchema);
