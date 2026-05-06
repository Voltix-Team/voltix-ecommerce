// VerifyEmail.jsx
// New page added after removing Firebase.
// Firebase handled email verification automatically.
// With Django we send a 6-digit OTP to the user's email after signup.
// This page collects the OTP and sends it to POST /api/auth/verify-email/
// After success, user is redirected to /login.

import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { verifyEmail } from "../redux/userSlice";  // ← calls Django verify-email endpoint
import Button from "../components/UI/Button";
import Input from "../components/UI/Input";

const VerifyEmail = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const location = useLocation();

    // Signup.jsx passes the email via router state so the field is pre-filled
    // user doesn't have to type their email again
    const [formData, setFormData] = useState({
        email: location.state?.email || "",
        otp:   "",
    });

    const [error,   setError]   = useState("");
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleVerify = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        // dispatch verifyEmail thunk — calls POST /api/auth/verify-email/
        const result = await dispatch(verifyEmail(formData));
        setLoading(false);

        if (verifyEmail.fulfilled.match(result)) {
            // verification succeeded — show success then redirect to login
            setSuccess(true);
            setTimeout(() => navigate("/login"), 2000);
        } else {
            // show error from Django (invalid OTP, expired, etc.)
            const err = result.payload;
            setError(err?.error || err?.non_field_errors?.[0] || "Verification failed.");
        }
    };

    return (
        <div className="flex-1 flex items-center justify-center">
            <div className="w-full max-w-[340px] bg-white rounded-sm shadow-2xl p-6 flex flex-col border border-white/50">
                <header className="mb-6">
                    <p className="text-blue-600 text-[9px] font-bold uppercase tracking-widest mb-1">Voltix Auth</p>
                    <h1 className="text-2xl font-bold text-slate-800">Verify Email</h1>
                    <p className="text-slate-400 text-[11px]">Enter the 6-digit code sent to your email.</p>
                    {error   && <p className="text-red-500 text-[9px] font-bold mt-1">{error}</p>}
                    {success && <p className="text-green-500 text-[9px] font-bold mt-1">Verified! Redirecting to login...</p>}
                </header>

                <form onSubmit={handleVerify} className="space-y-3">
                    <Input
                        label="EMAIL"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="your@email.com"
                    />
                    <Input
                        label="VERIFICATION CODE"
                        name="otp"
                        value={formData.otp}
                        onChange={handleChange}
                        placeholder="123456"
                    />
                    <Button type="submit" className="w-full py-2.5 mt-2 text-xs font-bold" disabled={loading}>
                        {loading ? 'Verifying...' : 'Verify Email'}
                    </Button>
                </form>
            </div>
        </div>
    );
};

export default VerifyEmail;