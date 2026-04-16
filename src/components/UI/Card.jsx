import { useState } from "react";
import { Link } from "react-router-dom";
import { Heart } from "lucide-react";
import StarRating from "./StarRating";
import Button from "./Button";
import { toast } from 'react-hot-toast';
import { useProtectedAction } from "../../hooks/useProtectedAction";

const WISHLIST_KEY = "wishlist";

const getWishlist = () => {
    try {
        return JSON.parse(localStorage.getItem(WISHLIST_KEY)) || [];
    } catch {
        return [];
    }
};

const ProductCard = ({ product, addToCart }) => {
    const [isFavorite, setIsFavorite] = useState(() =>
        getWishlist().some((item) => item.id === product.id)
    );

    const protectedAction = useProtectedAction();

    const toggleFavorite = (e) => {
        e.preventDefault();
        protectedAction(() => {
            const wishlist = getWishlist();
            const exists = wishlist.some((item) => item.id === product.id);
            const updated = exists
                ? wishlist.filter((item) => item.id !== product.id)
                : [...wishlist, product];

            localStorage.setItem(WISHLIST_KEY, JSON.stringify(updated));
            setIsFavorite(!exists);

            toast.success(exists ? "Removed from wishlist" : "Added to wishlist");
        }, "You must login first to use wishlist");
    };

    const handleAddToCart = (e) => {
        e.preventDefault();

        protectedAction(() => {
            addToCart(product);
            toast.success(`${product.title} added to cart1`);
        }, "You must login first to add items to cart");
    };

    const discountedPrice = product.discountPercentage
        ? Math.round(product.price * (1 - product.discountPercentage / 100))
        : product.price;

    return (
        <div className="group bg-white border border border-gray-100 rounded-3xl overflow-hidden hover:shadow-x1 transition-all duration-300">
            <Link to={`/product/${product.id}`}>
                <div className="relative h-64 bg-gray-50 overflow-hidden">
                    <img
                        src={product.thumbnail}
                        alt={product.title}
                        className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
                    />
                    {product.discountPercentage > 0 && (
                        <div className="absolute top-4 left-4 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                            - {Math.round(product.discountPercentage)}%
                        </div>
                    )}
                    <button
                        type="button"
                        onClick={toggleFavorite}
                        aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
                        className="absolute top-4 right-4 bg-white/90 hover:bg-white p-2 rounded-full shadow-sm transition-colors"
                    >
                        <Heart
                            className={`w-5 h-5 transition-colors ${isFavorite ? "fill-red-500 text-red-500" : "text-gray-600"}`}
                        />
                    </button>
                </div>
            </Link>

            <div className="p-5">
                <p className="text-xs text-gray-500 font-medium">{product.brand}</p>
                <Link to={`/product/${product.id}`} className="block">
                    <h3 className="font-semibold text-lg mt-1 line-clamp-2 min-h-[52px] hover:text-blue-600 transition-colors">
                        {product.title}
                    </h3>
                </Link>

                {/* star rating */}
                <div className="mt-2">
                    <StarRating rating={product.rating} size={4} />
                </div>

                <div className="flex items-center gap-2 mt-4">
                    <span className="text-2xl font-bold text-gray-900">
                        ${discountedPrice}
                    </span>
                    {product.discountPercentage > 0 && (
                        <span className="text-sm text-gray-400 line-through">
                            ${product.price}
                        </span>
                    )}
                </div>
                <Button
                    onClick={handleAddToCart}
                    className="mt-5 w-full bg-blue-600 hover:bg-blue-700 text-white py-3.5 rounded-2xl font-medium transition-colors"
                >
                    Add to Cart
                </Button>
            </div>
        </div>
    );
};

export default ProductCard;