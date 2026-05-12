import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Package, Loader2 } from 'lucide-react';
import OrderCard from '../components/UI/OrderCard';
import Button from '../components/UI/Button';
import {
    fetchOrders,
    selectAllOrders,
    selectOrdersStatus,
    selectOrdersError,
} from '../redux/orderSlice';

const Orders = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const orders = useSelector(selectAllOrders);
    const status = useSelector(selectOrdersStatus);
    const error  = useSelector(selectOrdersError);

    useEffect(() => {
        if (status === 'idle') dispatch(fetchOrders());
    }, [status, dispatch]);

    return (
        <div className="max-w-3xl mx-auto px-6 py-12 min-h-screen">
            <div className="mb-10">
                <h1 className="text-4xl font-bold text-gray-900">My Orders</h1>
                <p className="text-gray-500 mt-2">
                    {status === 'succeeded' && orders.length > 0
                        ? `You have ${orders.length} ${orders.length === 1 ? 'order' : 'orders'}`
                        : status === 'succeeded'
                            ? 'No orders placed yet'
                            : ''}
                </p>
            </div>

            {status === 'loading' && (
                <div className="flex flex-col items-center justify-center py-24 text-gray-500">
                    <Loader2 className="w-8 h-8 animate-spin mb-3" />
                    <p className="text-sm">Loading your orders...</p>
                </div>
            )}

            {status === 'failed' && (
                <div className="text-center py-24">
                    <h3 className="text-xl font-semibold text-red-600 mb-2">Couldn't load orders</h3>
                    <p className="text-gray-500 mb-6">{error || 'Something went wrong.'}</p>
                    <Button onClick={() => dispatch(fetchOrders())}>Try again</Button>
                </div>
            )}

            {status === 'succeeded' && orders.length > 0 && (
                <div className="space-y-4">
                    {orders.map((order) => (
                        <OrderCard key={order.id} order={order} />
                    ))}
                </div>
            )}

            {status === 'succeeded' && orders.length === 0 && (
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
