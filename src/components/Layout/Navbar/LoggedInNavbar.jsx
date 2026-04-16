import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, User, LogOut, Menu, X, Heart, Search } from 'lucide-react';
import logo from '../../../assets/Logo.png';
import { useState } from 'react';
import { signOut } from "firebase/auth";
import { auth } from "../../../firebase/firebaseConfig";

const LoggedInNavbar = ({ cartCount = 0, searchTerm, setSearchTerm, handleSearch }) => {
    const navigate = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-6">
                <div className="flex items-center justify-between h-20 gap-6">

                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-3 flex-shrink-0">
                        <img src={logo} alt="Voltix" className="h-8 w-auto" />
                    </Link>

                    {/* Search bar */}
                    <form onSubmit={handleSearch} className="hidden md:block flex-1 mx-8">
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

                    {/* Right side icons */}
                    <div className="flex items-center gap-5 flex-shrink-0">
                        <Link to="/wishlist" className="text-gray-700 hover:text-red-500 transition-colors duration-150" title="Wishlist">
                            <Heart size={22} />
                        </Link>
                        <Link to="/cart" className="relative text-gray-700 hover:text-blue-600 transition-colors duration-150">
                            <ShoppingCart size={22} />
                            {cartCount > 0 && (
                                <span className="absolute -top-1.5 -right-1.5 bg-blue-600 text-white text-[9px] font-bold w-4 h-4 flex items-center justify-center rounded-full leading-none">
                                    {cartCount}
                                </span>
                            )}
                        </Link>
                        <button
                            onClick={() => navigate('/Profile')}
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

            {/* Mobile Menu */}
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
                </div>
            )}
        </nav>
    );
};

export default LoggedInNavbar;