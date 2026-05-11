import { ShoppingBag, Trash2, ShieldCheck, Minus, Truck, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { updateQuantity, removeFromCart, clearCart, selectCartItems, selectCartTotal } from '../redux/cartSlice';
import Button from '../components/UI/Button';

const Cart = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    
    const cartItems = useSelector(selectCartItems);
    const subtotal = useSelector(selectCartTotal);
    const discount = 0;
    const total = subtotal;

    const getName = (item) => item.name || item.title || "Product";
    const getImage = (item) => item.image || item.thumbnail || "";
    const getCategory = (item) => item.category || 'PRODUCT';

    return (
        <div>
            <main className='flex-grow max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-12'>
                <div className="mb-12 flex justify-between items-end">
                    <div>
                        <h1 className="text-4xl sm:text-5xl font-semibold text-slate-900 mb-2">Your Cart</h1>
                        <p className="text-slate-500">Precision engineered components ready for dispatch.</p>
                    </div>
                    {cartItems.length > 0 && (
                        <Button
                            variant="plain"
                            onClick={() => dispatch(clearCart())}
                            className="text-red-500 hover:text-red-600 text-sm font-medium flex items-center gap-1"
                        >
                            <Trash2 size={16} /> Clear Cart
                        </Button>
                    )}
                </div>

                <div className="flex flex-col lg:flex-row gap-12">
                    {/* Cart Items */}
                    <div className="flex-grow">
                        {cartItems.length > 0 ? (
                            <>
                                <div className="grid grid-cols-12 text-xs font-bold text-slate-400 tracking-wider mb-4 px-4 uppercase">
                                    <div className="col-span-6">Product Details</div>
                                    <div className="col-span-3 text-center">Quantity</div>
                                    <div className="col-span-3 text-right">Price</div>
                                </div>
                                <div className="space-y-4">
                                    {cartItems.map((item) => (
                                        <div key={item.id} className="bg-slate-50/50 p-4 rounded-xl flex items-center justify-between border border-slate-100">
                                            <div className="flex items-center space-x-6 w-1/2">
                                                <img 
                                                    src={getImage(item)} 
                                                    alt={getName(item)} 
                                                    className="w-20 h-20 object-cover bg-black rounded-md" 
                                                />
                                                <div>
                                                    <p className="text-[10px] font-bold text-blue-500 tracking-wider uppercase mb-1">
                                                        {getCategory(item)}
                                                    </p>
                                                    <h3 className="font-semibold text-slate-900 text-lg">{getName(item)}</h3>
                                                    {item.brand && <p className="text-sm text-slate-500">{item.brand}</p>}
                                                </div>
                                            </div>

                                            <div className="w-1/4 flex justify-center">
                                                <div className="flex items-center space-x-4 bg-white px-3 py-1.5 rounded-md border border-slate-200">
                                                    <Button
                                                        variant="plain"
                                                        onClick={() => dispatch(updateQuantity({ id: item.id, delta: -1 }))}
                                                        className="text-slate-400 hover:text-slate-600 p-1"
                                                    >
                                                        <Minus className="w-4 h-4" />
                                                    </Button>
                                                    <span className="font-medium text-sm w-4 text-center">{item.quantity}</span>
                                                    <Button
                                                        variant="plain"
                                                        onClick={() => dispatch(updateQuantity({ id: item.id, delta: 1 }))}
                                                        className="text-slate-400 hover:text-slate-600 p-1"
                                                    >
                                                        <Plus className="w-4 h-4" />
                                                    </Button>
                                                </div>
                                            </div>

                                            <div className="w-1/4 flex flex-col items-end justify-center space-y-2">
                                                <span className="font-bold text-lg text-slate-900">
                                                    ${(item.price * item.quantity).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                                                </span>
                                                <Button
                                                    variant="plain"
                                                    onClick={() => dispatch(removeFromCart(item.id))} 
                                                    className="text-red-500 hover:text-red-700 transition-colors p-1"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </>
                        ) : (
                            <div className="bg-slate-50/50 rounded-xl border border-dashed border-slate-300 py-24 flex flex-col items-center justify-center text-center">
                                <div className="bg-white p-4 rounded-full shadow-sm mb-6 border border-slate-100">
                                    <ShoppingBag className="w-10 h-10 text-slate-300" />
                                </div>
                                <h3 className="text-2xl font-semibold text-slate-900 mb-2">Your cart is empty</h3>
                                <p className="text-slate-500 mb-8 max-w-md">
                                    Looks like you haven't added any precision components to your cart yet.
                                </p>
                                <Button 
                                    onClick={() => navigate('/')} 
                                    className="w-50"
                                >
                                    CONTINUE SHOPPING
                                </Button>
                            </div>
                        )}
                    </div>

                    {/* Order Summary */}
                    <div className="lg:w-96 flex-shrink-0">
                        <div className="bg-slate-50 p-8 rounded-xl border border-slate-100">
                            <h2 className="text-xl font-semibold text-slate-900 mb-8">Order Summary</h2>
                            <div className="space-y-4 mb-8">
                                <div className="flex justify-between text-sm font-medium text-slate-600">
                                    <span>SUBTOTAL</span>
                                    <span className="text-slate-900">${subtotal.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                                </div>
                                <div className="flex justify-between text-sm font-medium text-slate-600">
                                    <span>SHIPPING</span>
                                    <span className="text-slate-900">Free</span>
                                </div>
                                <div className="flex justify-between text-sm font-medium text-slate-600">
                                    <span>DISCOUNT</span>
                                    <span className="text-slate-900">-$0.00</span>
                                </div>
                            </div>

                            <div className="border-t border-slate-200 pt-6 mb-8">
                                <div className="flex justify-between items-end mb-1">
                                    <span className="text-xs font-bold text-slate-400 tracking-wider">FINAL TOTAL</span>
                                    <span className="text-xs text-slate-400 italic">Incl. VAT</span>
                                </div>
                                <div className="text-3xl font-bold text-slate-900">
                                    ${total.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                                </div>
                            </div>

                            <Button
                                disabled={cartItems.length === 0}
                                onClick={() => navigate('/checkout')}
                                className={`w-full font-semibold py-4 rounded-md transition-colors mb-6 text-sm tracking-wide ${
                                    cartItems.length > 0
                                        ? 'bg-blue-600 hover:bg-blue-700 text-white'
                                        : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                                }`}
                            >
                                PROCEED TO CHECKOUT
                            </Button>

                            <div className="space-y-3">
                                <div className="bg-white p-4 rounded-lg flex items-center space-x-3 text-sm border shadow-sm text-slate-600 border-slate-100">
                                    <ShieldCheck className="w-5 h-5 flex-shrink-0 text-blue-600" />
                                    <span>Secure Encrypted Checkout</span>
                                </div>
                                <div className="bg-white p-4 rounded-lg flex items-center space-x-3 text-sm border shadow-sm text-slate-600 border-slate-100">
                                    <Truck className="w-5 h-5 flex-shrink-0 text-blue-600" />
                                    <span>Free Next-Day Carbon-Neutral Delivery</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Cart;