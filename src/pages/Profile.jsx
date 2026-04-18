import React, { useContext, useState, useEffect } from 'react';
import { Edit, MapPin, CheckCircle2, X, Phone, User, Home } from 'lucide-react';
import { UserContext } from './UserContext';
import OrderCard from '../components/UI/OrderCard';
import { useSelector } from 'react-redux';
import { selectAllOrders } from '../redux/orderSlice';
import Button from '../components/UI/Button';
import Input from '../components/UI/Input';

const ProfilePage = () => {
    const { user, logout, loading, updateUser } = useContext(UserContext);
    
    const allOrders = useSelector(selectAllOrders);

    const [modalOpen, setModalOpen] = useState(false);
    const [saving, setSaving] = useState(false);
    const [toast, setToast] = useState(false);
    const [errors, setErrors] = useState({});
    const [form, setForm] = useState({});

    // Filter and sort user's orders (newest first)
    const userOrders = allOrders
        .filter(o => o.userEmail === user?.email)
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    const openModal = () => {
        setForm({
            name:    user.name    || '',
            phone:   user.phone   || '',
            street:  user.address?.street  || '',
            suite:   user.address?.suite   || '',
            city:    user.address?.city    || '',
            state:   user.address?.state   || '',
            zip:     user.address?.zip     || '',
            country: user.address?.country || '',
        });
        setErrors({});
        setModalOpen(true);
    };

    const set = field => value => setForm(p => ({ ...p, [field]: value }));

    const validate = () => {
        const e = {};
        if (!form.name?.trim()) e.name = 'Name is required';
        if (form.phone && !/^\+?[\d\s\-()]{7,15}$/.test(form.phone))
            e.phone = 'Enter a valid phone number';
        return e;
    };

    const handleSave = async () => {
        const errs = validate();
        if (Object.keys(errs).length) {
            setErrors(errs);
            return;
        }

        setSaving(true);
        await updateUser({
            name: form.name,
            phone: form.phone,
            address: {
                street: form.street,
                suite: form.suite,
                city: form.city,
                state: form.state,
                zip: form.zip,
                country: form.country,
            },
        });
        setSaving(false);
        setModalOpen(false);
        setToast(true);
        setTimeout(() => setToast(false), 2500);
    };

    if (loading) return <div className="min-h-screen flex items-center justify-center">Loading profile...</div>;
    if (!user) return <div className="min-h-screen flex items-center justify-center">You are not logged in.</div>;

    const addressParts = [
        user.address?.street,
        user.address?.suite,
        [user.address?.city, user.address?.state, user.address?.zip].filter(Boolean).join(', '),
        user.address?.country,
    ].filter(p => p && p.trim());

    return (
        <main className="max-w-6xl mx-auto px-6 py-12 bg-[#F8FAFC] min-h-screen">
            {/* Success Toast */}
            {toast && (
                <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-gray-900 text-white px-5 py-3.5 rounded-2xl shadow-xl flex items-center gap-3">
                    <CheckCircle2 size={18} className="text-green-400" />
                    <p className="text-sm font-semibold">Profile updated successfully!</p>
                </div>
            )}

            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-6">
                <div className="flex items-center gap-6">
                    <div className="w-24 h-24 bg-white border-2 border-blue-600 rounded-xl overflow-hidden flex items-center justify-center">
                        {user.avatar ? (
                            <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                        ) : (
                            <span className="text-3xl font-bold text-blue-600">{user.name?.charAt(0).toUpperCase()}</span>
                        )}
                    </div>
                    <div>
                        <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">{user.name}</h1>
                        <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mt-2">
                            Member Since: {user.memberSince}
                        </p>
                    </div>
                </div>

                <div className="flex gap-4 w-full md:w-auto">
                    <Button onClick={logout} >
                        Logout
                    </Button>
                    <Button onClick={openModal}>
                        Update Profile
                    </Button>
                </div>
            </div>

            {/* Info Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Personal Information */}
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                    <div className="flex justify-between items-center mb-8">
                        <h2 className="text-xl font-bold text-gray-900">Personal Information</h2>
                        <Button 
                            variant="icon" 
                            onClick={openModal} 
                            className="text-[#0066FF] hover:text-blue-800">
                                <Edit size={20} strokeWidth={2.5} />
                        </Button>
                    </div>
                    <div className="space-y-6">
                        <div><p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Full Name</p><p className="font-medium">{user.name}</p></div>
                        <div><p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Email Address</p><p className="font-medium">{user.email}</p></div>
                        <div>
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Phone Number</p>
                            {user.phone ? <p className="font-medium">{user.phone}</p> : (
                                <Button 
                                    variant="plain" 
                                    onClick={openModal} 
                                    className="text-blue-600 text-sm font-semibold hover:underline">
                                        Add phone number
                                </Button>
                            )}
                        </div>
                    </div>
                </div>

                {/* Shipping Address */}
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                    <div className="flex justify-between items-center mb-8">
                        <h2 className="text-xl font-bold text-gray-900">Shipping Address</h2>
                    </div>
                    <div className="flex items-start gap-3">
                        <MapPin className="text-[#0066FF] mt-0.5" size={20} />
                        <div className="text-gray-700 font-medium leading-relaxed">
                            {addressParts.length > 0 ? addressParts.map((line, i) => <p key={i}>{line}</p>) : (
                                <Button 
                                    variant="plain" 
                                    onClick={openModal} 
                                    className="text-blue-600 text-sm font-semibold hover:underline">
                                        Add shipping address
                                </Button>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Order History */}
            <section className="mt-12">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Order History ({userOrders.length})</h2>
                {userOrders.length === 0 ? (
                    <div className="bg-white border border-gray-100 rounded-2xl p-12 text-center">
                        <p className="text-gray-400">You haven't placed any orders yet.</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {userOrders.map(order => (
                            <OrderCard key={order.id} order={order} />
                        ))}
                    </div>
                )}
            </section>

            {/* Edit Modal */}
            {modalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
                    <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden">
                        <div className="flex items-center justify-between px-8 pt-7 pb-5 border-b">
                            <div>
                                <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Account</p>
                                <h3 className="text-xl font-bold">Update Profile</h3>
                            </div>
                            <Button variant="icon" onClick={() => setModalOpen(false)}>
                                <X size={20} className="text-gray-400 hover:text-gray-600" />
                            </Button>                        
                        </div>

                        <div className="px-8 py-6 space-y-6 max-h-[65vh] overflow-y-auto">
                            <div>
                                <div className="flex items-center gap-2 mb-4">
                                    <User size={14} className="text-blue-600" />
                                    <p className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">Personal</p>
                                </div>
                                <div className="space-y-4">
                                    <Input label="Full Name" name="name" value={form.name} onChange={set('name')} error={errors.name} />
                                    <Input label="Phone Number" name="phone" value={form.phone} onChange={set('phone')} type="tel" placeholder="+962 79 000 0000" error={errors.phone} />
                                </div>
                            </div>

                            <div>
                                <div className="flex items-center gap-2 mb-4">
                                    <Home size={14} className="text-blue-600" />
                                    <p className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">Shipping Address</p>
                                </div>
                                <div className="space-y-4">
                                    <Input label="Street Address" name="street" value={form.street} onChange={set('street')} placeholder="123 Main St" />
                                    <Input label="Suite / Apt (optional)" name="suite" value={form.suite} onChange={set('suite')} placeholder="Suite 400" />
                                    <div className="grid grid-cols-2 gap-3">
                                        <Input label="City" name="city" value={form.city} onChange={set('city')} placeholder="Amman" />
                                        <Input label="State / Region" name="state" value={form.state} onChange={set('state')} placeholder="Amman" />
                                    </div>
                                    <div className="grid grid-cols-2 gap-3">
                                        <Input label="Postal Code" name="zip" value={form.zip} onChange={set('zip')} placeholder="00000" />
                                        <Input label="Country" name="country" value={form.country} onChange={set('country')} placeholder="Jordan" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="px-8 py-5 border-t flex gap-3">
                            <Button onClick={() => setModalOpen(false)} className="flex-1 py-2.5 ">Cancel</Button>
                            <Button onClick={handleSave} disabled={saving} className="flex-1 py-2.5 ">
                                {saving ? 'Saving...' : 'Save Changes'}
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </main>
    );
};

export default ProfilePage;