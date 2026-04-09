import React, { createContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';

// Create the context
export const UserContext = createContext(undefined);

// Create a provider component
export const UserProvider = ({ children }) => {
    const navigate = useNavigate();
  // Mock user data and replace with data from the backend
  const [user, setUser] = useState({
    name: 'Jonathan Sterling',
    memberSince: 'January 2024',
    email: 'j.sterling@voltix-industries.com',
    phone: '+1 (555) 012-3456',
    avatar: '#',
    address: {
      street: '7824 Industrial Parkway',
      suite: 'Suite 400, Tech District',
      city: 'San Francisco',
      state: 'CA',
      zip: '94103',
      country: 'United States'
    }
  });

  const logout = () => {
    console.log("Logging out...");
    setUser(null);
    navigate('/');
  };

  return (
    <UserContext.Provider value={{ user, logout }}>
      {children}
    </UserContext.Provider>
  );
};