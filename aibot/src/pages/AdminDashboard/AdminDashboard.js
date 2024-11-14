import React, { useState, useEffect } from 'react';
import { useApi } from '../../hooks/useApi';
import { getQuizStats, getLessonResults } from '../../services/api';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const { handleRequest, loading } = useApi();
  const [stats, setStats] = useState([]);
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [lessonResults, setLessonResults] = useState([]);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await handleRequest(getQuizStats);
      setStats(response.data);
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    }
  };

  const handleLessonSelect = async (lessonId) => {
    try {
      const response = await handleRequest(getLessonResults, lessonId);
      setSelectedLesson(lessonId);
      setLessonResults(response.data);
    } catch (error) {
      console.error('Failed to fetch lesson results:', error);
    }
  };

  return (
    <div className="admin-dashboard">
      <header className="admin-header">
        <h1>Quiz Statistics Dashboard</h1>
      </header>

      <main className="admin-content">
        <section className="stats-overview">
          <h2>Overall Statistics</h2>
          <div className="stats-grid">
            {stats.map((stat) => (
              <div key={stat._id} className="stat-card">
                <h3>{stat.lessonTitle}</h3>
                <div className="stat-details">
                  <p>Total Attempts: {stat.totalAttempts}</p>
                  <p>Average Score: {Math.round(stat.averageScore)}%</p>
                  <p>Highest Score: {stat.highestScore}%</p>
                  <p>Lowest Score: {stat.lowestScore}%</p>
                </div>
                <button 
                  onClick={() => handleLessonSelect(stat._id)}
                  className="view-details-btn"
                >
                  View Details
                </button>
              </div>
            ))}
          </div>
        </section>

        {selectedLesson && (
          <section className="detailed-results">
            <h2>Detailed Results</h2>
            <div className="results-table-container">
              <table className="results-table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Score</th>
                    <th>Correct Answers</th>
                    <th>Total Questions</th>
                    <th>Time Taken</th>
                  </tr>
                </thead>
                <tbody>
                  {lessonResults.map((result) => (
                    <tr key={result._id}>
                      <td>{new Date(result.timestamp).toLocaleDateString()}</td>
                      <td>{result.score}%</td>
                      <td>{result.correctCount}</td>
                      <td>{result.totalQuestions}</td>
                      <td>{new Date(result.timestamp).toLocaleTimeString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard; 