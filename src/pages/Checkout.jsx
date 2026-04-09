import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Lock, ChevronDown, ShieldCheck } from 'lucide-react';
import Success from './Success';
//real cart state should be added here
const MOCK_CART = [
    {
        id: 1,
        brand: 'Apple',
        name: 'iPhone 13 Pro',
        price: 997,
        originalPrice: 1099.99,
        qty: 1,
        image: 'https://cdn.dummyjson.com/products/images/smartphones/iPhone%2013%20Pro/1.webp',
    },
    {
        id: 2,
        brand: 'Apple',
        name: 'iPhone X',
        price: 724,
        originalPrice: 899.99,
        qty: 2,
        image: 'https://cdn.dummyjson.com/products/images/smartphones/iPhone%20X/1.webp',
    },
];

const cities = [  
    'Amman', 'Zarqa', 'Irbid', 'Aqaba', 'Mafraq', 'Ma\'an',
    'Jerash', 'Ajloun', 'Balqa', 'Madaba', 'Karak', 'Tafila'
]

//formatting the price, e.g. $99.00
const fmt = (n) => `$${Number(n).toFixed(2)}`;

//styling each label the same 
const label = ({children}) => (
    <p className="text=[10px] font-semibold text-gray-400 uppercase tracking-widest mb-1.5">{children}</p> 
);

//text input styling 
const TextInput = ({ error, className = '', ...props }) => (
    <input 
        className={`w-full border rounded-lg px-3.5 py-2.5 text-sm text-gray-800 placeholder-gray-300
            outline-none transition-all duration-150
            ${error
                ? 'border-red-300 bg-red-50 focus:border-red-400'
                : 'border-gray-200 bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-50'}
                ${className}`}
        {...props}
    />
);

//error message
const FieldErr = ({ msg }) => 
    msg ? <p className="text-[11px] text-red-500 mt-1">{msg}</p> : null;

