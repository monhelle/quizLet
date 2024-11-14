import React, { useEffect, useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { useApi } from '../../hooks/useApi';
import { getQuizResults } from '../../services/api';
import './Results.css';

const Results = () => {
  const { resultId } = useParams();
  const { handleRequest, loading } = useApi();
  const [results, setResults] = useState(null);
  const location = useLocation();
  const immediateResults = location.state?.results;

  useEffect(() => {
    if (!immediateResults && resultId) {
      const fetchResults = async () => {
        try {
          const response = await handleRequest(getQuizResults, resultId);
          setResults(response.data);
        } catch (error) {
          console.error('Failed to fetch results:', error);
        }
      };
      fetchResults();
    } else if (immediateResults) {
      setResults(immediateResults);
    }
  }, [resultId, handleRequest, immediateResults]);

  if (loading || !results) {
    return <div className="results-container">Loading results...</div>;
  }

  return (
    <div className="results-container">
      <header className="results-header">
        <h1>Quiz Results</h1>
        <div className="score-summary">
          <h2>Final Score: {results.score}%</h2>
          <p>Correct Answers: {results.correctCount} out of {results.totalQuestions}</p>
        </div>
      </header>

      <main className="results-content">
        <div className="questions-review">
          {results.answers.map((answer, index) => (
            <div 
              key={index} 
              className={`question-result ${answer.isCorrect ? 'correct' : 'incorrect'}`}
            >
              <h3>Question {index + 1}</h3>
              <p className="question-text">{answer.question}</p>
              <div className="answer-details">
                <p><strong>Your Answer:</strong> {answer.userAnswer}</p>
                <p><strong>Correct Answer:</strong> {answer.correctAnswer}</p>
                <p className="explanation"><strong>Explanation:</strong> {answer.explanation}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="results-actions">
          <button onClick={() => window.location.href = '/'} className="home-btn">
            Return Home
          </button>
          <button onClick={() => window.print()} className="print-btn">
            Print Results
          </button>
        </div>
      </main>
    </div>
  );
};

export default Results; 