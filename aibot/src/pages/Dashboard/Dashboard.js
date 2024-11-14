import React, { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useApi } from '../../hooks/useApi';
import { getProfile, createLesson, getLessons, deleteLesson, updateLesson } from '../../services/api';
import './Dashboard.css';
import ErrorCard from '../../components/ErrorCard/ErrorCard';
import LessonList from '../../components/LessonList/LessonList';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const { handleRequest, loading } = useApi();
  const [userData, setUserData] = useState(null);
  const [lessonData, setLessonData] = useState({
    title: '',
    content: '',
    questionCount: 1,
    quizTypes: {
      'multiple-choice': false,
      'true-false': false,
      'short-answer': false,
      'essay': false
    }
  });
  const [errorMessage, setErrorMessage] = useState('');
  const [lessons, setLessons] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [userResponse, lessonsResponse] = await Promise.all([
          handleRequest(getProfile),
          handleRequest(getLessons)
        ]);
        setUserData(userResponse.data);
        setLessons(lessonsResponse.data);
      } catch (error) {
        // Error is handled by useApi hook
      }
    };

    fetchData();
  }, [handleRequest]);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      // Error is handled by useApi hook
    }
  };

  const handleLessonChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (type === 'checkbox') {
      setLessonData(prev => ({
        ...prev,
        quizTypes: {
          ...prev.quizTypes,
          [name]: checked
        }
      }));
    } else {
      setLessonData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleEdit = (lesson) => {
    setLessonData({
      title: lesson.title,
      content: lesson.content,
      questionCount: lesson.questionCount,
      quizTypes: lesson.quizTypes.reduce((acc, type) => ({
        ...acc,
        [type]: true
      }), {
        'multiple-choice': false,
        'true-false': false,
        'short-answer': false,
        'essay': false
      })
    });
    setIsEditing(true);
    setEditingId(lesson._id);
  };

  const handleDelete = async (lessonId) => {
    if (window.confirm('Are you sure you want to delete this lesson?')) {
      try {
        await handleRequest(deleteLesson, lessonId);
        const lessonsResponse = await handleRequest(getLessons);
        setLessons(lessonsResponse.data);
      } catch (error) {
        setErrorMessage(error.message || 'Failed to delete lesson');
      }
    }
  };

  const handleSubmitLesson = async (e) => {
    e.preventDefault();
    const selectedQuizTypes = Object.entries(lessonData.quizTypes)
      .filter(([_, isSelected]) => isSelected)
      .map(([type]) => type);

    if (selectedQuizTypes.length === 0) {
      setErrorMessage('Please select at least one quiz type');
      return;
    }

    try {
      const formattedData = {
        title: lessonData.title,
        content: lessonData.content,
        questionCount: parseInt(lessonData.questionCount),
        quizTypes: selectedQuizTypes
      };

      if (isEditing) {
        const updatedLesson = await handleRequest(updateLesson, editingId, formattedData);
        setLessons(prev => prev.map(lesson => 
          lesson._id === editingId ? updatedLesson.data : lesson
        ));
      } else {
        const newLesson = await handleRequest(createLesson, formattedData);
        setLessons(prev => [...prev, newLesson.data]);
      }

      // Reset form
      setLessonData({
        title: '',
        content: '',
        questionCount: 1,
        quizTypes: {
          'multiple-choice': false,
          'true-false': false,
          'short-answer': false,
          'essay': false
        }
      });
      setIsEditing(false);
      setEditingId(null);
      setErrorMessage('');

    } catch (error) {
      setErrorMessage(error.message || 'Failed to save lesson');
    }
  };

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <div className="header-content">
          <h1>Welcome, {userData?.name || user?.name || 'User'}</h1>
          <div className="header-actions">
            <button 
              className="results-button" 
              onClick={() => navigate('/results/dashboard')}
            >
              Show Results
            </button>
            <button 
              className="logout-button" 
              onClick={handleLogout} 
              disabled={loading}
            >
              {loading ? 'Loading...' : 'Logout'}
            </button>
          </div>
        </div>
      </header>
      <main className="dashboard-content">
        <div className="dashboard-card">
          <h2>Your Profile</h2>
          <div className="profile-info">
            <p><strong>Name:</strong> {userData?.name || user?.name}</p>
            <p><strong>Email:</strong> {userData?.email || user?.email}</p>
          </div>
        </div>

        <div className="dashboard-card lesson-card">
          <h2>{isEditing ? 'Edit Lesson' : 'Create New Lesson'}</h2>
          {errorMessage && (
            <ErrorCard 
              message={errorMessage} 
              onClose={() => setErrorMessage('')}
            />
          )}
          <form onSubmit={handleSubmitLesson}>
            <div className="form-group">
              <label htmlFor="title">Lesson Title</label>
              <input
                type="text"
                id="title"
                name="title"
                value={lessonData.title}
                onChange={handleLessonChange}
                placeholder="Enter lesson title"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="content">Lesson Content</label>
              <textarea
                id="content"
                name="content"
                value={lessonData.content}
                onChange={handleLessonChange}
                placeholder="Enter today's lesson content"
                rows="6"
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group half-width">
                <label htmlFor="questionCount">Number of Questions</label>
                <input
                  type="number"
                  id="questionCount"
                  name="questionCount"
                  value={lessonData.questionCount}
                  onChange={handleLessonChange}
                  min="1"
                  max="20"
                  required
                />
              </div>

              <div className="form-group half-width">
                <label>Quiz Types</label>
                <div className="checkbox-group">
                  <div className="checkbox-item">
                    <input
                      type="checkbox"
                      id="multiple-choice"
                      name="multiple-choice"
                      checked={lessonData.quizTypes['multiple-choice']}
                      onChange={handleLessonChange}
                    />
                    <label htmlFor="multiple-choice">Multiple Choice</label>
                  </div>
                  <div className="checkbox-item">
                    <input
                      type="checkbox"
                      id="true-false"
                      name="true-false"
                      checked={lessonData.quizTypes['true-false']}
                      onChange={handleLessonChange}
                    />
                    <label htmlFor="true-false">True/False</label>
                  </div>
                  <div className="checkbox-item">
                    <input
                      type="checkbox"
                      id="short-answer"
                      name="short-answer"
                      checked={lessonData.quizTypes['short-answer']}
                      onChange={handleLessonChange}
                    />
                    <label htmlFor="short-answer">Short Answer</label>
                  </div>
                  <div className="checkbox-item">
                    <input
                      type="checkbox"
                      id="essay"
                      name="essay"
                      checked={lessonData.quizTypes['essay']}
                      onChange={handleLessonChange}
                    />
                    <label htmlFor="essay">Essay</label>
                  </div>
                </div>
              </div>
            </div>

            <button type="submit" className="create-lesson-btn">
              {isEditing ? 'Update Lesson' : 'Create Lesson'}
            </button>
            {isEditing && (
              <button 
                type="button" 
                className="cancel-btn"
                onClick={() => {
                  setIsEditing(false);
                  setEditingId(null);
                  setLessonData({
                    title: '',
                    content: '',
                    questionCount: 1,
                    quizTypes: {
                      'multiple-choice': false,
                      'true-false': false,
                      'short-answer': false,
                      'essay': false
                    }
                  });
                }}
              >
                Cancel Editing
              </button>
            )}
          </form>
        </div>

        <div className="dashboard-card">
          <h2>Your Lessons</h2>
          {lessons.length > 0 ? (
            <LessonList 
              lessons={lessons}
              onEdit={handleEdit}
              onDelete={handleDelete}
              baseUrl={window.location.origin}
            />
          ) : (
            <p className="no-lessons">No lessons created yet.</p>
          )}
        </div>
      </main>
    </div>
  );
};

export default Dashboard; 