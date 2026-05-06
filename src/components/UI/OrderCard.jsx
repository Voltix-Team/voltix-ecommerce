import { useState } from 'react';
import { ChevronDown, Package, Calendar } from 'lucide-react';
import OrderItemRow from './OrderItemRow';
import Button from './Button';

const OrderCard = ({ order }) => {
  const [expanded, setExpanded] = useState(false);

  const createdAt = order.created_at || order.createdAt;
  const date = createdAt
    ? new Date(createdAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })
    : '';

  const items = order.items || [];
  const itemCount = items.reduce((sum, i) => sum + i.quantity, 0);
  const total = Number(order.total_price ?? order.total ?? 0);
  const subtotal = items.reduce((sum, i) => sum + Number(i.price) * i.quantity, 0);

  return (
    <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
      <Button
        variant="plain"
        onClick={() => setExpanded(e => !e)}
        className="w-full flex items-center justify-between px-6 py-5 hover:bg-gray-50 transition-colors text-left"
        aria-expanded={expanded}
        aria-label={`Toggle order ${order.id}`}
      >
        <div className="flex items-center gap-4">
          <div className="w-11 h-11 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0">
            <Package size={18} className="text-blue-600" />
          </div>
          <div className="text-left">
            <p className="text-sm font-bold text-gray-900">Order #{order.id}</p>
            <div className="flex items-center gap-1.5 mt-0.5">
              <Calendar size={11} className="text-gray-400" />
              <p className="text-xs text-gray-500 font-medium">{date}</p>
            </div>
            {order.status && (
              <p className="text-[10px] font-bold text-blue-600 uppercase tracking-wider mt-1">
                {order.status}
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-5">
          <div className="text-right hidden sm:block">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
              {itemCount} {itemCount === 1 ? 'item' : 'items'}</p>
            <p className="text-base font-bold text-gray-900 mt-0.5">
              ${total.toFixed(2)}</p>
          </div>
          <ChevronDown size={18} className={`text-gray-400 transition-transform duration-200 ${
            expanded ? 'rotate-180' : ''}`}/>
          </div>
      </Button>

      {expanded && (
        <div className="px-6 pb-6 pt-2 border-t border-gray-100">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 mt-4">
            Items
          </p>
          <div>
            {items.map(item => (
              <OrderItemRow key={item.id} item={item} />
            ))}
          </div>

          <div className="mt-5 pt-4 border-t border-gray-100 space-y-1.5">
            <div className="flex justify-between text-sm text-gray-500">
              <span>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm text-gray-500">
              <span>Shipping</span>
              <span>Free</span>
            </div>
            <div className="flex justify-between pt-2 border-t border-gray-100 mt-2">
              <span className="text-sm font-bold text-gray-900">Total</span>
              <span className="text-sm font-bold text-gray-900">
                ${total.toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderCard;
