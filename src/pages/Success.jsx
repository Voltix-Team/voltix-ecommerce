import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2 } from 'lucide-react';
import Button from '../components/UI/Button';

const Success = () => {
  const navigate = useNavigate();

  const getEstimatedDate = () => {
    const today = new Date();
    today.setDate(today.getDate() + 14);
    return today.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }).toUpperCase();
  };

  // Generate a random order ID once on mount
  const orderId = `#VX-${Math.floor(10000 + Math.random() * 90000)}`;

  return (
    <div className="flex items-center justify-center flex-1 px-4 py-12">
      <div className="w-full max-w-md bg-white rounded-[2rem] p-8 border border-slate-100 shadow-sm">

        {/* Icon + heading */}
        <div className="flex flex-col items-center text-center mb-8">
          <CheckCircle2 size={52} className="text-green-500 mb-4" strokeWidth={2} />
          <h2 className="text-3xl font-bold text-slate-900 mb-2">Order Confirmed</h2>
          <p className="text-slate-500 max-w-sm leading-relaxed">
            Thank you for choosing Voltix. Your gadgets are being prepared for delivery.
          </p>
        </div>

        {/* Order details card */}
        <div className="bg-slate-50 rounded-2xl p-6 mb-8 space-y-3 border border-slate-100">
          <div className="flex justify-between text-sm">
            <span className="text-slate-400 font-medium">Order ID</span>
            <span className="font-bold text-slate-800">{orderId}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-slate-400 font-medium">Status</span>
            <span className="text-green-600 font-semibold">Processing</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-slate-400 font-medium">Estimated Delivery</span>
            <span className="font-semibold text-slate-800">{getEstimatedDate()}</span>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex gap-3">
          <Button
            onClick={() => navigate('/')}
            className="w-1/2"
          >
            Return to Home
          </Button>
          <Button
            onClick={() => alert('Order tracking coming soon!')}
            className="w-1/2"
          >
            Track Order
          </Button>
        </div>

      </div>
    </div>
  );
};

export default Success;