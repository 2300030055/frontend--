const mongoose = require('mongoose');

const teamMemberSchema = new mongoose.Schema(
  {
    idNumber: { type: String, required: true },
    name: { type: String, required: true },
    branch: { type: String, default: '' },
  },
  { _id: false }
);

const projectSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    projectTitle: { type: String, default: '' },
    problemStatement: { type: String, default: '' },
    teamMembers: [teamMemberSchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model('Project', projectSchema);
