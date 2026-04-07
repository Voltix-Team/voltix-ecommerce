import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Layout/Navbar';

function App() {
  return (
    <BrowserRouter>
      <Navbar />
    </BrowserRouter>
  );
}

export default App; // THIS IS THE LINE YOU ARE MISSING!