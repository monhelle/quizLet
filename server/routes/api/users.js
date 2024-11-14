const router = require('express').Router();
const User = require('../../models/User');
const auth = require('../../middleware/auth');
const { successResponse } = require('../../utils/responseHandler');
const { AppError } = require('../../middleware/errorHandler');

router.get('/profile', auth, async (req, res, next) => {
  try {
    const user = await User.findById(req.userId).select('-password');
    if (!user) {
      throw new AppError('User not found', 404);
    }
    return successResponse(res, user);
  } catch (err) {
    next(err);
  }
});

router.put('/profile', auth, async (req, res, next) => {
  try {
    const { name, email } = req.body;
    const user = await User.findById(req.userId);
    
    if (!user) {
      throw new AppError('User not found', 404);
    }

    if (name) user.name = name;
    if (email) user.email = email;
    
    await user.save();
    return successResponse(res, user, 'Profile updated successfully');
  } catch (err) {
    next(err);
  }
});

module.exports = router; 