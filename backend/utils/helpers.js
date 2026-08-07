const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const ClubSettings = require('../models/ClubSettings');

const signToken = (userId) =>
  jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });

const seedSuperAdmin = async () => {
  const existing = await User.findOne({ role: 'super_admin' });
  if (existing) return;

  const idNumber = process.env.SUPER_ADMIN_ID || 'SUPER001';
  const password = process.env.SUPER_ADMIN_PASSWORD || 'SuperAdmin@123';
  const name = process.env.SUPER_ADMIN_NAME || 'Super Admin';

  await User.create({
    idNumber,
    name,
    role: 'super_admin',
    password,
    mustChangePassword: false,
    branch: 'CSE',
    year: 'Y24',
  });

  console.log(`Super admin seeded: ${idNumber}`);
};

const seedClubSettings = async () => {
  const existing = await ClubSettings.findOne();
  if (!existing) {
    await ClubSettings.create({});
  }
};

const generateResetToken = () => {
  const token = crypto.randomBytes(32).toString('hex');
  const hashed = crypto.createHash('sha256').update(token).digest('hex');
  const expires = Date.now() + 3600000; // 1 hour
  return { token, hashed, expires };
};

const ADMIN_EDIT_WINDOW_MS = 15 * 60 * 1000; // 15 minutes
const SUPER_ADMIN_EDIT_WINDOW_MS = 24 * 60 * 60 * 1000; // 24 hours

const canEditAttendance = (attendance, user) => {
  const now = Date.now();
  const markedAt = new Date(attendance.markedAt || attendance.createdAt).getTime();

  if (user.role === 'super_admin') {
    return now - markedAt <= SUPER_ADMIN_EDIT_WINDOW_MS;
  }
  if (user.role === 'admin') {
    return now - markedAt <= ADMIN_EDIT_WINDOW_MS;
  }
  return false;
};

module.exports = {
  signToken,
  seedSuperAdmin,
  seedClubSettings,
  generateResetToken,
  canEditAttendance,
  ADMIN_EDIT_WINDOW_MS,
  SUPER_ADMIN_EDIT_WINDOW_MS,
};
