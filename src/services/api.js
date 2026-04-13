import axios from 'axios';

const api = axios.create({
    baseURL: process.env.REACT_APP_API_BASE_URL,    
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Fetch products — all electronics or by specific category
export const fetchProducts = async (category = 'all') => {
    try {
        if (category === 'all') {
            // Fetch each electronics category separately with limit
            const smartphones   = await api.get('/products/category/smartphones?limit=100');
            const laptops       = await api.get('/products/category/laptops?limit=100');
            const tablets       = await api.get('/products/category/tablets?limit=100');
            const accessories   = await api.get('/products/category/mobile-accessories?limit=100');

            // Combine all into one array
            return [
                ...smartphones.data.products,
                ...laptops.data.products,
                ...tablets.data.products,
                ...accessories.data.products,
            ];
        } else {
            const { data } = await api.get(`/products/category/${category}?limit=100`);
            return data.products || [];
        }
    } catch (error) {
        console.error('Failed to fetch products:', error.message);
        return [];
    }
};

// Fetch single product by ID (for Product Details page)
export const fetchProductById = async (id) => {
    try {
        const { data } = await api.get(`/products/${id}`);
        return data;
    } catch (error) {
        console.error('Failed to fetch product by ID:', error.message);
        return null;
    }
};