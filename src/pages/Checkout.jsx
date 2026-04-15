import { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Lock, ChevronDown, ShieldCheck, CreditCard, Banknote } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { clearCart, selectCartItems, selectCartTotal } from '../redux/cartSlice';
// Added:
import { UserContext } from './UserContext'; 
import { addOrder } from '../redux/orderSlice';

const cities = [
    'Amman', 'Zarqa', 'Irbid', 'Aqaba', 'Mafraq', "Ma'an",
    'Jerash', 'Ajloun', 'Balqa', 'Madaba', 'Karak', 'Tafila'
];

const fmt = (n) => `$${Number(n).toFixed(2)}`;

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

const FieldErr = ({ msg }) =>
    msg ? <p className="text-[11px] text-red-500 mt-1">{msg}</p> : null;

const formatCardNumber = (value) =>
    value.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim();

const formatExpiry = (value) => {
    const digits = value.replace(/\D/g, '').slice(0, 4);
    if (digits.length >= 3) return `${digits.slice(0, 2)}/${digits.slice(2)}`;
    return digits;
};

const detectBrand = (number) => {
    const n = number.replace(/\s/g, '');
    if (/^4/.test(n)) return 'Visa';
    if (/^5[1-5]/.test(n)) return 'Mastercard';
    if (/^3[47]/.test(n)) return 'Amex';
    return null;
};

