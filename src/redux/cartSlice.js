import { createSlice } from "@reduxjs/toolkit";
import { logoutUser } from './userSlice';

const cartSlice = createSlice({
    name: 'cart',
    initialState: {
        items: [],
    },
    reducers: {
        addToCart: (state, action) => {
            const existing = state.items.find(item => item.id === action.payload.id);
            if (existing) {
                existing.quantity += 1;
            } else {
                state.items.push({ ...action.payload, quantity: 1 });
            }
        },
        updateQuantity: (state, action) => {
            const { id, delta } = action.payload;
            const item = state.items.find(item => item.id === id);
            if (item) {
                item.quantity = Math.max(1, item.quantity + delta);
            }
        },
        removeFromCart: (state, action) => {
            state.items = state.items.filter(item => item.id !== action.payload);
        },
        clearCart: (state) => {
            state.items = [];
        },
    },
    extraReducers: (builder) => {
        builder.addCase(logoutUser.fulfilled, (state) => {
            state.items = [];
        });
    },
});

export const { addToCart, updateQuantity, removeFromCart, clearCart } = cartSlice.actions;

export const selectCartItems = (state) => state.cart.items;
export const selectCartCount = (state) => state.cart.items.reduce((sum, item) => sum + item.quantity, 0);
export const selectCartTotal = (state) => state.cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0);

export default cartSlice.reducer;
