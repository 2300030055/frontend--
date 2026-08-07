const express = require('express');
const Project = require('../models/Project');
const { auth } = require('../middleware/auth');

const router = express.Router();

router.get('/my', auth, async (req, res) => {
  try {
    let project = await Project.findOne({ student: req.user._id });
    if (!project) {
      project = await Project.create({ student: req.user._id });
    }
    res.json(project);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/my', auth, async (req, res) => {
  try {
    const { projectTitle, problemStatement, teamMembers } = req.body;
    let project = await Project.findOne({ student: req.user._id });

    if (!project) {
      project = new Project({ student: req.user._id });
    }

    if (projectTitle !== undefined) project.projectTitle = projectTitle;
    if (problemStatement !== undefined) project.problemStatement = problemStatement;
    if (teamMembers !== undefined) project.teamMembers = teamMembers;

    await project.save();
    res.json(project);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
