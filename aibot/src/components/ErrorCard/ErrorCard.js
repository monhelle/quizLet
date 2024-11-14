import React from 'react';
import './ErrorCard.css';

const ErrorCard = ({ message, onClose }) => {
  return (
    <div className="error-card">
      <div className="error-content">
        <span className="error-message">{message}</span>
        <button className="error-close" onClick={onClose}>×</button>
      </div>
    </div>
  );
};

export default ErrorCard; 