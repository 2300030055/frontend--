const express = require('express');
const multer = require('multer');
const csv = require('csv-parser');
const fs = require('fs');
const User = require('../models/User');
const ClubSettings = require('../models/ClubSettings');
const { auth, authorize } = require('../middleware/auth');

const router = express.Router();
const upload = multer({ dest: 'uploads/temp/' });

router.get('/profile', auth, async (req, res) => {
  res.json({ user: req.user.toSafeJSON() });
});

router.put('/profile', auth, async (req, res) => {
  try {
    const { name, branch, residency, year } = req.body;
    if (name) req.user.name = name;
    if (branch) req.user.branch = branch;
    if (residency) req.user.residency = residency;
    if (year) req.user.year = year;
    await req.user.save();
    res.json({ user: req.user.toSafeJSON() });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/', auth, authorize('admin', 'super_admin'), async (req, res) => {
  try {
    const { role, search } = req.query;
    const filter = { isActive: true };
    if (role) filter.role = role;
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { idNumber: { $regex: search, $options: 'i' } },
      ];
    }
    const students = await User.find(filter).select('-password').sort({ name: 1 });
    res.json(students);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/', auth, authorize('admin', 'super_admin'), async (req, res) => {
  try {
    const { idNumber, name, branch, residency, year, role } = req.body;
    if (!idNumber || !name) {
      return res.status(400).json({ message: 'ID number and name are required' });
    }

    const settings = await ClubSettings.findOne();
    const defaultPassword = settings?.defaultStudentPassword || 'webapps@123';
    const userRole = role || 'student';

    if (userRole !== 'student' && req.user.role !== 'super_admin') {
      return res.status(403).json({ message: 'Only super admin can create admin accounts' });
    }

    const existing = await User.findOne({ idNumber: idNumber.toUpperCase().trim() });
    if (existing) {
      return res.status(400).json({ message: 'User with this ID already exists' });
    }

    const user = await User.create({
      idNumber: idNumber.toUpperCase().trim(),
      name,
      branch: branch || '',
      residency: residency || '',
      year: year || '',
      role: userRole,
      password: defaultPassword,
      mustChangePassword: userRole === 'student',
    });

    res.status(201).json(user.toSafeJSON());
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/:id', auth, authorize('admin', 'super_admin'), async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const { name, branch, residency, year, role } = req.body;
    if (name) user.name = name;
    if (branch !== undefined) user.branch = branch;
    if (residency !== undefined) user.residency = residency;
    if (year !== undefined) user.year = year;

    if (role && req.user.role === 'super_admin') {
      user.role = role;
    }

    await user.save();
    res.json(user.toSafeJSON());
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete('/:id', auth, authorize('super_admin'), async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    if (user.role === 'super_admin') {
      return res.status(403).json({ message: 'Cannot delete super admin' });
    }
    user.isActive = false;
    await user.save();
    res.json({ message: 'User deactivated' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/import-csv', auth, authorize('admin', 'super_admin'), upload.single('file'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'CSV file is required' });

    const settings = await ClubSettings.findOne();
    const defaultPassword = settings?.defaultStudentPassword || 'webapps@123';
    const results = [];
    const errors = [];

    await new Promise((resolve, reject) => {
      fs.createReadStream(req.file.path)
        .pipe(csv())
        .on('data', (row) => results.push(row))
        .on('end', resolve)
        .on('error', reject);
    });

    fs.unlinkSync(req.file.path);

    let imported = 0;
    let updated = 0;

    for (const row of results) {
      const idNumber = (row.id_number || row.idNumber || row['ID Number'] || row.id || '').toString().trim().toUpperCase();
      const name = (row.name || row.Name || row['Student Name'] || '').toString().trim();
      const branch = (row.branch || row.Branch || '').toString().trim();
      const residencyRaw = (row.residency || row.Residency || row['Hostler/Day Scholar'] || row.type || '').toString().trim().toLowerCase();
      const year = (row.year || row.Year || '').toString().trim().toUpperCase();

      if (!idNumber || !name) {
        errors.push({ row, reason: 'Missing id_number or name' });
        continue;
      }

      let residency = '';
      if (residencyRaw.includes('host')) residency = 'hostler';
      else if (residencyRaw.includes('day')) residency = 'day_scholar';

      const existing = await User.findOne({ idNumber });
      if (existing) {
        existing.name = name;
        if (branch) existing.branch = branch;
        if (residency) existing.residency = residency;
        if (year) existing.year = year;
        existing.isActive = true;
        await existing.save();
        updated++;
      } else {
        await User.create({
          idNumber,
          name,
          branch,
          residency,
          year,
          password: defaultPassword,
          mustChangePassword: true,
          role: 'student',
        });
        imported++;
      }
    }

    res.json({ imported, updated, errors, total: results.length });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
