import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Heart, Trash2, ShoppingCart, Loader2 } from "lucide-react";
import Button from "../components/UI/Button";
import {
    fetchWishlist,
    toggleWishlist,
    selectWishlistItems,
    selectWishlistStatus,
    selectWishlistError,
} from "../redux/wishlistSlice";

const Wishlist = ({ addToCart }) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const items   = useSelector(selectWishlistItems);
    const status  = useSelector(selectWishlistStatus);
    const error   = useSelector(selectWishlistError);

    useEffect(() => {
        if (status === 'idle') dispatch(fetchWishlist());
    }, [status, dispatch]);

    if (status === 'loading') {
        return (
            <div className="flex flex-col items-center justify-center py-24 text-gray-500">
                <Loader2 className="w-8 h-8 animate-spin mb-3" />
                <p className="text-sm">Loading your wishlist...</p>
            </div>
        );
    }

    if (status === 'failed') {
        return (
            <div className="text-center py-24">
                <h2 className="text-xl font-semibold text-red-600">Couldn't load wishlist</h2>
                <p className="text-gray-500 mt-2">{error || 'Something went wrong.'}</p>
                <Button onClick={() => dispatch(fetchWishlist())} className="mt-4">
                    Try again
                </Button>
            </div>
        );
    }

    if (items.length === 0) {
        return (
            <div className="text-center py-24">
                <Heart className="mx-auto w-12 h-12 text-gray-300 mb-4" />
                <h2 className="text-2xl font-semibold">No items found</h2>
                <p className="text-gray-500 mt-2">Tap the heart on any product to save it here.</p>
                <Button onClick={() => navigate("/")}>
                    Browse Products
                </Button>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto p-6">
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-3xl font-bold">My Wishlist</h1>
                <span className="text-gray-500">{items.length} {items.length === 1 ? "item" : "items"}</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {items.map((entry) => {
                    const product = entry.product || {};
                    const discountedPrice = product.discountPercentage
                        ? Math.round(product.price * (1 - product.discountPercentage / 100))
                        : product.price;

                    return (
                        <div key={entry.id} className="bg-white border border-gray-100 rounded-3xl overflow-hidden hover:shadow-xl transition-all duration-300">
                            <div
                                className="relative h-56 bg-gray-50 overflow-hidden cursor-pointer"
                                onClick={() => navigate(`/product/${product.id}`)}
                            >
                                <img
                                    src={product.thumbnail || product.image}
                                    alt={product.title || product.name}
                                    className="w-full h-full object-contain hover:scale-105 transition-transform duration-500"
                                />
                                <Button
                                    variant="favorite"
                                    className="absolute top-4 right-4"
                                    aria-label="Remove from wishlist"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        dispatch(toggleWishlist(product.id));
                                    }}
                                >
                                    <Trash2 className="w-5 h-5 text-red-500" />
                                </Button>
                            </div>

                            <div className="p-5">
                                <p className="text-xs text-gray-500 font-medium">{product.brand}</p>
                                <h3 className="font-semibold text-lg mt-1 line-clamp-2 min-h-[52px]">
                                    {product.title || product.name}
                                </h3>
                                <div className="flex items-center gap-2 mt-3">
                                    <span className="text-2xl font-bold text-gray-900">${discountedPrice}</span>
                                    {product.discountPercentage > 0 && (
                                        <span className="text-sm text-gray-400 line-through">${product.price}</span>
                                    )}
                                </div>
                                <Button
                                    onClick={() => addToCart && addToCart(product)}
                                    className="mt-5 w-full flex items-center justify-center gap-2"
                                >
                                    <ShoppingCart size={18} />
                                    Add to Cart
                                </Button>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default Wishlist;
