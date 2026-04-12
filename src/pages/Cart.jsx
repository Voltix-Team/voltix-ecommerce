import { ShoppingBag, Trash2, ShieldCheck, Minus, Truck, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const CartPage = ({ cartItems, updateQuantity, removeFromCart }) => {
  const navigate = useNavigate();

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const total = subtotal;

  const getName = (item) => item.title || item.name;
  const getImage = (item) => item.thumbnail || item.image;

  if (cartItems.length === 0) {
    return (
      <div className="text-center py-24">
        <ShoppingBag className="mx-auto w-12 h-12 text-gray-300 mb-4" />
        <h2 className="text-2xl font-semibold">Your cart is empty</h2>
        <button
          onClick={() => navigate('/')}
          className="mt-6 bg-blue-600 text-white px-6 py-3 rounded-md"
        >
          Continue Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6 flex flex-col lg:flex-row gap-10">

      {/* Items */}
      <div className="flex-1 space-y-4">
        {cartItems.map(item => (
          <div key={item.id} className="flex items-center justify-between bg-white p-4 rounded-lg border">

            {/* Product */}
            <div className="flex items-center gap-4">
              <img src={getImage(item)} className="w-20 h-20 object-cover rounded" />
              <div>
                <h3 className="font-semibold">{getName(item)}</h3>
                <p className="text-sm text-gray-500">${item.price}</p>
              </div>
            </div>

            {/* Quantity */}
            <div className="flex items-center gap-3">
              <button onClick={() => updateQuantity(item.id, -1)}>
                <Minus size={16} />
              </button>

              <span>{item.quantity}</span>

              <button onClick={() => updateQuantity(item.id, 1)}>
                <Plus size={16} />
              </button>
            </div>

            {/* Price */}
            <div className="text-right">
              <p className="font-bold">
                ${(item.price * item.quantity).toFixed(2)}
              </p>
              <button onClick={() => removeFromCart(item.id)}>
                <Trash2 size={16} className="text-red-500" />
              </button>
            </div>

          </div>
        ))}
      </div>

      {/* Summary */}
      <div className="w-full lg:w-80 bg-gray-100 p-6 rounded-lg">
        <h2 className="font-semibold mb-4">Order Summary</h2>

        <div className="flex justify-between mb-2">
          <span>Subtotal</span>
          <span>${subtotal.toFixed(2)}</span>
        </div>

        <div className="flex justify-between mb-4">
          <span>Shipping</span>
          <span>Free</span>
        </div>

        <div className="border-t pt-4 flex justify-between font-bold text-lg">
          <span>Total</span>
          <span>${total.toFixed(2)}</span>
        </div>

        <button
          onClick={() => navigate('/checkout')}
          className="w-full mt-6 bg-blue-600 text-white py-3 rounded-md"
        >
          Proceed to Checkout
        </button>

        <div className="mt-4 text-sm text-gray-500 space-y-2">
          <div className="flex items-center gap-2">
            <ShieldCheck size={16} /> Secure Checkout
          </div>
          <div className="flex items-center gap-2">
            <Truck size={16} /> Free Delivery
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;