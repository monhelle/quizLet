const router = require('express').Router();
const Lesson = require('../../models/Lesson');
const auth = require('../../middleware/auth');
const { successResponse, errorResponse } = require('../../utils/responseHandler');
const { AppError } = require('../../middleware/errorHandler');
const { generateQuiz } = require('../../utils/openai');

// Create a new lesson
router.post('/', auth, async (req, res, next) => {
  try {
    const { title, content, questionCount, quizTypes } = req.body;

    if (!title || !content || !questionCount || !quizTypes) {
      throw new AppError('Please provide all required fields', 400);
    }

    // Generate quiz using OpenAI
    const quiz = await generateQuiz(content, questionCount, quizTypes);

    const lesson = await Lesson.create({
      title,
      content,
      questionCount,
      quizTypes,
      quiz,
      creator: req.userId
    });

    return successResponse(res, lesson, 'Lesson created successfully', 201);
  } catch (err) {
    next(err);
  }
});

// Get all lessons for the current user
router.get('/', auth, async (req, res, next) => {
  try {
    const lessons = await Lesson.find({ creator: req.userId })
      .sort({ createdAt: -1 });
    return successResponse(res, lessons);
  } catch (err) {
    next(err);
  }
});

// Get a specific lesson
router.get('/:id', async (req, res, next) => {
  try {
    const lesson = await Lesson.findById(req.params.id);
    
    if (!lesson) {
      throw new AppError('Lesson not found', 404);
    }

    return successResponse(res, lesson);
  } catch (err) {
    next(err);
  }
});

// Update a lesson
router.put('/:id', auth, async (req, res, next) => {
  try {
    const { title, content, questionCount, quizTypes } = req.body;
    const lesson = await Lesson.findOne({
      _id: req.params.id,
      creator: req.userId
    });

    if (!lesson) {
      throw new AppError('Lesson not found', 404);
    }

    lesson.title = title;
    lesson.content = content;
    lesson.questionCount = questionCount;
    lesson.quizTypes = quizTypes;

    await lesson.save();
    return successResponse(res, lesson, 'Lesson updated successfully');
  } catch (err) {
    next(err);
  }
});

// Delete a lesson
router.delete('/:id', auth, async (req, res, next) => {
  try {
    const lesson = await Lesson.findOneAndDelete({
      _id: req.params.id,
      creator: req.userId
    });

    if (!lesson) {
      throw new AppError('Lesson not found', 404);
    }

    return successResponse(res, null, 'Lesson deleted successfully');
  } catch (err) {
    next(err);
  }
});

module.exports = router; 