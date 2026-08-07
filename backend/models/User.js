const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    idNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      uppercase: true,
    },
    name: { type: String, required: true, trim: true },
    branch: { type: String, trim: true, default: '' },
    residency: {
      type: String,
      enum: ['hostler', 'day_scholar', ''],
      default: '',
    },
    year: {
      type: String,
      enum: ['Y23', 'Y24', 'Y25', 'Y26', ''],
      default: '',
    },
    clubName: { type: String, default: 'WebApps Club' },
    role: {
      type: String,
      enum: ['student', 'admin', 'super_admin'],
      default: 'student',
    },
    password: { type: String, required: true },
    mustChangePassword: { type: Boolean, default: true },
    resetPasswordToken: String,
    resetPasswordExpires: Date,
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.comparePassword = async function (candidate) {
  return bcrypt.compare(candidate, this.password);
};

userSchema.methods.toSafeJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  delete obj.resetPasswordToken;
  delete obj.resetPasswordExpires;
  return obj;
};

module.exports = mongoose.model('User', userSchema);
