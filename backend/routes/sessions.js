const express = require('express');
const Session = require('../models/Session');
const { auth, authorize } = require('../middleware/auth');

const router = express.Router();

router.get('/', auth, async (req, res) => {
  try {
    const sessions = await Session.find().sort({ date: -1 }).populate('createdBy', 'name idNumber');
    res.json(sessions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/upcoming', auth, async (req, res) => {
  try {
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    const sessions = await Session.find({ date: { $gte: now } })
      .sort({ date: 1 })
      .limit(10);
    res.json(sessions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/', auth, authorize('admin', 'super_admin'), async (req, res) => {
  try {
    const { title, type, date, venue, startTime, endTime, description } = req.body;
    if (!title || !date || !venue || !startTime || !endTime) {
      return res.status(400).json({ message: 'Required fields missing' });
    }

    const session = await Session.create({
      title,
      type: type || 'session',
      date,
      venue,
      startTime,
      endTime,
      description: description || '',
      createdBy: req.user._id,
    });

    res.status(201).json(session);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/:id', auth, authorize('admin', 'super_admin'), async (req, res) => {
  try {
    const session = await Session.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!session) return res.status(404).json({ message: 'Session not found' });
    res.json(session);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete('/:id', auth, authorize('super_admin'), async (req, res) => {
  try {
    await Session.findByIdAndDelete(req.params.id);
    res.json({ message: 'Session deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
