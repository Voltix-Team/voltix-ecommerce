import { Link } from "react-router-dom";

const ProductCard = ({ product, addToCart }) => {
    const discountedPrice = product.discountPercentage 
        ? Math.round(product.price * ( 1 - product.discountPercentage / 100))
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
                </div>
            </Link>

            <div className="p-5">
                <p className="text-xs text-gray-500 font-medium">{product.brand}</p>
                <Link to={`/product/${product.id}`} className="block">
                    <h3 className="font-semibold text-lg mt-1 line-clamp-2 min-h-[52px] hover:text-blue-600 transition-colors">
                        {product.title}
                    </h3>
                </Link>
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
                <button
                    onClick={(e) => {
                        e.preventDefault();
                        addToCart(product);
                    }}
                    className="mt-5 w-full bg-blue-600 hover:bg-blue-700 text-white py-3.5 rounded-2xl font-medium transition-colors"
                >
                    Add to Cart
                </button>
            </div>
        </div>
    )
}

export default ProductCard;