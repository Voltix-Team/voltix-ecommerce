import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CheckCircle2 } from 'lucide-react';

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
import { UserProvider } from './pages/UserContext';
import OrderItemRow from './components/UI/OrderItemRow';

function App() {
  const [cartItems, setCartItems] = useState([]);
  const [toast, setToast] = useState(null);

  // ✅ Load cart from localStorage
  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCartItems(storedCart);
  }, []);

  // ✅ Save cart to localStorage
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cartItems));
  }, [cartItems]);

  const showToast = (product) => {
    setToast(product);
    setTimeout(() => setToast(null), 2500);
  };

  const addToCart = (product) => {
    setCartItems(prev => {
      const existing = prev.find(item => item.id === product.id);

      if (existing) {
        return prev.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }

      return [...prev, { ...product, quantity: 1 }];
    });

    showToast(product);
  };

  const updateQuantity = (id, delta) => {
    setCartItems(prev =>
      prev.map(item =>
        item.id === id
          ? { ...item, quantity: Math.max(1, item.quantity + delta) }
          : item
      )
    );
  };

  const removeFromCart = (id) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
  };

  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem("cart"); // optional but cleaner
  };

  const cartCount = cartItems.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <Router>
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <UserProvider>
          <Navbar cartCount={cartCount} />

          <main className="flex-1 flex flex-col">
            <Routes>
              <Route path="/" element={<Home addToCart={addToCart} />} />
              <Route path="/product/:id" element={<ProductDetails addToCart={addToCart} />} />

              <Route
                path="/cart"
                element={
                  <Cart
                    cartItems={cartItems}
                    updateQuantity={updateQuantity}
                    removeFromCart={removeFromCart}
                  />
                }
              />

              <Route
                path="/checkout"
                element={
                  <Checkout
                    cartItems={cartItems}
                    clearCart={clearCart}
                  />
                }
              />

              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/success" element={<Success />} />
              <Route path="/profile" element={<ProfilePage />} />
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