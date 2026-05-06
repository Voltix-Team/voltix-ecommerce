// Navbar.jsx
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

import AuthNavbar from './AuthNavbar';
import LoggedInNavbar from './LoggedInNavbar';
import GuestNavbar from './GuestNavbar';

const Navbar = ({ cartCount = 0 }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const user = useSelector((state) => state.user.data);

    const location = useLocation();
    const navigate = useNavigate();

    const isAuthPage = location.pathname === "/signup" || location.pathname === "/login";

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchTerm.trim()) {
            navigate(`/?search=${searchTerm}`);
        } else {
            navigate('/');
        }
    };

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