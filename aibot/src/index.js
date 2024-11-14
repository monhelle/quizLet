import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';

console.log(`
%c✨ AIBot Quiz Platform ✨
%cDesigned & Developed by Monica Stefferud-Helle
%c© 2024 All Rights Reserved`, 
  'color: #ff69b4; font-size: 20px; font-weight: bold;',
  'color: #4CAF50; font-size: 14px',
  'color: #666; font-size: 12px;'
);

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);
