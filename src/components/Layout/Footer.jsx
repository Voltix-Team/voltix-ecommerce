import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom"; // Hook to check the current URL
import { Share2, Globe } from "lucide-react";
import { auth } from "../../firebase/firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";

const Footer = () => {
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

    // NEW : Check if we are currently on the Login or Signup page
    const isAuthPage =  location.pathname === "/signup" ||  location.pathname === "/Login";;

    return (
        <footer className="bg-[#f4f7f9] py-8 px-12 border-t border-gray-300">
            {/* Only show the DETAILED footer if:
               1. The user is logged in
               2. AND we are NOT on a Login/Signup page
            */}
            {user && !isAuthPage ? (
                /* --- DETAILED FOOTER (Authenticated & on Shop/Home) --- */
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-4 gap-8 mb-10">
                        <div>
                            <h2 className="font-bold text-xl mb-4">Voltix</h2>
                            <p className="text-xs text-gray-500 leading-relaxed">
                                Premium electronics and accessories designed for high-performance lifestyles.
                            </p>
                        </div>
                        <div>
                            <h4 className="text-blue-500 text-xs font-bold mb-4">EXPLORE</h4>
                            <ul className="text-xs space-y-2 text-gray-600">
                                <li>PRIVACY POLICY</li>
                                <li>TERMS OF SERVICE</li>
                                <li>SHIPPING</li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="text-blue-500 text-xs font-bold mb-4">SUPPORT</h4>
                            <ul className="text-xs space-y-2 text-gray-600">
                                <li>SUPPORT</li>
                                <li>SUSTAINABILITY</li>
                                <li>CONTACT</li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="text-blue-500 text-xs font-bold mb-4">SOCIAL</h4>
                            <div className="flex gap-1">
                                <Share2 size={20} strokeWidth={1.5} />
                                <Globe size={20} strokeWidth={1.5} />
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                /* --- SHORT FOOTER (Guest OR anyone on Login/Signup pages) --- */
                <div className="max-w-7xl mx-auto flex justify-between items-center text-[10px] text-gray-500">
                    <p>© 2026 VOLTIX. ALL RIGHTS RESERVED.</p>
                    <div className="flex gap-6 uppercase">
                        <span>Terms of Service</span>
                        <span>Privacy Policy</span>
                        <span>Contact Support</span>
                    </div>
                </div>
            )}
        </footer>
    );
};

export default Footer;