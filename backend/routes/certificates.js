const express = require('express');
const multer = require('multer');
const csv = require('csv-parser');
const fs = require('fs');
const path = require('path');
const Certificate = require('../models/Certificate');
const User = require('../models/User');
const { auth, authorize } = require('../middleware/auth');
const { generateCertificatePDF } = require('../utils/certificateGenerator');

const router = express.Router();
const upload = multer({ dest: 'uploads/temp/' });

router.get('/my', auth, async (req, res) => {
  try {
    const certificates = await Certificate.find({ student: req.user._id }).sort({ issuedDate: -1 });
    res.json(certificates);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/download/:id', auth, async (req, res) => {
  try {
    const cert = await Certificate.findById(req.params.id);
    if (!cert) return res.status(404).json({ message: 'Certificate not found' });

    if (cert.student.toString() !== req.user._id.toString() && !['admin', 'super_admin'].includes(req.user.role)) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const filePath = path.join(__dirname, '..', cert.filePath);
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ message: 'Certificate file not found' });
    }

    res.download(filePath);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/generate', auth, authorize('admin', 'super_admin'), async (req, res) => {
  try {
    const { studentId, eventName, type, eventType } = req.body;
    const student = await User.findById(studentId);
    if (!student) return res.status(404).json({ message: 'Student not found' });

    const filePath = await generateCertificatePDF({
      studentName: student.name,
      idNumber: student.idNumber,
      eventName,
      type: type || 'participation',
      eventType: eventType || 'session',
      issuedDate: new Date(),
    });

    const cert = await Certificate.create({
      student: student._id,
      eventName,
      type: type || 'participation',
      eventType: eventType || 'session',
      filePath,
      issuedBy: req.user._id,
    });

    res.status(201).json(cert);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/bulk-import', auth, authorize('admin', 'super_admin'), upload.single('file'), async (req, res) => {
  try {
    const { eventName, type, eventType } = req.body;
    if (!req.file || !eventName) {
      return res.status(400).json({ message: 'CSV file and event name required' });
    }

    const results = [];
    await new Promise((resolve, reject) => {
      fs.createReadStream(req.file.path)
        .pipe(csv())
        .on('data', (row) => results.push(row))
        .on('end', resolve)
        .on('error', reject);
    });
    fs.unlinkSync(req.file.path);

    const generated = [];
    const errors = [];

    for (const row of results) {
      const idNumber = (row.id_number || row.idNumber || row['ID Number'] || row.id || '').toString().trim().toUpperCase();
      const name = (row.name || row.Name || '').toString().trim();

      const student = await User.findOne({ idNumber });
      if (!student) {
        errors.push({ idNumber, name, reason: 'Student not found' });
        continue;
      }

      const filePath = await generateCertificatePDF({
        studentName: student.name,
        idNumber: student.idNumber,
        eventName,
        type: type || 'participation',
        eventType: eventType || 'session',
        issuedDate: new Date(),
      });

      const cert = await Certificate.create({
        student: student._id,
        eventName,
        type: type || 'participation',
        eventType: eventType || 'session',
        filePath,
        issuedBy: req.user._id,
      });
      generated.push(cert);
    }

    res.json({ generated: generated.length, errors });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/all', auth, authorize('admin', 'super_admin'), async (req, res) => {
  try {
    const certs = await Certificate.find()
      .populate('student', 'idNumber name')
      .sort({ issuedDate: -1 });
    res.json(certs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