const Checkout = () => {
    const navigate  = useNavigate();
    const dispatch  = useDispatch();
    const { user } = useContext(UserContext); // Added line
    const cartItems = useSelector(selectCartItems);
    const subtotal  = useSelector(selectCartTotal);
    const total     = subtotal;

    const [form, setForm] = useState({
        email: '', phone: '',
        fullName: '', street: '',
        city: 'Amman', postalCode: '',
    });

    const [paymentMethod, setPaymentMethod] = useState('card');
    const [card, setCard] = useState({
        number: '', name: '', expiry: '', cvv: ''
    });

    const [errors, setErrors]   = useState({});
    const [loading, setLoading] = useState(false);

    const set = (field) => (e) => {
        setForm(p => ({ ...p, [field]: e.target.value }));
        setErrors(p => ({ ...p, [field]: '' }));
    };

    const setCardField = (field, value) => {
        setCard(p => ({ ...p, [field]: value }));
        setErrors(p => ({ ...p, [`card_${field}`]: '' }));
    };

    const validate = () => {
        const e = {};
        if (!form.email.trim()) e.email = 'Email is required';
        else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Enter a valid email address';
        if (!form.phone.trim()) e.phone = 'Phone number is required';
        else if (!/^\+?[\d\s\-()]{7,15}$/.test(form.phone)) e.phone = 'Enter a valid phone number';
        if (!form.fullName.trim()) e.fullName = 'Full name is required';
        if (!form.street.trim()) e.street = 'Street address is required';

        if (paymentMethod === 'card') {
            const rawNumber = card.number.replace(/\s/g, '');
            if (!rawNumber) e.card_number = 'Card number is required';
            else if (rawNumber.length < 16) e.card_number = 'Card number must be 16 digits';
            if (!card.name.trim()) e.card_name = 'Cardholder name is required';
            if (!card.expiry) e.card_expiry = 'Expiry date is required';
            else {
                const [mm, yy] = card.expiry.split('/');
                const month = parseInt(mm, 10);
                const year  = parseInt(`20${yy}`, 10);
                const now   = new Date();
                if (month < 1 || month > 12) e.card_expiry = 'Invalid month';
                else if (year < now.getFullYear() || (year === now.getFullYear() && month < now.getMonth() + 1))
                    e.card_expiry = 'Card has expired';
            }
            if (!card.cvv) e.card_cvv = 'CVV is required';
            else if (!/^\d{3,4}$/.test(card.cvv)) e.card_cvv = 'CVV must be 3 or 4 digits';
        }
        return e;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const errs = validate();
        if (Object.keys(errs).length) { setErrors(errs); return; }
        setErrors({});
        setLoading(true);
        
        // Simulating API call
        await new Promise(r => setTimeout(r, 1400));
        setLoading(false);

        // Updated Logic to save to Redux/History
        const orderData = {
            userEmail: user?.email, 
            items: cartItems,
            subtotal,
            total,
            paymentMethod,
            shipping: {
                fullName: form.fullName,
                street: form.street,
                city: form.city,
                postalCode: form.postalCode,
            },
        };

        dispatch(addOrder(orderData));
        dispatch(clearCart());
        navigate('/success');
    };

    const brand = detectBrand(card.number);

    return (
        <div className="min-h-screen bg-white flex flex-col">
            <header className="border-b border-gray-100">
                <div className="w-full px-6 h-14 flex items-center justify-between">
                    <Link to="/" className="font-bold text-gray-900 text-lg tracking-tight">Voltix</Link>
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
                    <span className="text-blue-600">Shipping</span>
                    <span className="text-gray-300">/</span>
                    <span className="text-blue-600">Payment</span>
                </div>
            </div>

            {cartItems.length > 0 && (
                <div className="max-w-xl mx-auto px-6 w-full mb-2">
                    <div className="bg-gray-50 border border-gray-200 rounded-xl px-6 py-4 space-y-2">
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">
                            Order Items ({cartItems.length})
                        </p>
                        {cartItems.map(item => (
                            <div key={item.id} className="flex items-center justify-between text-sm text-gray-700">
                                <div className="flex items-center gap-3">
                                    <img
                                        src={item.thumbnail || item.image}
                                        alt={item.title || item.name}
                                        className="w-10 h-10 object-cover rounded-lg bg-gray-200"
                                    />
                                    <span className="font-medium">
                                        {item.title || item.name}
                                        <span className="text-gray-400 font-normal"> × {item.quantity}</span>
                                    </span>
                                </div>
                                <span className="font-semibold">{fmt(item.price * item.quantity)}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <main className="flex-1 flex flex-col items-center px-4 pb-16 pt-4">
                <form
                    onSubmit={handleSubmit}
                    noValidate
                    className="w-full max-w-xl bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm"
                >
                    <div className="px-8 pt-8 pb-7 border-b border-gray-100">
                        <p className="text-[9px] font-bold text-gray-400 uppercase tracking-[0.18em] mb-1">Step 01</p>
                        <h2 className="text-[22px] font-bold text-gray-900 mb-6 tracking-tight">Contact Information</h2>
                        <div className="space-y-4">
                            <div>
                                <label className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest mb-1.5 block">Email Address</label>
                                <TextInput type="email" placeholder="name@company.com" value={form.email} onChange={set('email')} error={errors.email} />
                                <FieldErr msg={errors.email} />
                            </div>
                            <div>
                                <label className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest mb-1.5 block">Phone Number</label>
                                <TextInput type="tel" placeholder="+962 79 000 0000" value={form.phone} onChange={set('phone')} error={errors.phone} />
                                <FieldErr msg={errors.phone} />
                            </div>
                        </div>
                    </div>

                    <div className="px-8 pt-7 pb-8 border-b border-gray-100">
                        <p className="text-[9px] font-bold text-gray-400 uppercase tracking-[0.18em] mb-1">Step 02</p>
                        <h2 className="text-[22px] font-bold text-gray-900 mb-6 tracking-tight">Shipping Address</h2>
                        <div className="space-y-4">
                            <div>
                                <label className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest mb-1.5 block">Full Name</label>
                                <TextInput placeholder="Enter your name" value={form.fullName} onChange={set('fullName')} error={errors.fullName} />
                                <FieldErr msg={errors.fullName} />
                            </div>
                            <div>
                                <label className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest mb-1.5 block">Street Address</label>
                                <TextInput placeholder="Apartment, suite, unit, etc." value={form.street} onChange={set('street')} error={errors.street} />
                                <FieldErr msg={errors.street} />
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest mb-1.5 block">City</label>
                                    <div className="relative">
                                        <select
                                            value={form.city}
                                            onChange={set('city')}
                                            className="w-full appearance-none border border-gray-200 rounded-lg px-3.5 py-2.5
                                                text-sm text-gray-800 bg-white outline-none cursor-pointer pr-9
                                                focus:border-blue-500 focus:ring-2 focus:ring-blue-50 transition-all duration-150"
                                        >
                                            {cities.map(c => <option key={c}>{c}</option>)}
                                        </select>
                                        <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                                    </div>
                                </div>
                                <div>
                                    <label className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest mb-1.5 block">Postal Code</label>
                                    <TextInput placeholder="00000" value={form.postalCode} onChange={set('postalCode')} maxLength={5} />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="px-8 pt-7 pb-8 border-b border-gray-100">
                        <p className="text-[9px] font-bold text-gray-400 uppercase tracking-[0.18em] mb-1">Step 03</p>
                        <h2 className="text-[22px] font-bold text-gray-900 mb-6 tracking-tight">Payment</h2>

                        <div className="grid grid-cols-2 gap-3 mb-6">
                            <button
                                type="button"
                                onClick={() => setPaymentMethod('card')}
                                className={`flex items-center gap-3 border-2 rounded-xl px-4 py-3.5 transition-all
                                    ${paymentMethod === 'card'
                                        ? 'border-blue-600 bg-blue-50'
                                        : 'border-gray-200 hover:border-gray-300'}`}
                            >
                                <CreditCard size={20} className={paymentMethod === 'card' ? 'text-blue-600' : 'text-gray-400'} />
                                <div className="text-left">
                                    <p className={`text-sm font-bold ${paymentMethod === 'card' ? 'text-blue-600' : 'text-gray-700'}`}>
                                        Credit Card
                                    </p>
                                    <p className="text-[10px] text-gray-400">Visa, Mastercard</p>
                                </div>
                            </button>

                            <button
                                type="button"
                                onClick={() => setPaymentMethod('cash')}
                                className={`flex items-center gap-3 border-2 rounded-xl px-4 py-3.5 transition-all
                                    ${paymentMethod === 'cash'
                                        ? 'border-blue-600 bg-blue-50'
                                        : 'border-gray-200 hover:border-gray-300'}`}
                            >
                                <Banknote size={20} className={paymentMethod === 'cash' ? 'text-blue-600' : 'text-gray-400'} />
                                <div className="text-left">
                                    <p className={`text-sm font-bold ${paymentMethod === 'cash' ? 'text-blue-600' : 'text-gray-700'}`}>
                                        Cash on Delivery
                                    </p>
                                    <p className="text-[10px] text-gray-400">Pay when you receive</p>
                                </div>
                            </button>
                        </div>

                        {paymentMethod === 'card' && (
                            <div className="space-y-4">
                                <div>
                                    <label className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest mb-1.5 block">
                                        Card Number
                                    </label>
                                    <div className="relative">
                                        <TextInput
                                            placeholder="0000 0000 0000 0000"
                                            value={card.number}
                                            onChange={e => setCardField('number', formatCardNumber(e.target.value))}
                                            error={errors.card_number}
                                            inputMode="numeric"
                                        />
                                        {brand && (
                                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">
                                                {brand}
                                            </span>
                                        )}
                                    </div>
                                    <FieldErr msg={errors.card_number} />
                                </div>

                                <div>
                                    <label className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest mb-1.5 block">
                                        Cardholder Name
                                    </label>
                                    <TextInput
                                        placeholder="Name as on card"
                                        value={card.name}
                                        onChange={e => setCardField('name', e.target.value)}
                                        error={errors.card_name}
                                    />
                                    <FieldErr msg={errors.card_name} />
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest mb-1.5 block">
                                            Expiry Date
                                        </label>
                                        <TextInput
                                            placeholder="MM/YY"
                                            value={card.expiry}
                                            onChange={e => setCardField('expiry', formatExpiry(e.target.value))}
                                            error={errors.card_expiry}
                                            inputMode="numeric"
                                            maxLength={5}
                                        />
                                        <FieldErr msg={errors.card_expiry} />
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest mb-1.5 block">
                                            CVV
                                        </label>
                                        <TextInput
                                            placeholder="•••"
                                            value={card.cvv}
                                            onChange={e => setCardField('cvv', e.target.value.replace(/\D/g, '').slice(0, 4))}
                                            error={errors.card_cvv}
                                            inputMode="numeric"
                                            type="password"
                                            maxLength={4}
                                        />
                                        <FieldErr msg={errors.card_cvv} />
                                    </div>
                                </div>

                                <div className="flex items-center gap-2 text-[11px] text-gray-400 mt-1">
                                    <Lock size={11} />
                                    <span>Your card details are encrypted and never stored</span>
                                </div>
                            </div>
                        )}

                        {paymentMethod === 'cash' && (
                            <div className="bg-amber-50 border border-amber-200 rounded-xl px-5 py-4 text-sm text-amber-800">
                                <p className="font-semibold mb-1">Cash on Delivery selected</p>
                                <p className="text-[12px] text-amber-600">
                                    Please have the exact amount of <strong>{fmt(total)}</strong> ready when your order arrives.
                                </p>
                            </div>
                        )}
                    </div>

                    <div className="px-8 py-6">
                        <div className="flex items-end justify-between mb-1">
                            <div>
                                <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest mb-0.5">Total Amount</p>
                                <p className="text-[28px] font-bold text-gray-900 leading-none">{fmt(total)}</p>
                            </div>
                            <p className="text-[11px] text-gray-400 pb-1">Inc. VAT & Shipping</p>
                        </div>

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
                                    {paymentMethod === 'card' ? 'Pay & Place Order' : 'Place Order'}
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </main>

            {/* footer — unchanged */}
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
                        <Link to="/support" className="hover:text-gray-600 transition-colors">24/7 Support</Link>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Checkout;