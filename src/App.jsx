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
import ProfilePage from './pages/Profile';
import MainLayout from './components/Layout/MainLayout';
import { UserProvider } from './pages/UserContext';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <UserProvider>
        <Navbar />

        <main className="flex-1 flex flex-col">
        <Routes>

          <Route path="/" element={<Home />} />
          <Route path="/product/:id" element={<ProductDetails />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/success" element={<Success />} />
          <Route path="/Profile" element={<ProfilePage />} />
        </Routes>
        </main>
        </UserProvider>
        <Footer/> 
      </div>
    </Router>
  );
}

export default App;