import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FcGoogle } from 'react-icons/fc';        
import { FaApple } from 'react-icons/fa';
import { auth } from "../firebase/firebaseConfig";
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import Button from "../components/UI/Button";
import Input from "../components/UI/Input";
import { HelpCircle } from "lucide-react";
import logo from "../assets/Logo.png";

const Login = () => {
    const navigate = useNavigate();
    const [error, setError] = useState("");
    const [formData, setFormData] = useState({ email: "", password: "" });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    
    try {
        await signInWithEmailAndPassword(auth, formData.email, formData.password);
        console.log("Login successful!");   // For debugging
        navigate("/"); 
    } catch (err) {
        console.error(err);
        setError("Invalid email or password.");
    }
};

    return (
        <div className="flex-1 flex items-center justify-center overflow-hidden">
        <div className="w-full max-w-[340px] bg-white rounded-sm shadow-2xl p-6 flex flex-col border border-white/50">
            <header className="mb-6">
                <p className="text-blue-600 text-[9px] font-bold uppercase tracking-widest mb-1">Voltix Auth</p>
                <h1 className="text-2xl font-bold text-slate-800">Log In</h1>
                <p className="text-slate-400 text-[11px]">Hardware for the Future You.</p>
                {error && <p className="text-red-500 text-[9px] font-bold mt-1">{error}</p>}
            </header>

            <form onSubmit={handleLogin} className="space-y-3">
                <Input label="EMAIL" name="email" type="email" placeholder="name@company.com" onChange={handleChange} />
                <div className="relative">
                    <Input label="PASSWORD" name="password" type="password" placeholder="••••••••" onChange={handleChange} />
                    <Button
                        type="button"
                        variant="textLink"
                        className="absolute right-0 top-0">
                            Forgot?
                    </Button>
                </div>
                <Button 
                    type="submit" 
                    className="w-full py-2.5 mt-2 text-xs font-bold"
                >
                    Log In
                </Button>
            </form>

            <div className="relative my-6 text-center">
                <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-slate-50"></span></div>
                <span className="relative bg-white px-2 text-[8px] text-slate-400 font-bold uppercase">Or log in with</span>
            </div>

            <div className="flex gap-2 mb-6">
                <Button type="button" variant="social">
                    <FcGoogle className="w-4 h-4" /> Google
                </Button>
                <Button type="button" variant="social">
                    <FaApple className="w-4 h-4" />Apple
                </Button>
            </div>

            <footer className="text-center">
                <p className="text-slate-400 text-[10px]">No account? <Link to="/signup" className="text-blue-600 font-bold">Sign Up</Link></p>
            </footer>
        </div>
        </div>
    );
};

export default Login;