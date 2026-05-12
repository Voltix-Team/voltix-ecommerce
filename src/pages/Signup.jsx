// Signup.jsx
// Previously used Firebase createUserWithEmailAndPassword.
// Now dispatches registerUser thunk which calls POST /api/auth/register/
// On success: Django creates the account and sends a 6-digit OTP to the email.
// Then redirects to /verify-email so the user can enter the OTP.
// Note: username field added (Django requires it alongside email).

import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import { registerUser } from '../redux/userSlice';  // ← Django register thunk
import { FcGoogle } from 'react-icons/fc';
import { FaApple } from 'react-icons/fa';
import Button from "../components/UI/Button";
import Input from "../components/UI/Input";
import energyBg from '../assets/left-side-image.png';

const Signup = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    // loading from Redux — true while the register request is in progress
    const { loading } = useSelector((state) => state.user);

    const [error, setError] = useState("");
    const [formData, setFormData] = useState({
        username: "", email: "", password: "", confirmPassword: ""
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSignup = async (e) => {
        e.preventDefault();
        setError("");

        // basic client-side password match check before calling the API
        if (formData.password !== formData.confirmPassword) {
            return setError("Passwords do not match.");
        }

        // dispatch registerUser — calls POST /api/auth/register/
        // sends username, email, password, password2 to Django
        const result = await dispatch(registerUser({
            username:  formData.username,
            email:     formData.email,
            password:  formData.password,
            password2: formData.confirmPassword,
        }));

        if (registerUser.fulfilled.match(result)) {
            // account created — redirect to verify email page
            // pass email via router state so the OTP form is pre-filled
            navigate('/verify-email', { state: { email: formData.email } });
        } else {
            // extract Django validation errors and show them
            const err = result.payload;
            if (err?.email)         setError(err.email[0]);
            else if (err?.username) setError(err.username[0]);
            else if (err?.password) setError(err.password[0]);
            else setError("Signup failed. Please try again.");
        }
    };

    return (
        <div className="flex-1 flex items-center justify-center overflow-hidden">
            <div className="w-full max-w-4xl bg-white rounded-sm shadow-none overflow-hidden flex max-h-[85vh] border border-slate-100">
                {/* Left decorative side */}
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

                {/* Right form side */}
                <div className="w-full lg:w-7/12 p-6 md:p-8 flex flex-col justify-center bg-white overflow-y-auto">
                    <header className="mb-4">
                        <h1 className="text-xl font-bold text-slate-900">Create Account</h1>
                        <p className="text-slate-400 text-[11px]">Master Your Tech</p>
                        {error && <p className="text-red-500 text-[9px] font-bold mt-1">{error}</p>}
                    </header>

                    <form className="space-y-2" onSubmit={handleSignup}>
                        {/* username field — required by Django, was not in Firebase signup */}
                        <Input label="USERNAME"  name="username"        placeholder="johndoe"    onChange={handleChange} />
                        <Input label="EMAIL"     name="email"    type="email" placeholder="aman@voltix.com" onChange={handleChange} />
                        <div className="grid grid-cols-2 gap-3">
                            <Input label="PASSWORD" name="password"        type="password" placeholder="••••••••" onChange={handleChange} />
                            <Input label="CONFIRM"  name="confirmPassword" type="password" placeholder="••••••••" onChange={handleChange} />
                        </div>
                        <div className="flex items-center gap-2 py-1">
                            <input type="checkbox" required className="w-3 h-3 rounded text-blue-600" />
                            <p className="text-[9px] text-slate-500">I agree to the <span className="text-blue-600 font-bold">Terms & Privacy</span>.</p>
                        </div>
                        <Button type="submit" className="w-full py-2 text-xs font-bold" disabled={loading}>
                            {loading ? 'Creating account...' : 'Create Account'}
                        </Button>
                    </form>

                    <footer className="mt-4 text-center">
                        <p className="text-slate-400 text-[10px]">Already have an account? <Link to="/login" className="text-blue-600 font-bold hover:underline">Log In</Link></p>
                    </footer>
                </div>
            </div>
        </div>
    );
};

export default Signup;