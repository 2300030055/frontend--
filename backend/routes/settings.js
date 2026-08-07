const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const ClubSettings = require('../models/ClubSettings');
const User = require('../models/User');
const { auth, authorize } = require('../middleware/auth');

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = 'uploads/logos';
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
  },
});
const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } });

router.get('/', auth, async (req, res) => {
  try {
    let settings = await ClubSettings.findOne();
    if (!settings) settings = await ClubSettings.create({});
    res.json(settings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/', auth, authorize('super_admin'), upload.fields([
  { name: 'clubLogo', maxCount: 1 },
  { name: 'sacLogo', maxCount: 1 },
]), async (req, res) => {
  try {
    let settings = await ClubSettings.findOne();
    if (!settings) settings = new ClubSettings();

    if (req.body.clubName) settings.clubName = req.body.clubName;
    if (req.body.defaultStudentPassword) settings.defaultStudentPassword = req.body.defaultStudentPassword;
    if (req.files?.clubLogo) settings.clubLogo = req.files.clubLogo[0].path.replace(/\\/g, '/');
    if (req.files?.sacLogo) settings.sacLogo = req.files.sacLogo[0].path.replace(/\\/g, '/');

    await settings.save();
    res.json(settings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/admins', auth, authorize('super_admin'), async (req, res) => {
  try {
    const admins = await User.find({
      role: { $in: ['admin', 'super_admin'] },
      isActive: true,
    }).select('-password');
    res.json(admins);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/admins', auth, authorize('super_admin'), async (req, res) => {
  try {
    const { idNumber, name, role, password } = req.body;
    if (!idNumber || !name || !role) {
      return res.status(400).json({ message: 'ID, name, and role required' });
    }

    const existing = await User.findOne({ idNumber: idNumber.toUpperCase().trim() });
    if (existing) return res.status(400).json({ message: 'User already exists' });

    const user = await User.create({
      idNumber: idNumber.toUpperCase().trim(),
      name,
      role,
      password: password || 'Admin@123',
      mustChangePassword: true,
      branch: 'Admin',
    });

    res.status(201).json(user.toSafeJSON());
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete('/admins/:id', auth, authorize('super_admin'), async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    if (user.role === 'super_admin') {
      return res.status(403).json({ message: 'Cannot remove super admin' });
    }
    user.isActive = false;
    await user.save();
    res.json({ message: 'Admin removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
