import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Heart } from "lucide-react";
import StarRating from "./StarRating";
import Button from "./Button";
import { toast } from 'react-hot-toast';
import { useProtectedAction } from "../../hooks/useProtectedAction";
import { toggleWishlist, selectIsInWishlist } from "../../redux/wishlistSlice";

const ProductCard = ({ product, addToCart }) => {
    const dispatch = useDispatch();
    const isFavorite = useSelector(selectIsInWishlist(product.id));
    const protectedAction = useProtectedAction();

    // handle both Django ('name') and dummyjson ('title')
    const getName     = (p) => p.name  || p.title  || 'Product';
    // handle both Django ('thumbnail_url') and dummyjson ('thumbnail')
    const getImage    = (p) => p.thumbnail_url || p.thumbnail || p.image || '';
    // handle both Django ('discount_percentage') and dummyjson ('discountPercentage')
    const getDiscount = (p) => p.discount_percentage || p.discountPercentage || 0;

    const discountedPrice = getDiscount(product) > 0
        ? Math.round(product.price * (1 - getDiscount(product) / 100))
        : product.price;

    const toggleFavorite = (e) => {
        e.preventDefault();
        protectedAction(() => {
            dispatch(toggleWishlist(product.id));
            toast.success(isFavorite ? "Removed from wishlist" : "Added to wishlist");
        }, "You must login first to use wishlist");
    };

    const handleAddToCart = (e) => {
        e.preventDefault();
        protectedAction(() => {
            addToCart(product);
            toast.success(`${getName(product)} added to cart!`);
        }, "You must login first to add items to cart");
    };

    return (
        <div className="group bg-white border border-gray-100 rounded-3xl overflow-hidden hover:shadow-xl transition-all duration-300">
            <Link to={`/product/${product.id}`}>
                <div className="relative h-64 bg-gray-50 overflow-hidden">
                    <img
                        src={getImage(product)}
                        alt={getName(product)}
                        className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
                    />
                    {getDiscount(product) > 0 && (
                        <div className="absolute top-4 left-4 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                            -{Math.round(getDiscount(product))}%
                        </div>
                    )}
                    <Button
                        variant="favorite"
                        type="button"
                        onClick={toggleFavorite}
                        aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
                        className="absolute top-4 right-4"
                    >
                        <Heart className={`w-5 h-5 transition-colors ${isFavorite ? "fill-red-500 text-red-500" : "text-gray-600"}`} />
                    </Button>
                </div>
            </Link>

            <div className="p-5">
                <p className="text-xs text-gray-500 font-medium">{product.brand}</p>
                <Link to={`/product/${product.id}`} className="block">
                    <h3 className="font-semibold text-lg mt-1 line-clamp-2 min-h-[52px] hover:text-blue-600 transition-colors">
                        {getName(product)}
                    </h3>
                </Link>

                <div className="mt-2">
                    <StarRating rating={product.rating || 0} size={4} />
                </div>

                <div className="flex items-center gap-2 mt-4">
                    <span className="text-2xl font-bold text-gray-900">${discountedPrice}</span>
                    {getDiscount(product) > 0 && (
                        <span className="text-sm text-gray-400 line-through">${product.price}</span>
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