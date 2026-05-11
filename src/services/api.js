import axios from 'axios';
import voltixApi from './voltixApi';

// dummyjson fallback (only used if REACT_APP_USE_DJANGO_PRODUCTS=false)
const dummyApi = axios.create({
    baseURL: 'https://dummyjson.com',
    timeout: 10000,
    headers: { 'Content-Type': 'application/json' },
});

const USE_DJANGO = process.env.REACT_APP_USE_DJANGO_PRODUCTS === 'true';

// ── fetchProducts ─────────────────────────────────────────────────────────────
export const fetchProducts = async (category = 'all') => {
    if (USE_DJANGO) {
        try {
            // build query string — ?category=smartphones or nothing for all
            const params = category !== 'all' ? `?category=${category}` : '';
            const { data } = await voltixApi.get(`/products/${params}`);
            return data;
        } catch (error) {
            console.error('Failed to fetch products from Django:', error.message);
            return [];
        }
    }

    // dummyjson fallback
    try {
        if (category === 'all') {
            const [smartphones, laptops, tablets, accessories] = await Promise.all([
                dummyApi.get('/products/category/smartphones?limit=100'),
                dummyApi.get('/products/category/laptops?limit=100'),
                dummyApi.get('/products/category/tablets?limit=100'),
                dummyApi.get('/products/category/mobile-accessories?limit=100'),
            ]);
            return [
                ...smartphones.data.products,
                ...laptops.data.products,
                ...tablets.data.products,
                ...accessories.data.products,
            ];
        } else {
            const { data } = await dummyApi.get(`/products/category/${category}?limit=100`);
            return data.products || [];
        }
    } catch (error) {
        console.error('Failed to fetch products from dummyjson:', error.message);
        return [];
    }
};

// ── fetchProductById ──────────────────────────────────────────────────────────
export const fetchProductById = async (id) => {
    if (USE_DJANGO) {
        try {
            const { data } = await voltixApi.get(`/products/${id}/`);
            return data;
        } catch (error) {
            console.error('Failed to fetch product from Django:', error.message);
            return null;
        }
    }

    // dummyjson fallback
    try {
        const { data } = await dummyApi.get(`/products/${id}`);
        return data;
    } catch (error) {
        console.error('Failed to fetch product from dummyjson:', error.message);
        return null;
    }
};