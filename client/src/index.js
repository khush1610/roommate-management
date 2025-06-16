import React from 'react';
import ReactDOM from 'react-dom/client';  // Make sure you're using this for React 18+
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// For performance measurement
reportWebVitals();
