import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApi } from '../../hooks/useApi';
import { getLesson, submitQuizResults } from '../../services/api';
import './Quiz.css';

const Quiz = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { handleRequest, loading } = useApi();
  const [lesson, setLesson] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [immediateAnswer, setImmediateAnswer] = useState(null);

  useEffect(() => {
    const fetchLesson = async () => {
      try {
        const response = await handleRequest(getLesson, id);
        setLesson(response.data);
      } catch (error) {
        console.error('Failed to fetch lesson:', error);
      }
    };

    fetchLesson();
  }, [id, handleRequest]);

  const handleAnswerChange = (answer) => {
    setAnswers(prev => ({
      ...prev,
      [currentQuestion]: answer
    }));
    
    if (currentQuizQuestion.type === 'multiple-choice' || currentQuizQuestion.type === 'true-false') {
      const isCorrect = answer === currentQuizQuestion.correctAnswer;
      setImmediateAnswer({
        isCorrect,
        correctAnswer: currentQuizQuestion.correctAnswer,
        explanation: currentQuizQuestion.explanation
      });
    }
  };

  const handleNext = () => {
    if (currentQuestion < lesson.quiz.length - 1) {
      setCurrentQuestion(prev => prev + 1);
      setImmediateAnswer(null);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
    }
  };

  const handleSubmit = async () => {
    setSubmitted(true);
    
    const results = {
      lessonId: id,
      answers: lesson.quiz.map((question, index) => ({
        question: question.question,
        userAnswer: answers[index],
        correctAnswer: question.correctAnswer,
        isCorrect: answers[index] === question.correctAnswer,
        explanation: question.explanation
      })),
      timestamp: new Date().toISOString()
    };

    const correctCount = results.answers.filter(answer => answer.isCorrect).length;
    results.score = Math.round((correctCount / lesson.quiz.length) * 100);
    results.correctCount = correctCount;
    results.totalQuestions = lesson.quiz.length;

    try {
      const response = await handleRequest(submitQuizResults, id, results);
      
      navigate(`/results/${response.data.resultId}`, {
        state: { results }
      });
    } catch (error) {
      console.error('Failed to submit results:', error);
      navigate('/results', {
        state: { results }
      });
    }
  };

  if (loading || !lesson) {
    return <div className="quiz-container">Loading...</div>;
  }

  const currentQuizQuestion = lesson.quiz?.[currentQuestion];

  return (
    <div className="quiz-container">
      <header className="quiz-header">
        <h1>{lesson.title} - Quiz</h1>
        <div className="quiz-progress">
          Question {currentQuestion + 1} of {lesson.quiz?.length}
        </div>
      </header>

      <main className="quiz-main">
        {currentQuizQuestion && (
          <div className="question-container">
            <h2>Question {currentQuestion + 1}</h2>
            <p className="question-text">{currentQuizQuestion.question}</p>

            <div className="answer-section">
              {currentQuizQuestion.type === 'multiple-choice' && (
                <>
                  <div className="options">
                    {currentQuizQuestion.options.map((option, index) => (
                      <label 
                        key={index} 
                        className={`option-label 
                          ${answers[currentQuestion] === option ? 'selected' : ''}
                          ${immediateAnswer && answers[currentQuestion] === option ? 
                            (immediateAnswer.isCorrect ? 'correct' : 'incorrect') : ''}`}
                      >
                        <input
                          type="radio"
                          name={`question-${currentQuestion}`}
                          value={option}
                          checked={answers[currentQuestion] === option}
                          onChange={() => handleAnswerChange(option)}
                          disabled={submitted}
                        />
                        <span>{option}</span>
                        {immediateAnswer && answers[currentQuestion] === option && (
                          <span className="feedback-icon">
                            {immediateAnswer.isCorrect ? '✓' : '✗'}
                          </span>
                        )}
                      </label>
                    ))}
                  </div>
                  {immediateAnswer && (
                    <div className={`immediate-feedback ${immediateAnswer.isCorrect ? 'correct' : 'incorrect'}`}>
                      <p><strong>{immediateAnswer.isCorrect ? 'Correct!' : 'Incorrect.'}</strong></p>
                      <p><strong>Correct Answer:</strong> {immediateAnswer.correctAnswer}</p>
                      <p><strong>Explanation:</strong> {immediateAnswer.explanation}</p>
                    </div>
                  )}
                </>
              )}

              {currentQuizQuestion.type === 'true-false' && (
                <>
                  <div className="options">
                    {['True', 'False'].map((option) => (
                      <label 
                        key={option} 
                        className={`option-label 
                          ${answers[currentQuestion] === option ? 'selected' : ''}
                          ${immediateAnswer && answers[currentQuestion] === option ? 
                            (immediateAnswer.isCorrect ? 'correct' : 'incorrect') : ''}`}
                      >
                        <input
                          type="radio"
                          name={`question-${currentQuestion}`}
                          value={option}
                          checked={answers[currentQuestion] === option}
                          onChange={() => handleAnswerChange(option)}
                          disabled={submitted}
                        />
                        <span>{option}</span>
                        {immediateAnswer && answers[currentQuestion] === option && (
                          <span className="feedback-icon">
                            {immediateAnswer.isCorrect ? '✓' : '✗'}
                          </span>
                        )}
                      </label>
                    ))}
                  </div>
                  {immediateAnswer && (
                    <div className={`immediate-feedback ${immediateAnswer.isCorrect ? 'correct' : 'incorrect'}`}>
                      <p><strong>{immediateAnswer.isCorrect ? 'Correct!' : 'Incorrect.'}</strong></p>
                      <p><strong>Correct Answer:</strong> {immediateAnswer.correctAnswer}</p>
                      <p><strong>Explanation:</strong> {immediateAnswer.explanation}</p>
                    </div>
                  )}
                </>
              )}

              {(currentQuizQuestion.type === 'short-answer' || 
                currentQuizQuestion.type === 'essay') && (
                <textarea
                  value={answers[currentQuestion] || ''}
                  onChange={(e) => handleAnswerChange(e.target.value)}
                  disabled={submitted}
                  rows={currentQuizQuestion.type === 'essay' ? 6 : 2}
                  placeholder={`Enter your ${currentQuizQuestion.type} answer here...`}
                />
              )}
            </div>

            {submitted && (
              <div className="feedback">
                <p><strong>Correct Answer:</strong> {currentQuizQuestion.correctAnswer}</p>
                <p><strong>Explanation:</strong> {currentQuizQuestion.explanation}</p>
              </div>
            )}
          </div>
        )}

        <div className="quiz-navigation">
          <button 
            onClick={handlePrevious} 
            disabled={currentQuestion === 0}
            className="nav-btn"
          >
            Previous
          </button>
          <button 
            onClick={handleNext} 
            disabled={currentQuestion === lesson.quiz.length - 1}
            className="nav-btn"
          >
            Next
          </button>
          {!submitted && (
            <button 
              onClick={handleSubmit}
              className="submit-btn"
              disabled={Object.keys(answers).length !== lesson.quiz.length}
            >
              Submit Quiz
            </button>
          )}
        </div>
      </main>
    </div>
  );
};

export default Quiz; 