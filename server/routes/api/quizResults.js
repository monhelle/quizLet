const router = require('express').Router();
const jwt = require('jsonwebtoken');
const QuizResult = require('../../models/QuizResult');
const auth = require('../../middleware/auth');
const { successResponse } = require('../../utils/responseHandler');
const { AppError } = require('../../middleware/errorHandler');
const Lesson = require('../../models/Lesson');

// Submit quiz results
router.post('/:lessonId', async (req, res, next) => {
  try {
    const { lessonId } = req.params;
    const { answers, score, correctCount, totalQuestions } = req.body;

    // Generate anonymous token
    const anonymousToken = jwt.sign(
      { timestamp: Date.now() },
      process.env.JWT_SECRET,
      { expiresIn: '30d' }
    );

    const quizResult = await QuizResult.create({
      lessonId,
      answers,
      score,
      correctCount,
      totalQuestions,
      anonymousToken
    });

    return successResponse(res, {
      resultId: quizResult._id,
      anonymousToken
    }, 'Quiz results saved successfully', 201);
  } catch (err) {
    next(err);
  }
});

// Get quiz results
router.get('/:resultId', async (req, res, next) => {
  try {
    const { resultId } = req.params;
    
    const result = await QuizResult.findById(resultId)
      .populate('lessonId', 'title');

    if (!result) {
      throw new AppError('Quiz result not found', 404);
    }

    return successResponse(res, result);
  } catch (err) {
    next(err);
  }
});

// Get all results for a specific anonymous token
router.get('/user/:token', async (req, res, next) => {
  try {
    const { token } = req.params;
    
    const results = await QuizResult.find({ anonymousToken: token })
      .populate('lessonId', 'title')
      .sort({ createdAt: -1 });

    return successResponse(res, results);
  } catch (err) {
    next(err);
  }
});

// Get statistics for all quizzes (admin only)
router.get('/admin/stats', auth, async (req, res, next) => {
  try {
    // First get all lessons created by this user
    const userLessons = await Lesson.find({ creator: req.userId }).select('_id title');
    const lessonIds = userLessons.map(lesson => lesson._id);

    const stats = await QuizResult.aggregate([
      {
        // Only get results for user's lessons
        $match: {
          lessonId: { $in: lessonIds }
        }
      },
      {
        $group: {
          _id: '$lessonId',
          totalAttempts: { $sum: 1 },
          averageScore: { $avg: '$score' },
          highestScore: { $max: '$score' },
          lowestScore: { $min: '$score' }
        }
      },
      {
        $lookup: {
          from: 'lessons',
          localField: '_id',
          foreignField: '_id',
          as: 'lesson'
        }
      },
      {
        $unwind: '$lesson'
      },
      {
        $project: {
          lessonTitle: '$lesson.title',
          totalAttempts: 1,
          averageScore: 1,
          highestScore: 1,
          lowestScore: 1
        }
      }
    ]);

    return successResponse(res, stats);
  } catch (err) {
    next(err);
  }
});

// Get detailed results for a specific lesson (admin only)
router.get('/admin/lesson/:lessonId', auth, async (req, res, next) => {
  try {
    const { lessonId } = req.params;
    
    // First verify that this lesson belongs to the user
    const lesson = await Lesson.findOne({
      _id: lessonId,
      creator: req.userId
    });

    if (!lesson) {
      throw new AppError('Lesson not found or unauthorized', 404);
    }

    const results = await QuizResult.find({ lessonId })
      .sort({ createdAt: -1 })
      .limit(100);

    return successResponse(res, results);
  } catch (err) {
    next(err);
  }
});

module.exports = router; 