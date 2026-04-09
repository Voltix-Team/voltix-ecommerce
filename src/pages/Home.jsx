import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import ProductCard from '../components/UI/Card';
import { fetchProducts } from '../services/api';

const Home = ({ addToCart }) => {
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    const [searchParams, setSearchParams] = useSearchParams();
    const searchQuery = searchParams.get('search') || '';
    const activeCategory = searchParams.get('category') || 'all';

    const setActiveCategory = (cat) => {
        setSearchParams(prev => {
            const next = new URLSearchParams(prev);
            if (cat === 'all') {
                next.delete('category');
            } else {
                next.set('category', cat);
            }
            return next;
        });
    };

    useEffect(() => {
        setLoading(true);
        fetchProducts(activeCategory).then(data => {
            setProducts(data);
            setLoading(false);
        });
    }, []);

    useEffect(() => {
        let result = [...products];

        if (searchQuery) {
            result = result.filter(p =>
                p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                p.brand.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        if (activeCategory !== 'all') {
            result = result.filter(p => p.category === activeCategory);
        }

        setFilteredProducts(result);
    }, [products, searchQuery, activeCategory]);

    const categories = ['all', 'smartphones', 'laptops', 'tablets', 'mobile-accessories'];

    if (loading) {
        return <div className="text-center py-20 text-xl">Loading Products...</div>;
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* hero section */}
            <div className="bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 text-white py-24">
                <div className="max-w-6xl mx-auto px-6 text-center">
                    <h1 className="text-6xl font-bold mb-6">Unleash Power</h1>
                    <p className="text-2xl max-w-2xl mx-auto opacity-90">
                        Experience the next generation of premium electronics
                    </p>
                    <button
                        onClick={() => document.getElementById('products').scrollIntoView({ behavior: 'smooth' })}
                        className="mt-10 bg-white text-blue-600 px-10 py-4 rounded-2xl font-semibold text-lg hover:bg-gray-100 transition"
                    >
                        Shop Now
                    </button>
                </div>
            </div>

            {/* ✅ id="products" added so scrollIntoView works */}
            <div id="products" className="max-w-6xl mx-auto px-6 py-12">
                {/* category filters */}
                <div className="flex flex-wrap gap-3 mb-10 justify-center">
                    {categories.map(cat => (
                        <button
                            key={cat}
                            onClick={() => setActiveCategory(cat)}
                            className={`px-6 py-3 rounded-3xl font-medium transition-all ${
                                activeCategory === cat
                                    ? 'bg-blue-600 text-white shadow'
                                    : 'bg-white border border-gray-200 hover:bg-gray-50'
                            }`}
                        >
                            {cat === 'all' ? 'All Products' : cat.charAt(0).toUpperCase() + cat.slice(1)}
                        </button>
                    ))}
                </div>

                {/* products grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    {filteredProducts.map(product => (
                        <ProductCard
                            key={product.id}
                            product={product}
                            addToCart={addToCart}
                        />
                    ))}
                </div>

                {filteredProducts.length === 0 && (
                    <p className="text-center py-20 text-gray-500 text-xl">No products found in this category.</p>
                )}
            </div>
        </div>
    );
};

export default Home;