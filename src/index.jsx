import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles/index.css'; // Make sure this path is correct!
import App from './App.jsx';
import Cart from './pages/Cart.jsx'

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    
    <Cart />
  </React.StrictMode>
);