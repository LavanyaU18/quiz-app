const mongoose = require('mongoose');

const attemptSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  score: { type: Number, required: true },
  totalQuestions: { type: Number, required: true },
  attemptNumber: { type: Number, default: 1 },
}, { timestamps: true });

module.exports = mongoose.model('Attempt', attemptSchema);
