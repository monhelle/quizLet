const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  type: String,
  question: String,
  options: [String],
  correctAnswer: String,
  explanation: String
});

const lessonSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  questionCount: {
    type: Number,
    required: true,
    min: 1,
    max: 20
  },
  quizTypes: [{
    type: String,
    enum: ['multiple-choice', 'true-false', 'short-answer', 'essay']
  }],
  quiz: [questionSchema],
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, { timestamps: true });

// Virtual for lesson's URL
lessonSchema.virtual('url').get(function() {
  return `/lessons/${this._id}`;
});

// Include virtuals when converting document to JSON
lessonSchema.set('toJSON', {
  virtuals: true,
  transform: function(doc, ret) {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
    return ret;
  }
});

module.exports = mongoose.model('Lesson', lessonSchema); 