//main component
const Checkout = () => {
    const navigate = useNavigate();
    const cart = MOCK_CART; //the cart fetching should be here

    const [form, setForm] = useState({ 
        email: '', phone: '',
        fullName: '', street: '',
        city: 'Amman', postalCode: '',
    });

    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    const set = (field) => (e) => {
        setForm(p => ({ ...p, [field]: e.target.value}));
        setErrors(p => ({ ...p, [field]: ''}));
    }

    const subtotal = cart.reduce((s, i) => s + i.price * i.qty, 0);
    const total = subtotal; 

    const validate = () => {
        const e = {};
        if (!form.email.trim()) e.email = 'Email is required!';
        else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Enter a valid email address!';
        if (!form.phone.trim()) e.phone = 'Phone number is required!';
        if (!form.fullName.trim()) e.fullName = 'Name is required!';
        if (!form.street.trim()) e.street = 'Street address is required!';
        return e;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        const errs = validate();
        if (Object.keys(errs).length) { setErrors(errs); return;}
        setErrors({});
        setLoading(true);
        await new Promise(r => setTimeout(r, 1400));
        setLoading(false);
        navigate('/success');
    };

    return (
        <div className="min-h-screen bg-white flex flex-col">

            {/* top bar */}
            <header className="border-b border-gray-100">
                <div className="w-full px-6 h-14 flex items-center justify-between">
                    <Link to="/" className="font-bold text-gray-900 text-lg tracking-tight">
                        Voltix
                    </Link>
                    <span className="flex items-center gap-1.5 text-xs text-gray-400 font-medium">
                        <ShieldCheck size={13} className="text-gray-400" />
                        Secure Checkout
                    </span>
                </div>
            </header>

            <div className="max-w-xl mx-auto px-6 pt-7 pb-5 w-full">
                <div className="flex items-center gap-2 text-[11px] font-semibold tracking-widest uppercase">
                    <span className="text-blue-600">Information</span>
                    <span className="text-gray-300">/</span>
                    <span className="text-gray-400">Shipping</span>
                    <span className="text-gray-300">/</span>
                    <span className="text-gray-400">Payment</span>
                </div>
            </div>

            {/* form card */}
            <main className="flex-1 flex flex-col items-center px-4 pb-16">
                <form
                    onSubmit={handleSubmit}
                    noValidate
                    className="w-full max-w-xl bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm"
                >
                {/* step 1 - contact */}
                <div className="px-8 pt-8 pb-7 border-b border-gray-100">
                    <p className="text-[9px] font-bold text-gray-400 uppercase tracking-[0.18em] mb-1">
                        Step 01
                    </p>
                    <h2 className="text-[22px] font-bold text-gray-900 mb-6 tracking-tight">
                        Contact Information
                    </h2>

                    <div className="space-y-4">
                        <div>
                            <label>Email Address</label>
                            <TextInput
                                type="email"
                                placeholder="name@company.com"
                                value={form.email}
                                onChange={set('email')}
                                error={errors.email}
                            />
                            <FieldErr msg={errors.email} />
                        </div>
                        <div>
                            <label>Phone Number</label>
                            <TextInput
                                type="tel"
                                placeholder="+962 79 000 0000"
                                value={form.phone}
                                onChange={set('phone')}
                                error={errors.phone}
                            />
                            <FieldErr msg={errors.phone} />
                        </div>
                    </div>
                </div>

                {/* step 2 - shipping */}
                <div className="px-8 pt-7 pb-8">
                    <p className="text-[9px] font-bold text-gray-400 uppercase tracking-[0.18em] mb-1">
                        Step 02
                    </p>
                    <h2 className="text-[22px] font-bold text-gray-900 mb-6 tracking tight">
                        Shipping Address
                    </h2>

                    <div className="space-y-4">
                        {/* full name */}
                        <div>
                            <label>Full Name</label>
                            <TextInput 
                                placeholder="Enter your name"
                                value={form.fullName}
                                onChange={set('fullName')}
                                error={errors.fullName}
                            />
                            <FieldErr msg={errors.fullName} />
                        </div>

                        {/* street */}
                        <div>
                            <label>Street Address</label>
                            <TextInput 
                                placeholder="Apartment, suite, unit, etc."
                                value={form.street}
                                onChange={set('street')}
                                error={errors.street}
                            />
                            <FieldErr msg={errors.street} />
                        </div>

                        {/* city and postal */}
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label>City</label>
                                <div className="relative">
                                    <select
                                        value={form.city}
                                        onChange={set('city')}
                                        className="w-full appearance-none border border-gray-200 rounded-lg px-3.5 py-2.5
                                                text-sm text-gray-800 bg-white outline-none cursor-pointer pr-9
                                                focus:border-blue-500 focus:ring-2 focus:ring-blue-50 transition-all duration-150"
                                        >
                                            {cities.map( c=> <option key={c}>{c}</option>)}
                                    </select>
                                    <ChevronDown
                                        size={14}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                                    />
                                </div>
                            </div>
                            <div>
                                <label>Postal Code</label>
                                    <TextInput 
                                        placeholder="00000"
                                        value={form.postalCode}
                                        onChange={set('postalCode')}
                                        maxLength={5}
                                    />
                            </div>
                        </div>
                    </div>
                </div>

                {/* total */}
                <div className="px-8 py-6 border-t border-gray-100">
                    {/* total row */}
                    <div className="flex items-end justify-between mb-1">
                        <div>
                            <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest mb-0.5">
                                Total Amount
                            </p>
                            <p className="text-[28px] font-bold text-gray-900 leading-none">
                                {fmt(total)}
                            </p>
                        </div>
                        <p className="text-[11px] text-gray-400 pb-1">
                            Inc. VAT &amp; Shipping
                        </p>
                    </div>

                    { /* place order */}
                    <button 
                        type="submit"
                        disabled={loading}
                        className="mt-5 w-full bg-blue-600 hover:bg-blue-700 active:bg-blue-800
                                disabled:opacity-60 disabled:cursor-not-allowed
                                text-white font-semibold py-3.5 rounded-xl text-sm
                                transition-colors duration-200 flex items-center justify-center gap-2"
                    >
                        {loading ? (
                            <>
                                <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                                </svg>
                                Placing your order...
                            </>
                        ) : (
                            <>
                                <Lock size={13} />
                                Place order
                            </>
                        )}
                    </button>
                </div>
                </form>
            </main>

            {/* ── Footer ── */}
            <footer className="border-t border-gray-100 py-5">
                <div className="w-full px-6 flex flex-col sm:flex-row items-center justify-between gap-2">
                    <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-widest">
                        © 2026 Voltix. Engineered for the Future.
                    </p>
                    <div className="flex items-center gap-4 text-[10px] text-gray-400 font-semibold uppercase tracking-widest">
                        <span>Official Distributor Jordan</span>
                        <span className="text-gray-200">·</span>
                        <span>SSL Encrypted</span>
                        <span className="text-gray-200">·</span>
                        <Link to="/support" className="hover:text-gray-600 transition-colors">
                            24/7 Support
                        </Link>
                    </div>
                </div>
            </footer>
        </div>
    )
}

export  default Checkout;