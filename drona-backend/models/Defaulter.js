// models/Defaulter.js
const mongoose = require('mongoose');
const { Schema } = mongoose;

/**
 * Defaulter model
 * - test: ObjectId ref to Test (one document per test)
 * - defaulters: array of ObjectId refs to User (students who defaulted)
 * - recordedBy: optional admin (User) who created/updated this record
 * - branch: optional string for branch snapshot (convenience)
 * - notes: optional text for reasons or remarks
 *
 * timestamps: createdAt, updatedAt
 */
const DefaulterSchema = new Schema(
  {
    test: {
      type: Schema.Types.ObjectId,
      ref: 'Test',
      required: true,
      index: true,
      unique: true // ensure one defaulter document per test
    },
    defaulters: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
      }
    ],
    branch: {
      type: String,
      required: false,
      trim: true
    },
    meta: {
      totalDefaulters: { type: Number, default: 0 },
    }
  },
  {
    timestamps: true
  }
);

// keep totalDefaulters synced when saving (optional helper)
DefaulterSchema.pre('save', function (next) {
  if (Array.isArray(this.defaulters)) {
    this.meta = this.meta || {};
    this.meta.totalDefaulters = this.defaulters.length;
  }
  next();
});

// Export model
module.exports = mongoose.models.Defaulter || mongoose.model('Defaulter', DefaulterSchema);
