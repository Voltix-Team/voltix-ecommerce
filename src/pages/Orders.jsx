import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Package } from 'lucide-react';
import OrderCard from '../components/UI/OrderCard';

const ORDERS_KEY = 'voltix_orders';

const Orders = () => {
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);

    const loadOrders = () => {
        try {
            const saved = JSON.parse(localStorage.getItem(ORDERS_KEY)) || [];
            setOrders(saved.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
        } catch (err) {
            console.error(err);
            setOrders([]);
        }
    };

    useEffect(() => {
        loadOrders();
    }, []);

    return (
        <div className="max-w-3xl mx-auto px-6 py-12 min-h-screen">
            <div className="mb-10">
                <h1 className="text-4xl font-bold text-gray-900">My Orders</h1>
                <p className="text-gray-500 mt-2">
                    {orders.length > 0
                        ? `You have ${orders.length} ${orders.length === 1 ? 'order' : 'orders'}`
                        : 'No orders placed yet'}
                </p>
            </div>

            {orders.length > 0 ? (
                <div className="space-y-4">
                    {orders.map((order) => (
                        <OrderCard key={order.id} order={order} />
                    ))}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center py-24 text-center">
                    <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 mb-6">
                        <Package className="w-10 h-10 text-gray-300" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">No orders yet</h3>
                    <p className="text-gray-500 mb-8 max-w-sm">
                        Looks like you haven't placed any orders. Start shopping and your orders will appear here.
                    </p>
                    <button
                        onClick={() => navigate('/')}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-xl transition-colors text-sm"
                    >
                        Start Shopping
                    </button>
                </div>
            )}
        </div>
    );
};

export default Orders;