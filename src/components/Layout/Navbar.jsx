import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, User, LogOut, Menu, X } from 'lucide-react';
import logo from '../../assets/Logo.png';

const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();

    // TODO: Replace with real auth state from Aman later
    const isLoggedIn = false; // Change to true when testing logged-in state

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchTerm.trim()) {
            navigate(`/search?q=${searchTerm}`);
        }
    };

    return (
        <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">   
            <div className="max-w-7xl mx-auto px-6">
                <div className="flex items-center justify-between h-20">

                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-3">
                        <img src={logo} alt="Voltix Logo" className="h-8 w-auto" />                    
                    </Link>

                    {/* Search Bar */}
                    <form onSubmit={handleSearch} className="hidden md:block flex-1 max-w-xl mx-8">
                        <div className="relative">
                            <input   
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Search for products..."
                                className="w-full bg-gray-100 border border-gray-200 focus:border-blue-500 rounded-3xl py-3 pl-12 pr-6 text-sm focus:outline-none"
                            />
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-gray-400 absolute left-5 top-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                    </form>

                    

                </div>
            </div>
        </nav>
    )
}

export default Navbar;