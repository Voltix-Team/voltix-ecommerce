import axios from 'axios';

const api = axios.create({
    baseURL: 'https://dummyjson.com',
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Fetch products (only electronics categories)
export const fetchProducts = async (category = 'all') => {
    try {
        if (category === 'all') {
            const categories = ['smartphones', 'laptops', 'tablets', 'mobile-accessories'];
            const promises = categories.map(cat =>
                api.get(`/products/category/${cat}`)
            );
            const results = await Promise.all(promises);
            return results.flatMap(res => res.data.products || []);
        } else {
            const { data } = await api.get(`/products/category/${category}`);
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