const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    enrollmentNumber: { type: String, required: true, unique: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    branch: { type: String, required: true, trim: true },

    // Optional handles / URLs
    linkedin: { type: String, default: '' },
    leetcode: { type: String, default: '' },
    github: { type: String, default: '' },

    // Permissions / role
    role: { type: String, enum: ['student', 'admin'], default: 'student' },

    isVerified: { 
      type: Boolean, 
      default: false 
    },
    verificationToken: {  
      type: String 
    },

    // Tests given by the user
    testsGiven: [
      {
        test: { type: mongoose.Schema.Types.ObjectId, ref: 'Test' },
        marks: { type: Number, default: 0 },
      },
    ],

    totalMarks: { type: Number, default: 0 },

    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

// Create index on enrollmentNumber (unique)
userSchema.index({ enrollmentNumber: 1 }, { unique: true });
userSchema.index({ email: 1 }, { unique: true });

userSchema.index({ email: 1, isVerified: 1 });
userSchema.index({ verificationToken: 1 });


module.exports = mongoose.model('User', userSchema);
