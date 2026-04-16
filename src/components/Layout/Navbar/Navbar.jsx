// Navbar.jsx
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../../firebase/firebaseConfig";

import AuthNavbar from './AuthNavbar';
import LoggedInNavbar from './LoggedInNavbar';
import GuestNavbar from './GuestNavbar';

const Navbar = ({ cartCount = 0 }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    
    const location = useLocation();
    const navigate = useNavigate();

    const isAuthPage = location.pathname === "/signup" || location.pathname === "/login";

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
            console.log("Auth state changed:", firebaseUser?.email || "No user");
            setUser(firebaseUser);
            setIsLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchTerm.trim()) {
            navigate(`/?search=${searchTerm}`);
        } else {
            navigate('/');
        }
    };

    if (isLoading) {
        return <div className="h-20 bg-white border-b border-gray-200" />;
    }

    if (isAuthPage) return <AuthNavbar />;

    return user ? (
        <LoggedInNavbar 
            cartCount={cartCount}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            handleSearch={handleSearch}
        />
    ) : (
        <GuestNavbar 
            cartCount={cartCount}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            handleSearch={handleSearch}
        />
    );
};

export default Navbar;