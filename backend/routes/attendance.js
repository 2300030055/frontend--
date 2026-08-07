const express = require('express');
const Attendance = require('../models/Attendance');
const Session = require('../models/Session');
const User = require('../models/User');
const { auth, authorize } = require('../middleware/auth');
const { canEditAttendance } = require('../utils/helpers');

const router = express.Router();

router.get('/my-stats', auth, async (req, res) => {
  try {
    const records = await Attendance.find({ student: req.user._id }).populate('session');
    const present = records.filter((r) => r.status === 'present' || r.status === 'late').length;
    const absent = records.filter((r) => r.status === 'absent').length;
    const absentDates = records
      .filter((r) => r.status === 'absent')
      .map((r) => ({
        date: r.session?.date,
        sessionTitle: r.session?.title,
        status: r.status,
      }));

    res.json({ present, absent, total: records.length, absentDates, records });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/session/:sessionId', auth, authorize('admin', 'super_admin'), async (req, res) => {
  try {
    const attendance = await Attendance.find({ session: req.params.sessionId })
      .populate('student', 'idNumber name branch')
      .populate('markedBy', 'name');
    res.json(attendance);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/mark', auth, authorize('admin', 'super_admin'), async (req, res) => {
  try {
    const { sessionId, records } = req.body;
    if (!sessionId || !records?.length) {
      return res.status(400).json({ message: 'Session and records required' });
    }

    const session = await Session.findById(sessionId);
    if (!session) return res.status(404).json({ message: 'Session not found' });

    const results = [];
    for (const record of records) {
      const attendance = await Attendance.findOneAndUpdate(
        { session: sessionId, student: record.studentId },
        {
          status: record.status,
          markedBy: req.user._id,
          markedAt: new Date(),
          lastEditedAt: new Date(),
          lastEditedBy: req.user._id,
        },
        { upsert: true, new: true }
      );
      results.push(attendance);
    }

    res.json({ message: 'Attendance marked', count: results.length });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/:id', auth, authorize('admin', 'super_admin'), async (req, res) => {
  try {
    const attendance = await Attendance.findById(req.params.id);
    if (!attendance) return res.status(404).json({ message: 'Record not found' });

    if (!canEditAttendance(attendance, req.user)) {
      const window = req.user.role === 'super_admin' ? '24 hours' : '15 minutes';
      return res.status(403).json({ message: `Edit window expired (${window} limit)` });
    }

    attendance.status = req.body.status;
    attendance.lastEditedAt = new Date();
    attendance.lastEditedBy = req.user._id;
    await attendance.save();

    res.json(attendance);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/students-for-session/:sessionId', auth, authorize('admin', 'super_admin'), async (req, res) => {
  try {
    const students = await User.find({ role: 'student', isActive: true }).select('idNumber name branch');
    const existing = await Attendance.find({ session: req.params.sessionId });
    const attendanceMap = {};
    existing.forEach((a) => {
      attendanceMap[a.student.toString()] = a.status;
    });

    const result = students.map((s) => ({
      ...s.toObject(),
      attendanceStatus: attendanceMap[s._id.toString()] || 'absent',
    }));

    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
