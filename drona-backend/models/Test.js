// models/Test.js
const mongoose = require('mongoose');

const QuestionSchema = new mongoose.Schema(
  {
    question: { type: String, trim: true },           // question text
    options: { type: [String], default: [] },         // array of option strings
    correctAnswer: { type: String, trim: true }       // correct answer (could be option text or index string)
  },
  { _id: true } // keep _id for each question so you can reference/edit individual questions later
);

const TestSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },

    // Dates and times (required as per your instruction)
    startDate: { type: Date, required: true },   // store a Date (you may supply date-only or full Date)
    startTime: { type: String, required: true }, // preferred format: "HH:mm" (but not enforced)
    endDate: { type: Date, required: true },
    endTime: { type: String, required: true },

    // Optional numeric field: questions per time (not mandatory)
    qPerTime: { type: Number, default: null },

    // Syllabus tags (required) - array of strings
    syllabusTags: { type: [String], required: true, default: [] },

    // Link to answers (required)
    answerDriveLink: { type: String, required: true, trim: true },

    // Questions array (each is an object with question, options array, correctAnswer)
    questions: { type: [QuestionSchema], default: [] },

    // meta
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null }, // optional: creator user
    isPublished: { type: Boolean, default: false } // optional flag
  },
  { timestamps: true }
);

// Indexes (optional but useful)
TestSchema.index({ title: 1 });
TestSchema.index({ startDate: 1, endDate: 1 });

module.exports = mongoose.model('Test', TestSchema);
