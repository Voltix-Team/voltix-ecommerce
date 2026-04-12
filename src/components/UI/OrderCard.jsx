import { useState } from 'react';
import { ChevronDown, Package, Calendar } from 'lucide-react';
import OrderItemRow from './OrderItemRow';

const OrderCard = ({ order }) => {
  const [expanded, setExpanded] = useState(false);

  const date = new Date(order.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  const itemCount = order.items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
      {/* header (always visible) */}
      <button
        onClick={() => setExpanded(e => !e)}
        className="w-full flex items-center justify-between px-6 py-5 hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-4">
          <div className="w-11 h-11 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0">
            <Package size={18} className="text-blue-600" />
          </div>
          <div className="text-left">
            <p className="text-sm font-bold text-gray-900">{order.id}</p>
            <div className="flex items-center gap-1.5 mt-0.5">
              <Calendar size={11} className="text-gray-400" />
              <p className="text-xs text-gray-500 font-medium">{date}</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-5">
          <div className="text-right hidden sm:block">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
              {itemCount} {itemCount === 1 ? 'item' : 'items'}
            </p>
            <p className="text-base font-bold text-gray-900 mt-0.5">
              ${order.total.toFixed(2)}
            </p>
          </div>
          <ChevronDown
            size={18}
            className={`text-gray-400 transition-transform duration-200 ${
              expanded ? 'rotate-180' : ''
            }`}
          />
        </div>
      </button>

      {/* expanded body */}
      {expanded && (
        <div className="px-6 pb-6 pt-2 border-t border-gray-100">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 mt-4">
            Items
          </p>
          <div>
            {order.items.map(item => (
              <OrderItemRow key={item.id} item={item} />
            ))}
          </div>

          {/* totals */}
          <div className="mt-5 pt-4 border-t border-gray-100 space-y-1.5">
            <div className="flex justify-between text-sm text-gray-500">
              <span>Subtotal</span>
              <span>${order.subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm text-gray-500">
              <span>Shipping</span>
              <span>Free</span>
            </div>
            <div className="flex justify-between pt-2 border-t border-gray-100 mt-2">
              <span className="text-sm font-bold text-gray-900">Total</span>
              <span className="text-sm font-bold text-gray-900">
                ${order.total.toFixed(2)}
              </span>
            </div>
          </div>

          {/* shipping address (if present) */}
          {order.shipping && (
            <div className="mt-5 pt-4 border-t border-gray-100">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">
                Shipped To
              </p>
              <p className="text-sm text-gray-700 font-medium">
                {order.shipping.fullName}
              </p>
              <p className="text-xs text-gray-500 mt-0.5">
                {order.shipping.street}, {order.shipping.city}{' '}
                {order.shipping.postalCode}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default OrderCard;