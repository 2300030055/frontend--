const mongoose = require('mongoose');

const certificateSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    eventName: { type: String, required: true, trim: true },
    type: {
      type: String,
      enum: ['participation', 'appreciation'],
      required: true,
    },
    eventType: {
      type: String,
      enum: ['program', 'workshop', 'hackathon', 'session'],
      default: 'session',
    },
    issuedDate: { type: Date, default: Date.now },
    filePath: { type: String, default: '' },
    issuedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Certificate', certificateSchema);
