import { createSlice } from "@reduxjs/toolkit";

//createSlice is a helper from RTK that lets us define our state, actions and reducer all in one place instead of 3 separate files

// Helper functions for localStorage
const CART_STORAGE_KEY = 'voltix_cart';

const loadCartFromStorage = () => {
    try {
        const savedCart = localStorage.getItem(CART_STORAGE_KEY);
        return savedCart ? JSON.parse(savedCart) : [];
    } catch (err) {
        console.error("Failed to load cart from localStorage", err);
        return [];
    }
};

const saveCartToStorage = (cart) => {
    try {
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    } catch (err) {
        console.error("Failed to save cart to localStorage", err);
    }
};

const cartSlice = createSlice ({
    name : 'cart',
    //how the cart will look like initially when the app first loads
    initialState : {
        items : loadCartFromStorage(),   // ← Now loads from localStorage
    },
    /* each function inside the reducers is one action handler
    state is the current cart state
    action.payload is the data passed with the action */
    reducers : {
        addToCart : (state, action) => {
            //checking if the product already exists in the cart to increment the quantity by one, otherwise adds it as a new item
            const existing = state.items.find(item => item.id === action.payload.id);
            if (existing) {
                existing.quantity += 1;
            }
            else {
                state.items.push({...action.payload, quantity : 1});
            }
            saveCartToStorage(state.items);   // ← Save after adding
        },
        updateQuantity : (state, action) => {
            //delta is either +1 or -1 ( buttons in cart for each product )
            const { id, delta } = action.payload;
            const item = state.items.find(item => item.id === id);
            if (item) {
                //preventing quantity from going below 1
                item.quantity = Math.max(1, item.quantity + delta);
            }
            saveCartToStorage(state.items);   // ← Save after update
        },
        removeFromCart : (state, action) => {
            //keeping the items that do not match the id we want to remove inside the cart
            state.items = state.items.filter(item => item.id !== action.payload);
            saveCartToStorage(state.items);   // ← Save after removing
        },
        clearCart : (state, action) => {
            state.items = [];
            localStorage.removeItem(CART_STORAGE_KEY);   // ← Clear from storage too
        },
    },
});

//action creators, functions we call using dispatch()
export const { addToCart, updateQuantity, removeFromCart, clearCart } = cartSlice.actions;

//selectors : functions that take the full redux state and return a specific part of it
export const selectCartItems = (state) => state.cart.items;
export const selectCartCount = (state) => state.cart.items.reduce((sum, item) => sum + item.quantity, 0);
export const selectCartTotal = (state) => state.cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0);

export default cartSlice.reducer;