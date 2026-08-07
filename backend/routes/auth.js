const express = require('express');
const crypto = require('crypto');
const User = require('../models/User');
const { auth } = require('../middleware/auth');
const { signToken, generateResetToken } = require('../utils/helpers');
const { sendPasswordResetEmail } = require('../utils/email');

const router = express.Router();

router.post('/login', async (req, res) => {
  try {
    const { idNumber, password } = req.body;
    if (!idNumber || !password) {
      return res.status(400).json({ message: 'ID number and password are required' });
    }

    const user = await User.findOne({ idNumber: idNumber.toUpperCase().trim() });
    if (!user || !user.isActive) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const valid = await user.comparePassword(password);
    if (!valid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = signToken(user._id);
    res.json({
      token,
      user: user.toSafeJSON(),
      mustChangePassword: user.mustChangePassword,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/me', auth, async (req, res) => {
  res.json({ user: req.user.toSafeJSON() });
});

router.post('/change-password', auth, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!newPassword || newPassword.length < 6) {
      return res.status(400).json({ message: 'New password must be at least 6 characters' });
    }

    if (req.user.mustChangePassword) {
      req.user.password = newPassword;
      req.user.mustChangePassword = false;
      await req.user.save();
      return res.json({ message: 'Password updated successfully' });
    }

    if (!currentPassword) {
      return res.status(400).json({ message: 'Current password is required' });
    }

    const valid = await req.user.comparePassword(currentPassword);
    if (!valid) {
      return res.status(401).json({ message: 'Current password is incorrect' });
    }

    req.user.password = newPassword;
    await req.user.save();
    res.json({ message: 'Password updated successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/forgot-password', async (req, res) => {
  try {
    const { idNumber, email } = req.body;
    const user = await User.findOne({ idNumber: idNumber?.toUpperCase()?.trim() });

    if (!user) {
      return res.json({ message: 'If the account exists, a reset link has been sent.' });
    }

    const { token, hashed, expires } = generateResetToken();
    user.resetPasswordToken = hashed;
    user.resetPasswordExpires = new Date(expires);
    await user.save();

    const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${token}&id=${user.idNumber}`;
    const result = await sendPasswordResetEmail(email || `${user.idNumber}@kluniversity.in`, user.name, resetUrl);

    res.json({
      message: 'If the account exists, a reset link has been sent.',
      ...(result?.dev ? { devResetUrl: resetUrl } : {}),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/reset-password', async (req, res) => {
  try {
    const { token, idNumber, newPassword } = req.body;
    if (!token || !idNumber || !newPassword) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const hashed = crypto.createHash('sha256').update(token).digest('hex');
    const user = await User.findOne({
      idNumber: idNumber.toUpperCase().trim(),
      resetPasswordToken: hashed,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired reset token' });
    }

    user.password = newPassword;
    user.mustChangePassword = false;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    const jwtToken = signToken(user._id);
    res.json({
      message: 'Password reset successful',
      token: jwtToken,
      user: user.toSafeJSON(),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
