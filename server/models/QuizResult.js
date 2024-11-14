const mongoose = require('mongoose');

const answerSchema = new mongoose.Schema({
  question: String,
  userAnswer: String,
  correctAnswer: String,
  isCorrect: Boolean,
  explanation: String
});

const quizResultSchema = new mongoose.Schema({
  lessonId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Lesson',
    required: true
  },
  answers: [answerSchema],
  score: {
    type: Number,
    required: true
  },
  correctCount: {
    type: Number,
    required: true
  },
  totalQuestions: {
    type: Number,
    required: true
  },
  anonymousToken: {
    type: String,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

module.exports = mongoose.model('QuizResult', quizResultSchema); 