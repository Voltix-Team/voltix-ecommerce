import { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchProductById } from '../services/api';
import StarRating from '../components/UI/StarRating';
import ReviewSection from '../components/UI/ReviewSection';
import Button from '../components/UI/Button';
// import { UserContext } from './UserContext';
import { toast } from 'react-hot-toast';
import { useProtectedAction } from '../hooks/useProtectedAction';
import { useSelector } from 'react-redux';

const ProductDetails = ({ addToCart }) => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useSelector((state) => state.user);
    
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [mainImage, setMainImage] = useState('');

    const protectedAction = useProtectedAction();

    useEffect(() => {
        fetchProductById(id).then(data => {
            setProduct(data);
            setMainImage(data?.thumbnail || '');
            setLoading(false);
        });
    }, [id]);

    if (loading) return <div className="text-center py-32 text-2xl">Loading Product...</div>;
    if (!product) return <div className="text-center py-32 text-2xl">Product Not Found</div>;

    const discountedPrice = product.discountPercentage
        ? Math.round(product.price * (1 - product.discountPercentage / 100))
        : product.price;

    const handleAddToCart = () => {
        protectedAction(() => {
            addToCart(product);
            toast.success(`${product.title} added to cart!`);
        }, "You must login first to add items to cart");
    };

    return (
        <div className="bg-gray-50 min-h-screen pb-20">
            <div className="max-w-6xl mx-auto px-6 py-12">
                <Button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 mb-4"
                >
                    ← Back to Shop
                </Button>

                <div className="grid md:grid-cols-2 gap-12">
                    {/* images */}
                    <div>
                        <div className="bg-white p-8 rounded-3xl shadow-sm">
                            <img
                                src={mainImage}
                                alt={product.title}
                                className="w-full h-auto rounded-2xl"
                            />
                        </div>

                        {/* thumbnail gallery */}
                        <div className="flex gap-4 mt-6 justify-center">
                            {product.images?.map((img, index) =>
                                <img
                                    key={index}
                                    src={img}
                                    alt={`view ${index}`}
                                    className={`w-20 h-20 object-cover rounded-xl cursor-pointer border-2 ${mainImage === img ? 'border-blue-600' : 'border-transparent'}`}
                                    onClick={() => setMainImage(img)}
                                />
                            )}
                        </div>
                    </div>

                    {/* product info */}
                    <div className="space-y-8">
                        <div>
                            <p className="text-blue-600 font-medium">{product.brand}</p>
                            <h1 className="text-4xl font-bold mt-2 leading-tight">{product.title}</h1>
                        </div>

                        {/* ✅ display-only rating from API */}
                        <StarRating
                            rating={product.rating}
                            totalRatings={product.reviews?.length ?? 0}
                            size={6}
                        />

                        <div className="flex items-center gap-4">
                            <span className="text-4xl font-bold">${discountedPrice}</span>
                            {product.discountPercentage > 0 && (
                                <span className="text-xl text-gray-400 line-through">${product.price}</span>
                            )}
                        </div>

                        <p className="text-gray-600 leading-relaxed">{product.description}</p>

                        {/* stock status */}
                        <div className="flex items-center gap-2 text-green-600">
                            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                            In Stock ({product.stock} available)
                        </div>

                        <Button
                            onClick={handleAddToCart}
                            className="w-full"
                        >
                            Add to Cart
                        </Button>

                        {/* specifications */}
                        <div className="bg-white p-8 rounded-3xl">
                            <h3 className="font-semibold mb-6">Specifications</h3>
                            <div className="grid grid-cols-2 gap-y-6 text-sm">
                                <div><strong>Category: </strong>{product.category}</div>
                                <div><strong>Rating: </strong>{product.rating}</div>
                                <div><strong>Brand: </strong>{product.brand}</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* reviews section */}
                <div className="mt-12">
                    <ReviewSection
                        productId={product.id}
                        apiReviews={product.reviews ?? []}
                    />
                </div>
            </div>
        </div>
    );
};

export default ProductDetails;