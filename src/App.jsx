import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CheckCircle2 } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart, selectCartCount } from './redux/cartSlice';


import Navbar from './components/Layout/Navbar';
import Footer from './components/Layout/Footer';
import Login from './pages/Login';
import Home from './pages/Home';
import Signup from './pages/Signup';
import ProductDetails from './pages/ProductDetails';
import Cart from './pages/Cart';
import Success from './pages/Success';
import Checkout from './pages/Checkout';
import ProfilePage from './pages/Profile';
import Wishlist from './pages/Wishlist';
import Orders from './pages/Orders'; 
import { UserProvider } from './pages/UserContext';

const ORDERS_KEY = 'voltix_orders';

function App() {
  const dispatch = useDispatch();
  const cartCount = useSelector(selectCartCount);
  const [toast, setToast] = useState(null);

  const showToast = (product) => {
    setToast(product);
    setTimeout(() => setToast(null), 2500);
  };

  const handleAddToCart = (product) => {
    dispatch(addToCart(product));
    showToast(product);
  }

  return (
    <Router>
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <UserProvider>
          <Navbar cartCount={cartCount} />

          <main className="flex-1 flex flex-col">
            <Routes>
              <Route path="/" element={<Home addToCart={handleAddToCart} />} />
              <Route path="/product/:id" element={<ProductDetails addToCart={handleAddToCart} />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/success" element={<Success />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/orders" element={<Orders />} />
              <Route path="/wishlist" element={<Wishlist addToCart={addToCart} />} />
            </Routes>
          </main>
        </UserProvider>

        <Footer />

        {/* Toast */}
        <div className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-50 transition-all duration-300 ${
          toast ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
        }`}>
          {toast && (
            <div className="flex items-center gap-3 bg-gray-900 text-white px-5 py-3.5 rounded-2xl shadow-xl">
              <img
                src={toast.thumbnail || toast.image}
                alt={toast.title || toast.name}
                className="w-9 h-9 rounded-lg object-cover bg-gray-700"
              />
              <div>
                <p className="text-xs font-bold">{toast.title || toast.name}</p>
                <p className="text-[11px] text-gray-400">Added to cart</p>
              </div>
              <CheckCircle2 size={18} className="text-green-400" />
            </div>
          )}
        </div>
      </div>
    </Router>
  );
}

export default App;