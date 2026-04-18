import { createSlice } from "@reduxjs/toolkit";

const WISHLIST_STORAGE_KEY = 'voltix_wishlist';
const LEGACY_WISHLIST_KEY = 'wishlist';

const loadWishlistFromStorage = () => {
    try {
        const saved = localStorage.getItem(WISHLIST_STORAGE_KEY);
        if (saved) return JSON.parse(saved);

        // one-time migration from the old localStorage-based wishlist
        const legacy = localStorage.getItem(LEGACY_WISHLIST_KEY);
        if (legacy) {
            const parsed = JSON.parse(legacy);
            localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(parsed));
            localStorage.removeItem(LEGACY_WISHLIST_KEY);
            return parsed;
        }
        return [];
    } catch (err) {
        console.error("Failed to load wishlist from localStorage", err);
        return [];
    }
};

const saveWishlistToStorage = (items) => {
    try {
        localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(items));
    } catch (err) {
        console.error("Failed to save wishlist to localStorage", err);
    }
};

const wishlistSlice = createSlice({
    name: 'wishlist',
    initialState: {
        items: loadWishlistFromStorage(),
    },
    reducers: {
        toggleWishlist: (state, action) => {
            const product = action.payload;
            const exists = state.items.some(item => item.id === product.id);
            state.items = exists
                ? state.items.filter(item => item.id !== product.id)
                : [...state.items, product];
            saveWishlistToStorage(state.items);
        },
        removeFromWishlist: (state, action) => {
            state.items = state.items.filter(item => item.id !== action.payload);
            saveWishlistToStorage(state.items);
        },
        clearWishlist: (state) => {
            state.items = [];
            localStorage.removeItem(WISHLIST_STORAGE_KEY);
        },
    },
});

export const { toggleWishlist, removeFromWishlist, clearWishlist } = wishlistSlice.actions;

export const selectWishlistItems = (state) => state.wishlist.items;
export const selectWishlistCount = (state) => state.wishlist.items.length;
export const selectIsInWishlist = (id) => (state) =>
    state.wishlist.items.some(item => item.id === id);

export default wishlistSlice.reducer;
