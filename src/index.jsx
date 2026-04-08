import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles/index.css'; // Make sure this path is correct!
import App from './App.jsx';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    
    <App />
  </React.StrictMode>
);