// models/SignupRequest.js
const mongoose = require('mongoose');

const signupRequestSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    enrollmentNumber: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    branch: { type: String, required: true, trim: true },
    linkedin: { type: String, default: '' },
    leetcode: { type: String, default: '' },
    github: { type: String, default: '' },

    status: {
      type: String,
      enum: ['under_review', 'accepted', 'rejected'],
      default: 'under_review'
    },

    decidedAt: { type: Date },
    decidedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // admin id
    createdUserId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // when accepted
  },
  { timestamps: true }
);

// Helpful indexes
signupRequestSchema.index({ email: 1, status: 1 });
signupRequestSchema.index({ enrollmentNumber: 1, status: 1 });
signupRequestSchema.index({ branch: 1, status: 1 });

module.exports = mongoose.model('SignupRequest', signupRequestSchema);
