// App.jsx
// Root component of the React app.
// Previously used Firebase onAuthStateChanged to detect login state.
// Now uses loadUserFromToken — checks if a JWT token exists in localStorage
// and fetches the user profile from Django on every page load/refresh.

import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CheckCircle2 } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart, selectCartCount } from './redux/cartSlice';
import { fetchWishlist } from './redux/wishlistSlice';
import { loadUserFromToken } from './redux/userSlice';

import Navbar         from './components/Layout/Navbar/Navbar';
import Footer         from './components/Layout/Footer';
import Login          from './pages/Login';
import Home           from './pages/Home';
import Signup         from './pages/Signup';
import VerifyEmail    from './pages/VerifyEmail';
import ProductDetails from './pages/ProductDetails';
import Cart           from './pages/Cart';
import Success        from './pages/Success';
import Checkout       from './pages/Checkout';
import ProfilePage    from './pages/Profile';
import Wishlist       from './pages/Wishlist';
import Orders         from './pages/Orders';
import { Toaster }    from 'react-hot-toast';

function App() {
  const dispatch  = useDispatch();
  const cartCount = useSelector(selectCartCount);
  const [toast, setToast] = useState(null);

  const { loading, data: user } = useSelector((state) => state.user);

  useEffect(() => {
    dispatch(loadUserFromToken()).then((action) => {
      if (action.payload?.id) {
        dispatch(fetchWishlist());
      }
    });
  }, [dispatch]);

  const showToast = (product) => {
    setToast(product);
    setTimeout(() => setToast(null), 2500);
  };

  const handleAddToCart = (product) => {
    dispatch(addToCart(product));
    showToast(product);
  };

  return (
    // ── BUG FIX ────────────────────────────────────────────────────────────
    // Previously: `if (loading) return <div>Loading...</div>` was ABOVE the
    // Router. This meant the Router was unmounted while loadUserFromToken ran.
    // So when Login.jsx called navigate("/") after a successful login,
    // the Router wasn't in the tree yet and the navigation was silently lost.
    // When loading finally resolved the Router mounted, but navigate had
    // already fired into nothing — leaving the user stuck on /login.
    //
    // Fix: Router is now always mounted. The loading spinner renders INSIDE
    // it, so navigate() always has a live Router to work with.
    // ───────────────────────────────────────────────────────────────────────
    <Router>
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Navbar cartCount={cartCount} />

        <main className="flex-1 flex flex-col">
          {loading ? (
            // Auth check in progress — show a simple spinner.
            // Router is still mounted so any in-flight navigate() calls land.
            <div className="flex-1 flex items-center justify-center py-32">
              <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <Routes>
              <Route path="/"             element={<Home addToCart={handleAddToCart} />} />
              <Route path="/product/:id"  element={<ProductDetails addToCart={handleAddToCart} />} />
              <Route path="/cart"         element={<Cart />} />
              <Route path="/checkout"     element={<Checkout />} />
              <Route path="/login"        element={<Login />} />
              <Route path="/signup"       element={<Signup />} />
              <Route path="/verify-email" element={<VerifyEmail />} />
              <Route path="/success"      element={<Success />} />
              <Route path="/profile"      element={<ProfilePage />} />
              <Route path="/orders"       element={<Orders />} />
              <Route path="/wishlist"     element={<Wishlist addToCart={handleAddToCart} />} />
            </Routes>
          )}
        </main>

        <Footer />

        {/* Add to cart toast notification */}
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
      <Toaster position="top-center" richColors />
    </Router>
  );
}

export default App;