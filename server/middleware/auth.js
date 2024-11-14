const jwt = require('jsonwebtoken');
const { AppError } = require('./errorHandler');

const auth = async (req, res, next) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      throw new AppError('Not authorized', 401);
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;
    next();
  } catch (err) {
    next(new AppError('Not authorized', 401));
  }
};

module.exports = auth; 