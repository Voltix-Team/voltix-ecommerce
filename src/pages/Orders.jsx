import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Package } from 'lucide-react';
import OrderCard from '../components/UI/OrderCard';
import Button from '../components/UI/Button';
import { selectAllOrders } from '../redux/orderSlice';

const Orders = () => {
    const navigate = useNavigate();
    const orders = useSelector(selectAllOrders);

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
                    {orders.map((order, i) => (
                        <OrderCard key={order.id ?? i} order={order} />
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
                    <Button onClick={() => navigate('/')}>
                        Start Shopping
                    </Button>
                </div>
            )}
        </div>
    );
};

export default Orders;