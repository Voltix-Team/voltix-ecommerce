import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, User, LogOut, Menu, X, Search, HelpCircle } from 'lucide-react';
import logo from '../../assets/Logo.png';
import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom"; // Hook to check the current URL
import { auth } from "../../firebase/firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";
import { signOut } from "firebase/auth";


const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();


    // Cart item count — replace with real cart state
    const cartCount = 0;

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchTerm.trim()) {
            navigate(`/?search=${searchTerm}`);
        } else {
            navigate('/');
        }
    };

    const [user, setUser] = useState(null);
    const location = useLocation();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
            if (firebaseUser) {
                setUser(firebaseUser);
            } else {
                setUser(null);
            }
        });
        return () => unsubscribe();
    }, []);

    const isAuthPage = location.pathname === "/signup" || location.pathname === "/login";

    // Auth page navbar (login/signup) — minimal header
    if (isAuthPage) {
        return (
            <header className="flex items-center justify-between px-8 py-3 bg-[#f4f7f9] border-b border-gray-200">
                <Link to="/" className="flex-shrink-0">
                    <img src={logo} alt="Voltix" className="h-6 w-auto" />
                </Link>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                    <span>Power Your Future</span>
                    <button className="text-gray-400 hover:text-gray-600 transition-colors">
                        <HelpCircle size={18} />
                    </button>
                </div>
            </header>
        );
    }

    // Authenticated navbar — profile & logout
    if (user) {
        return (
            <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="flex items-center justify-between h-20 gap-6">
                        <Link to="/" className="flex items-center gap-3 flex-shrink-0">
                            <img src={logo} alt="Voltix" className="h-8 w-auto" />
                        </Link>

                        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-700 flex-shrink-0">
                            <Link to="/" className="hover:text-blue-600 transition-colors duration-150">Home</Link>
                            <Link to="/shop" className="hover:text-blue-600 transition-colors duration-150">Shop</Link>
                            <Link to="/audio" className="hover:text-blue-600 transition-colors duration-150">Audio</Link>
                            <Link to="/computing" className="hover:text-blue-600 transition-colors duration-150">Computing</Link>
                            <Link to="/mobile" className="hover:text-blue-600 transition-colors duration-150">Mobile</Link>
                        </div>

                        <form onSubmit={handleSearch} className="hidden md:block flex-1 max-w-xl mx-8">
                            <div className="relative">
                                <input
                                    type="text"
                                    value={searchTerm}
                                    onChange={(e) => {
                                        setSearchTerm(e.target.value);
                                        if (e.target.value === '') navigate('/');
                                    }}
                                    placeholder="Search for products..."
                                    className="w-full bg-gray-100 border border-gray-200 focus:border-blue-500 rounded-3xl py-3 pl-12 pr-6 text-sm focus:outline-none"
                                />
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-gray-400 absolute left-5 top-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </div>
                        </form>

                        <div className="flex items-center gap-5 flex-shrink-0">
                            <Link to="/cart" className="relative text-gray-700 hover:text-blue-600 transition-colors duration-150">
                                <ShoppingCart size={22} />
                                {cartCount > 0 && (
                                    <span className="absolute -top-1.5 -right-1.5 bg-blue-600 text-white text-[9px] font-bold w-4 h-4 flex items-center justify-center rounded-full leading-none">
                                        {cartCount}
                                    </span>
                                )}
                            </Link>
                            <div className="flex items-center gap-4">
                                <button
                                    onClick={() => navigate('/account')}
                                    className="flex items-center gap-2 text-gray-700 hover:text-blue-600 transition-colors duration-150"
                                >
                                    <User size={22} />
                                    <span className="hidden lg:block text-sm font-medium">My Account</span>
                                </button>
                                <button
                                    onClick={() => signOut(auth).then(() => navigate('/login'))}
                                    className="text-gray-400 hover:text-red-500 transition-colors duration-150"
                                    title="Log out"
                                >
                                    <LogOut size={20} />
                                </button>
                            </div>
                            <button
                                onClick={() => setIsMenuOpen(!isMenuOpen)}
                                className="md:hidden text-gray-700 hover:text-blue-600 transition-colors"
                                aria-label="Toggle menu"
                            >
                                {isMenuOpen ? <X size={26} /> : <Menu size={26} />}
                            </button>
                        </div>
                    </div>
                </div>

                {isMenuOpen && (
                    <div className="md:hidden bg-white border-t border-gray-100">
                        <div className="px-6 pt-4">
                            <form onSubmit={handleSearch}>
                                <div className="relative">
                                    <Search size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                                    <input
                                        type="text"
                                        value={searchTerm}
                                        onChange={(e) => {
                                            setSearchTerm(e.target.value);
                                            if (e.target.value === '') navigate('/');
                                        }}
                                        placeholder="Search for products..."
                                        className="w-full bg-gray-100 border border-gray-200 rounded-full py-2.5 pl-10 pr-5 text-sm outline-none focus:border-blue-500"
                                    />
                                </div>
                            </form>
                        </div>
                        <div className="px-6 py-6 flex flex-col gap-5 text-base font-medium text-gray-700">
                            <Link to="/" onClick={() => setIsMenuOpen(false)} className="hover:text-blue-600 transition-colors">Home</Link>
                            <Link to="/shop" onClick={() => setIsMenuOpen(false)} className="hover:text-blue-600 transition-colors">Shop</Link>
                            <Link to="/audio" onClick={() => setIsMenuOpen(false)} className="hover:text-blue-600 transition-colors">Audio</Link>
                            <Link to="/computing" onClick={() => setIsMenuOpen(false)} className="hover:text-blue-600 transition-colors">Computing</Link>
                            <Link to="/mobile" onClick={() => setIsMenuOpen(false)} className="hover:text-blue-600 transition-colors">Mobile</Link>
                        </div>
                    </div>
                )}
            </nav>
        );
    }

    // Guest navbar (not authenticated, not on auth page) — login/signup buttons
    return (
        <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-6">
                <div className="flex items-center justify-between h-20 gap-6">
                    <Link to="/" className="flex items-center gap-3 flex-shrink-0">
                        <img src={logo} alt="Voltix" className="h-8 w-auto" />
                    </Link>

                    <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-700 flex-shrink-0">
                        <Link to="/" className="hover:text-blue-600 transition-colors duration-150">Home</Link>
                        <Link to="/shop" className="hover:text-blue-600 transition-colors duration-150">Shop</Link>
                        <Link to="/audio" className="hover:text-blue-600 transition-colors duration-150">Audio</Link>
                        <Link to="/computing" className="hover:text-blue-600 transition-colors duration-150">Computing</Link>
                        <Link to="/mobile" className="hover:text-blue-600 transition-colors duration-150">Mobile</Link>
                    </div>

                    <form onSubmit={handleSearch} className="hidden md:block flex-1 max-w-xl mx-8">
                        <div className="relative">
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => {
                                    setSearchTerm(e.target.value);
                                    if (e.target.value === '') navigate('/');
                                }}
                                placeholder="Search for products..."
                                className="w-full bg-gray-100 border border-gray-200 focus:border-blue-500 rounded-3xl py-3 pl-12 pr-6 text-sm focus:outline-none"
                            />
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-gray-400 absolute left-5 top-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                    </form>

                    <div className="flex items-center gap-5 flex-shrink-0">
                        <Link to="/cart" className="relative text-gray-700 hover:text-blue-600 transition-colors duration-150">
                            <ShoppingCart size={22} />
                            {cartCount > 0 && (
                                <span className="absolute -top-1.5 -right-1.5 bg-blue-600 text-white text-[9px] font-bold w-4 h-4 flex items-center justify-center rounded-full leading-none">
                                    {cartCount}
                                </span>
                            )}
                        </Link>
                        <div className="hidden md:flex items-center gap-3">
                            <Link
                                to="/login"
                                className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors duration-150"
                            >
                                Login
                            </Link>
                            <Link
                                to="/signup"
                                className="bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white px-5 py-2.5 rounded-2xl text-sm font-semibold transition-colors duration-150 whitespace-nowrap"
                            >
                                Sign Up
                            </Link>
                        </div>
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="md:hidden text-gray-700 hover:text-blue-600 transition-colors"
                            aria-label="Toggle menu"
                        >
                            {isMenuOpen ? <X size={26} /> : <Menu size={26} />}
                        </button>
                    </div>
                </div>
            </div>

            {isMenuOpen && (
                <div className="md:hidden bg-white border-t border-gray-100">
                    <div className="px-6 pt-4">
                        <form onSubmit={handleSearch}>
                            <div className="relative">
                                <Search size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                                <input
                                    type="text"
                                    value={searchTerm}
                                    onChange={(e) => {
                                        setSearchTerm(e.target.value);
                                        if (e.target.value === '') navigate('/');
                                    }}
                                    placeholder="Search for products..."
                                    className="w-full bg-gray-100 border border-gray-200 rounded-full py-2.5 pl-10 pr-5 text-sm outline-none focus:border-blue-500"
                                />
                            </div>
                        </form>
                    </div>
                    <div className="px-6 py-6 flex flex-col gap-5 text-base font-medium text-gray-700">
                        <Link to="/" onClick={() => setIsMenuOpen(false)} className="hover:text-blue-600 transition-colors">Home</Link>
                        <Link to="/shop" onClick={() => setIsMenuOpen(false)} className="hover:text-blue-600 transition-colors">Shop</Link>
                        <Link to="/audio" onClick={() => setIsMenuOpen(false)} className="hover:text-blue-600 transition-colors">Audio</Link>
                        <Link to="/computing" onClick={() => setIsMenuOpen(false)} className="hover:text-blue-600 transition-colors">Computing</Link>
                        <Link to="/mobile" onClick={() => setIsMenuOpen(false)} className="hover:text-blue-600 transition-colors">Mobile</Link>
                        <div className="flex flex-col gap-3 pt-2 border-t border-gray-100">
                            <Link
                                to="/login"
                                onClick={() => setIsMenuOpen(false)}
                                className="text-center py-2.5 rounded-2xl border border-gray-200 text-sm font-semibold text-gray-700 hover:border-blue-500 hover:text-blue-600 transition-colors"
                            >
                                Login
                            </Link>
                            <Link
                                to="/signup"
                                onClick={() => setIsMenuOpen(false)}
                                className="text-center py-2.5 rounded-2xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition-colors"
                            >
                                Sign Up
                            </Link>
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;