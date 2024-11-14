import React, { useState } from 'react';
import './LessonList.css';

const LessonList = ({ lessons, onEdit, onDelete }) => {
  const [expandedLesson, setExpandedLesson] = useState(null);

  const toggleQuiz = (lessonId) => {
    setExpandedLesson(expandedLesson === lessonId ? null : lessonId);
  };

  return (
    <div className="lessons-grid">
      {lessons.map(lesson => (
        <div key={lesson.id} className="lesson-item">
          <div className="lesson-content">
            <h3>{lesson.title}</h3>
            <p className="lesson-details">
              <span>Questions: {lesson.questionCount}</span>
              <span>Types: {lesson.quizTypes.join(', ')}</span>
            </p>
            <p className="lesson-text">{lesson.content}</p>
            <div className="lesson-url">
              <a 
                href={`/quiz${lesson.url}`}
                target="_blank" 
                rel="noopener noreferrer"
              >
                Take Quiz
              </a>
            </div>
            <button 
              className="view-quiz-btn"
              onClick={() => toggleQuiz(lesson.id)}
            >
              {expandedLesson === lesson.id ? 'Hide Quiz' : 'View Quiz'}
            </button>
            {expandedLesson === lesson.id && lesson.quiz && (
              <div className="quiz-section">
                {lesson.quiz.map((question, index) => (
                  <div key={index} className="quiz-question">
                    <h4>Question {index + 1}</h4>
                    <p><strong>Type:</strong> {question.type}</p>
                    <p><strong>Question:</strong> {question.question}</p>
                    {question.options && (
                      <div className="options">
                        <strong>Options:</strong>
                        <ul>
                          {question.options.map((option, i) => (
                            <li key={i}>{option}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    <p><strong>Correct Answer:</strong> {question.correctAnswer}</p>
                    <p><strong>Explanation:</strong> {question.explanation}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="lesson-actions">
            <button 
              className="edit-btn"
              onClick={() => onEdit(lesson)}
            >
              Edit
            </button>
            <button 
              className="delete-btn"
              onClick={() => onDelete(lesson.id)}
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default LessonList; 