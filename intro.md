# Complete Node.js and React.js Project Setup Guide

## Table of Contents
1. [Initial Setup](#initial-setup)
2. [Project Structure](#project-structure)
3. [Environment Configuration](#environment-configuration)
4. [Backend Implementation](#backend-implementation)
5. [Frontend Implementation](#frontend-implementation)
6. [Error Handling & Messages](#error-handling--messages)
7. [Components Examples](#components-examples)
8. [Running the Application](#running-the-application)

## Initial Setup

```bash
# Create React App
npx create-react-app aibot
cd aibot
npm install axios react-router-dom jwt-decode

# Create server directory and initialize
cd ..
mkdir server
cd server
npm init -y

# Install backend dependencies (in server folder)
npm install express mongoose dotenv cors jsonwebtoken bcryptjs axios morgan nodemon cookie-parser
npm install concurrently --save-dev



cd ../aibot

```

## Project Structure

### Root Structure
```
aibot/
├── node_modules/
├── public/
├── server/           # Backend code
├── src/             # Frontend code
├── .env             # Frontend environment variables
├── .gitignore
└── package.json
```

### Frontend Structure (src/)
```
src/
├── components/      # Reusable UI components
│   ├── Button/
│   │   ├── Button.js
│   │   └── Button.css
│   ├── Input/
│   │   ├── Input.js
│   │   └── Input.css
│   ├── Form/
│   │   ├── Form.js
│   │   └── Form.css
│   └── MessageToast/
│       ├── MessageToast.js
│       └── MessageToast.css
├── contexts/        # React contexts
│   ├── AuthContext.js
│   └── MessageContext.js
├── hooks/          # Custom hooks
│   └── useApi.js
├── pages/          # Route components
│   ├── Login/
│   │   ├── Login.js
│   │   └── Login.css
│   └── Dashboard/
│       ├── Dashboard.js
│       └── Dashboard.css
├── services/       # API calls
│   └── api.js
└── utils/          # Helper functions
    └── helpers.js
```

### Backend Structure (server/)
```
server/
├── config/
│   └── db.js
├── middleware/
│   ├── auth.js
│   └── errorHandler.js
├── models/
│   └── User.js
├── routes/
│   └── api/
│       ├── auth.js
│       └── users.js
├── utils/
│   └── responseHandler.js
├── .env            # Backend environment variables
└── server.js
```

## Environment Configuration

### Frontend .env (in aibot folder)
```env
REACT_APP_API_URL=http://localhost:4000/api
REACT_APP_NAME=MyApp
```

### Backend .env (in server folder)
```env
PORT=4000
MONGODB_URI=mongodb://localhost:27017/myapp
JWT_SECRET=your_jwt_secret
NODE_ENV=development
COOKIE_SECRET=your_cookie_secret
```

## Backend Implementation

### Server Setup (server/server.js)
```javascript
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const { errorHandler } = require('./middleware/errorHandler');
require('dotenv').config();

const app = express();

// Middleware
app.use(cookieParser());
app.use(cors({
  origin: 'http://localhost:3000',
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

// Error Handler
app.use(errorHandler);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
```

### Error Handler (server/middleware/errorHandler.js)
```javascript
class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
  }
}

const errorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
      stack: err.stack,
      error: err
    });
  } else {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message
    });
  }
};

module.exports = { AppError, errorHandler };
```

### Response Handler (server/utils/responseHandler.js)
```javascript
const successResponse = (res, data = null, message = 'Success', statusCode = 200) => {
  return res.status(statusCode).json({
    status: 'success',
    message,
    data
  });
};

const errorResponse = (res, message = 'Error occurred', statusCode = 400) => {
  return res.status(statusCode).json({
    status: 'error',
    message
  });
};

module.exports = { successResponse, errorResponse };
```

### Auth Routes (server/routes/api/auth.js)
```javascript
const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../../models/User');
const { AppError } = require('../../middleware/errorHandler');
const { successResponse, errorResponse } = require('../../utils/responseHandler');

router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      throw new AppError('Please provide email and password', 400);
    }
    
    const user = await User.findOne({ email });
    if (!user) {
      throw new AppError('Invalid credentials', 401);
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new AppError('Invalid credentials', 401);
    }

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 24 * 60 * 60 * 1000
    });

    return successResponse(res, { userId: user._id }, 'Login successful', 200);
  } catch (err) {
    next(err);
  }
});

router.post('/logout', (req, res) => {
  res.cookie('token', '', {
    httpOnly: true,
    expires: new Date(0)
  });
  return successResponse(res, null, 'Logout successful');
});

module.exports = router;
```

### User Model (server/models/User.js)
```javascript
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  }
}, { timestamps: true });

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

module.exports = mongoose.model('User', userSchema);
```

## Frontend Implementation

### API Service (src/services/api.js)
```javascript
import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  withCredentials: true
});

// API endpoints
export const login = (data) => api.post('/auth/login', data);
export const logout = () => api.post('/auth/logout');
export const getProfile = () => api.get('/users/profile');
```

### Custom API Hook (src/hooks/useApi.js)
```javascript
import { useState, useCallback } from 'react';
import axios from 'axios';

export const useApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleRequest = useCallback(async (apiFunc, ...params) => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiFunc(...params);
      return response.data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'An error occurred';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  return { handleRequest, loading, error };
};
```

### Message Context (src/contexts/MessageContext.js)
```javascript
import React, { createContext, useContext, useState, useCallback } from 'react';

const MessageContext = createContext(null);

export const MessageProvider = ({ children }) => {
  const [message, setMessage] = useState(null);

  const showMessage = useCallback((text, type = 'success', duration = 5000) => {
    setMessage({ text, type });
    setTimeout(() => setMessage(null), duration);
  }, []);

  const clearMessage = useCallback(() => {
    setMessage(null);
  }, []);

  return (
    <MessageContext.Provider value={{ message, showMessage, clearMessage }}>
      {children}
      {message && <MessageToast message={message} onClose={clearMessage} />}
    </MessageContext.Provider>
  );
};

export const useMessage = () => useContext(MessageContext);
```

### Login Component Example (src/pages/Login/Login.js)
```javascript
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApi } from '../../hooks/useApi';
import { useMessage } from '../../contexts/MessageContext';
import { login } from '../../services/api';
import './Login.css';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const { handleRequest, loading } = useApi();
  const { showMessage } = useMessage();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await handleRequest(login, formData);
      showMessage('Login successful!', 'success');
      navigate('/dashboard');
    } catch (error) {
      showMessage(error.message, 'error');
    }
  };

  return (
    <div className="login-container">
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Email"
          required
        />
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Password"
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Loading...' : 'Login'}
        </button>
      </form>
    </div>
  );
};

export default Login;
```

### MessageToast Component (src/components/MessageToast/MessageToast.js)
```javascript
import React from 'react';
import './MessageToast.css';

const MessageToast = ({ message, onClose }) => {
  const { text, type } = message;

  return (
    <div className={`toast ${type}`}>
      <span className="toast-text">{text}</span>
      <button className="toast-close" onClick={onClose}>×</button>
    </div>
  );
};

export default MessageToast;
```

### MessageToast CSS (src/components/MessageToast/MessageToast.css)
```css
.toast {
  position: fixed;
  bottom: 20px;
  right: 20px;
  padding: 15px 25px;
  border-radius: 4px;
  color: white;
  display: flex;
  align-items: center;
  animation: slideIn 0.5s ease;
  z-index: 1000;
}

.toast.success {
  background-color: #4caf50;
}

.toast.error {
  background-color: #f44336;
}

.toast-close {
  background: none;
  border: none;
  color: white;
  margin-left: 10px;
  cursor: pointer;
  font-size: 20px;
}

@keyframes slideIn {
  from {
    transform: translateX(100%);
  }
  to {
    transform: translateX(0);
  }
}
```

## Running the Application

### Server package.json (server/package.json)
```json
{
  "scripts": {
    "start": "node server.js",
    "server": "nodemon server.js",
    "client": "cd ../aibot && npm start",
    "dev": "concurrently \"npm run server\" \"npm run client\""
  }
}
```

### Root package.json (package.json)
```json
{
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test",
    "eject": "react-scripts eject"
  }
}
```

To start the application:
```bash
cd server
npm run dev
```

This will start:
- Frontend on http://localhost:3000
- Backend on http://localhost:4000

## Best Practices Summary

1. **Security**
   - Use HTTP-only cookies for authentication
   - Implement CORS properly
   - Hash passwords with bcrypt
   - Validate all input data

2. **Error Handling**
   - Centralized error handling
   - Consistent error responses
   - User-friendly error messages
   - Proper status codes

3. **State Management**
   - Centralized message handling
   - Loading states for better UX
   - Custom hooks for API calls

4. **Code Organization**
   - Clear folder structure
   - Component-specific CSS
   - Reusable components
   - Separation of concerns

5. **Development**
   - Use environment variables
   - Concurrent development setup
   - Proper logging
   - Clean and maintainable code
