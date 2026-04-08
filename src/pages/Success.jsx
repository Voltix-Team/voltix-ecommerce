import OrderSummary from '../components/UI/OrderSummary';
import React from 'react';
import Button from '../components/UI/Button';
import { CheckCircle2 } from 'lucide-react';

const Success = () => {

    const getEstimatedDate = () => {
        const today = new Date();

        // Add 14 days (2 weeks) to the current date
        today.setDate(today.getDate() + 14);

        // Format the date (e.g., "OCT 24, 2026")
        return today.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        }).toUpperCase(); // Convert to uppercase to match your design
    };

    return (
        <div className="w-full max-w-md bg-white rounded-[2rem] p-8 border border-slate-100 shadow-sm mx-auto my-4">
            <div className='flex flex-col justufy-center items-center '>
                <CheckCircle2
                    size={44}
                    className="text-green-500"
                    strokeWidth={2.5} />
                <h2 className="text-3xl font-bold text-slate-900 mb-2"> Order Confirmed </h2>
                {/* Ensure text-center is applied directly to the text element */}
                <p className="text-slate-500 text-center max-w-sm mx-auto leading-relaxed">
                    Thank you for choosing Voltix. Your gadgets are being prepared for delivery.
                </p>
            </div>
            <OrderSummary items={[]} // Pass an empty array for now so it doesn't crash
                orderId="#VX-99281"
                totalAmount={0} />
            <div className='flex gap-2 jusify-center px-8'>
                <Button className='py-2.5 mt-2 text-xs font-bold'> Return to Home </Button>
                <Button className='py-2.5 mt-2 text-xs font-bold' > Track Order</Button>
            </div>
            <p className="mt-8 text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] flex jusify-center px-8">
                Estimated Delivery: {getEstimatedDate}
            </p>



        </div>);
}

export default Success; 