import { createSlice } from "@reduxjs/toolkit";
import { logoutUser } from './userSlice';

// 1. Helper to load cart from localStorage
const loadCart = () => {
    try {
        const savedCart = localStorage.getItem('cartItems');
        return savedCart ? JSON.parse(savedCart) : [];
    } catch (err) {
        return [];
    }
};

// 2. Helper to save cart to localStorage
const saveCart = (items) => {
    localStorage.setItem('cartItems', JSON.stringify(items));
};

const cartSlice = createSlice({
    name: 'cart',
    initialState: {
        items: loadCart(), // Initialize with saved data
    },
    reducers: {
        addToCart: (state, action) => {
            const existing = state.items.find(item => item.id === action.payload.id);
            if (existing) {
                existing.quantity += 1;
            } else {
                state.items.push({ ...action.payload, quantity: 1 });
            }
            saveCart(state.items); // Save after adding
        },
        updateQuantity: (state, action) => {
            const { id, quantity } = action.payload;
            const item = state.items.find(item => item.id === id);
            if (item) {
                item.quantity = quantity;
            }
            saveCart(state.items); // Save after updating
        },
        removeFromCart: (state, action) => {
            state.items = state.items.filter(item => item.id !== action.payload);
            saveCart(state.items); // Save after removing
        },
        clearCart: (state) => {
            state.items = [];
            localStorage.removeItem('cartItems'); // Clear storage
        },
    },
    extraReducers: (builder) => {
        builder.addCase(logoutUser.fulfilled, (state) => {
            state.items = [];
            localStorage.removeItem('cartItems');
        });
    },
});

export const { addToCart, updateQuantity, removeFromCart, clearCart } = cartSlice.actions;

export const selectCartItems = (state) => state.cart.items;
export const selectCartCount = (state) => state.cart.items.reduce((total, item) => total + item.quantity, 0);
export const selectCartTotal = (state) => 
    state.cart.items.reduce((total, item) => total + (Number(item.price) * item.quantity), 0);

export default cartSlice.reducer;