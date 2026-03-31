const express = require('express');
const router = express.Router();
const Question = require('../models/Question');
const Attempt = require('../models/Attempt');
const { protect, admin } = require('../middleware/auth');

// Get all questions
router.get('/questions', async (req, res) => {
  try {
    // If user, maybe random 10? If admin, all. We'll do simple for quick project: just return all
    const questions = await Question.find({});
    res.json(questions);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Admin: Add new question
router.post('/questions', protect, admin, async (req, res) => {
  try {
    const { text, options, difficulty, category } = req.body;
    const question = new Question({ text, options, difficulty, category });
    await question.save();
    res.status(201).json(question);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Admin: Delete question
router.delete('/questions/:id', protect, admin, async (req, res) => {
  try {
    await Question.findByIdAndDelete(req.params.id);
    res.json({ message: 'Question removed' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// User: Submit Attempt
router.post('/attempts', protect, async (req, res) => {
  try {
    const { score, totalQuestions } = req.body;
    const pastAttempts = await Attempt.countDocuments({ userId: req.user.id });
    const attempt = new Attempt({ userId: req.user.id, score, totalQuestions, attemptNumber: pastAttempts + 1 });
    await attempt.save();
    res.status(201).json(attempt);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get Leaderboard
router.get('/leaderboard', async (req, res) => {
  try {
    // Aggregation to find highest scores
    const topAttempts = await Attempt.find().populate('userId', 'name').sort({ score: -1 }).limit(10);
    res.json(topAttempts);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Admin: Delete Attempt
router.delete('/attempts/:id', protect, admin, async (req, res) => {
  try {
    await Attempt.findByIdAndDelete(req.params.id);
    res.json({ message: 'Attempt removed' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
