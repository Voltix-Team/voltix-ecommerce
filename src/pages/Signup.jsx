import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom"; 
import { auth } from "../firebase/firebaseConfig"; 
import { createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import Button from "../components/UI/Button";
import Input from "../components/UI/Input";
import energyBg from '../assets/left-side-image.png';
import Home from '../pages/Home';


const Signup = () => {
    const navigate = useNavigate();
    const [error, setError] = useState("");
    const [formData, setFormData] = useState({
        fullname: "",
        email: "",
        password: "",
        confirmPassword: ""
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSignup = async (e) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            return setError("Passwords do not match");
        }
        try {
            await createUserWithEmailAndPassword(auth, formData.email, formData.password);
            navigate("/Home"); 
        } catch (error) {
            setError(error.message);
        }
    };

    const handleGoogleSignup = async () => {
        const provider = new GoogleAuthProvider();
        try {
            await signInWithPopup(auth, provider);
            navigate("/Home");
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="flex-1 flex items-center justify-center overflow-hidden">
        <div className="w-full max-w-4xl bg-white rounded-sm shadow-none overflow-hidden flex max-h-[85vh] border border-slate-100">
            {/* LEFT SIDE */}
            <div 
                className="hidden lg:flex lg:w-5/12 relative p-8 flex-col justify-between text-white"
                style={{ backgroundImage: `linear-gradient(to bottom, rgba(15, 23, 42, 0.4), #0F172A), url(${energyBg})`, backgroundSize: 'cover' }}
            >
                <div className="relative z-10">
                    <p className="text-[10px] font-bold uppercase tracking-widest mb-4 opacity-70">Voltix</p>
                    <h1 className="text-3xl font-bold mb-2">Hardware for the Future You.</h1>
                    <p className="text-slate-300 text-xs max-w-[200px] leading-relaxed">Elite Tech for the Modern Mind</p>
                </div>
                <div className="relative z-10 text-[9px] uppercase tracking-widest text-slate-400 font-bold flex items-center gap-2">
                    <span className="w-4 h-4 rounded-full border border-slate-600 flex items-center justify-center text-[7px]">✓</span>
                    End-to-End Encrypted Access
                </div>
            </div>

            {/* RIGHT SIDE */}
            <div className="w-full lg:w-7/12 p-6 md:p-8 flex flex-col justify-center bg-white overflow-y-auto">
                <header className="mb-4">
                    <h1 className="text-xl font-bold text-slate-900">Create Account</h1>
                    <p className="text-slate-400 text-[11px]">Master Your Tech</p>
                    {error && <p className="text-red-500 text-[9px] font-bold mt-1">{error}</p>}
                </header>

                <form className="space-y-2" onSubmit={handleSignup}>
                    <Input label="FULL NAME" name="fullname" placeholder="user user" onChange={handleChange} />
                    <Input label="EMAIL" name="email" type="email" placeholder="aman@voltix.com" onChange={handleChange} />
                    <div className="grid grid-cols-2 gap-3">
                        <Input label="PASSWORD" name="password" type="password" placeholder="••••••••" onChange={handleChange} />
                        <Input label="CONFIRM" name="confirmPassword" type="password" placeholder="••••••••" onChange={handleChange} />
                    </div>
                    <div className="flex items-center gap-2 py-1">
                        <input type="checkbox" required className="w-3 h-3 rounded text-blue-600" />
                        <p className="text-[9px] text-slate-500">I agree to the <span className="text-blue-600 font-bold">Terms & Privacy</span>.</p>
                    </div>
                    <Button className="w-full py-2 text-xs font-bold">Create Account</Button>
                </form>

                <div className="relative my-4 text-center">
                    <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-slate-50"></span></div>
                    <span className="relative bg-white px-2 text-[8px] text-slate-400 font-bold uppercase">Or sign up with</span>
                </div>

                <div className="flex gap-2">
                    <button onClick={handleGoogleSignup} type="button" className="flex-1 flex items-center justify-center gap-2 border border-slate-200 py-1.5 rounded-lg text-[9px] font-bold text-slate-600">
                        <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="G" className="w-3 h-3" /> GOOGLE
                    </button>
                    <button type="button" className="flex-1 flex items-center justify-center gap-2 border border-slate-200 py-1.5 rounded-lg text-[9px] font-bold text-slate-600">
                        <img src="https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg" alt="A" className="w-3 h-3" /> APPLE
                    </button>
                </div>
                
                <footer className="mt-4 text-center">
                    <p className="text-slate-400 text-[10px]">Already have an account? <Link to="/login" className="text-blue-600 font-bold hover:underline">Log In</Link></p>
                </footer>
            </div>
        </div>
        </div>
    );
};

export default Signup;