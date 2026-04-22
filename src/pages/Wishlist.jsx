import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Heart, Trash2, ShoppingCart } from "lucide-react";
import Button from "../components/UI/Button";
import { selectWishlistItems, removeFromWishlist } from "../redux/wishlistSlice";

const Wishlist = ({ addToCart }) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const items = useSelector(selectWishlistItems);

    const handleAddToCart = (item) => {
        if (addToCart) addToCart(item);
    };

    if (items.length === 0) {
        return (
            <div className="text-center py-24">
                <Heart className="mx-auto w-12 h-12 text-gray-300 mb-4" />
                <h2 className="text-2xl font-semibold">Your wishlist is empty</h2>
                <p className="text-gray-500 mt-2">Tap the heart on any product to save it here.</p>
                <Button
                    onClick={() => navigate("/")}
                >
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
                {items.map((item) => {
                    const discountedPrice = item.discountPercentage
                        ? Math.round(item.price * (1 - item.discountPercentage / 100))
                        : item.price;

                    return (
                        <div key={item.id} className="bg-white border border-gray-100 rounded-3xl overflow-hidden hover:shadow-xl transition-all duration-300">
                            <div
                                className="relative h-56 bg-gray-50 overflow-hidden cursor-pointer"
                                onClick={() => navigate(`/product/${item.id}`)}
                            >
                                <img
                                    src={item.thumbnail || item.image}
                                    alt={item.title || item.name}
                                    className="w-full h-full object-contain hover:scale-105 transition-transform duration-500"
                                />
                                <Button
                                    variant="favorite"
                                    className="absolute top-4 right-4"
                                    aria-label="Remove from wishlist"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        dispatch(removeFromWishlist(item.id));}}>
                                        <Trash2 className="w-5 h-5 text-red-500" />
                                </Button>
                            </div>

                            <div className="p-5">
                                <p className="text-xs text-gray-500 font-medium">{item.brand}</p>
                                <h3 className="font-semibold text-lg mt-1 line-clamp-2 min-h-[52px]">
                                    {item.title || item.name}
                                </h3>
                                <div className="flex items-center gap-2 mt-3">
                                    <span className="text-2xl font-bold text-gray-900">${discountedPrice}</span>
                                    {item.discountPercentage > 0 && (
                                        <span className="text-sm text-gray-400 line-through">${item.price}</span>
                                    )}
                                </div>
                                <Button
                                    onClick={() => handleAddToCart(item)}
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