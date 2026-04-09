import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Navbar from './components/Layout/Navbar';
import Footer from './components/Layout/Footer';
import Login from './pages/Login';
import Home from './pages/Home';
import ProductCard from './components/UI/Card';
import Signup from './pages/Signup';
import ProductDetails from './pages/ProductDetails';
import Cart from './pages/Cart';
import Success from './pages/Success';
import Checkout from './pages/Checkout';
import MainLayout from './components/Layout/MainLayout';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Navbar />

        <main className="flex-1 flex flex-col">
        <Routes>
          
          <Route path="/checkout" element={<Checkout />} />
       
        </Routes>
        </main>
        <Footer/> 
      </div>
    </Router>
  );
}

export default App;