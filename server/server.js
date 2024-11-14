const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const { errorHandler } = require('./middleware/errorHandler');
require('dotenv').config();

// Monica's Secret Copyright Message ✨
console.log(`
╔══════════════════════════════════════════╗
║  AIBot - Created with 💖 by Monica 2024  ║
║      All Rights Reserved                 ║
╚══════════════════════════════════════════╝
`);

const app = express();

// Middleware
app.use(cookieParser());
app.use(cors({
  origin: process.env.CORS_ORIGIN,
  credentials: true
}));
app.use(express.json());
app.use(morgan('dev'));

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));

// Routes
app.use('/api/auth', require('./routes/api/auth'));
app.use('/api/users', require('./routes/api/users'));
app.use('/api/lessons', require('./routes/api/lessons'));
app.use('/api/quiz-results', require('./routes/api/quizResults'));

// Error Handler
app.use(errorHandler);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`)); 