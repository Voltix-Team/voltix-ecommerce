import React, { createContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebase/firebaseConfig';
import { onAuthStateChanged, signOut, updateProfile } from 'firebase/auth';

export const UserContext = createContext(undefined);

const buildUser = (firebaseUser) => ({
    uid: firebaseUser.uid,
    name: firebaseUser.displayName || firebaseUser.email.split('@')[0],
    email: firebaseUser.email,
    phone: '',
    avatar: firebaseUser.photoURL || null,
    memberSince: firebaseUser.metadata?.creationTime
        ? new Date(firebaseUser.metadata.creationTime).toLocaleDateString('en-US', {
            month: 'long', year: 'numeric'
          })
        : 'Unknown',
    address: { street: '', suite: '', city: '', state: '', zip: '', country: '' },
});

export const UserProvider = ({ children }) => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
            setUser(firebaseUser ? buildUser(firebaseUser) : null);
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    // Updates Firebase Auth displayName only — no Firestore needed
    const updateUser = async (fields) => {
        const firebaseUser = auth.currentUser;
        if (!firebaseUser) return;
        if (fields.name && fields.name !== firebaseUser.displayName) {
            await updateProfile(firebaseUser, { displayName: fields.name });
        }
        setUser(prev => ({ ...prev, ...fields }));
    };

    const logout = async () => {
        await signOut(auth);
        setUser(null);
        navigate('/');
    };

    return (
        <UserContext.Provider value={{ user, logout, loading, updateUser }}>
            {children}
        </UserContext.Provider>
    );
};