import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles/index.css'; 
import App from './App.jsx';
import { Provider } from 'react-redux';
import store from './redux/store.js'

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    { /* provider is like giving each part of the app a key to the store */}
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
);