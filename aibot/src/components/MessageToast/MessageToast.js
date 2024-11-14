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