// src/services/api.js
const BASE_URL = 'https://dummyjson.com';

// Fetch products (only electronics)
export const fetchProducts = async (category = 'all') => {
  try {
    let url;

    if (category === 'all') {
      const categories = ['smartphones', 'laptops', 'tablets', 'mobile-accessories'];
      const promises = categories.map(cat => 
        fetch(`${BASE_URL}/products/category/${cat}`).then(res => res.json())
      );
      
      const results = await Promise.all(promises);
      return results.flatMap(data => data.products || []);
      
    } else {
      const res = await fetch(`${BASE_URL}/products/category/${category}`);
      const data = await res.json();
      return data.products || [];
    }
  } catch (error) {
    console.error("Failed to fetch products:", error);
    return [];
  }
};

// Fetch single product by ID (for Product Details page)
export const fetchProductById = async (id) => {
  try {
    const res = await fetch(`${BASE_URL}/products/${id}`);
    if (!res.ok) throw new Error('Product not found');
    return await res.json();
  } catch (error) {
    console.error("Failed to fetch product by ID:", error);
    return null;
  }
};