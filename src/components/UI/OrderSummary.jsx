import React from 'react'


const OrderSummary = ({ items, orderId, totalAmount }) => { 
    return (<div className="w-full max-w-md bg-white rounded-[2rem] p-6 md:p-8 border border-slate-100">
      {/* Header with Order ID */}
      <div className="flex justify-between items-center mb-6">
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Order Summary</span>
        <span className="text-[10px] font-bold text-blue-600 uppercase tracking-tight">{orderId}</span>
      </div>

      {/* Product List */}
      <div className="space-y-5 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
        {items.map((item) => (
          <div key={item.id} className="flex items-center gap-4">
            {/* Product Image Placeholder */}
            <div className="w-14 h-14 bg-slate-100 rounded-xl overflow-hidden flex-shrink-0">
              <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
            </div>
            
            {/* Product Details */}
            <div className="flex-grow min-w-0">
              <h4 className="text-[13px] font-bold text-slate-800 truncate">{item.name}</h4>
              <p className="text-[10px] text-slate-400 truncate">{item.description}</p>
            </div>

            {/* Price */}
            <span className="text-[13px] font-bold text-slate-800">
              ${item.price.toLocaleString()}
            </span>
          </div>
        ))}
      </div>

      <hr className="my-6 border-slate-50" />

      {/* Total Section */}
      <div className="flex justify-between items-center">
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Total Amount</span>
        <span className="text-xl font-black text-slate-900">${totalAmount.toLocaleString()}</span>
      </div>
    </div>) ; 
}; 

export default OrderSummary ; 