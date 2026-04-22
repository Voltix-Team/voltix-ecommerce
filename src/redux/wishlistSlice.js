import { createSlice } from "@reduxjs/toolkit";
import { logoutUser } from './userSlice';

const getWishlistKey = (uid) => `voltix_wishlist_${uid}`;
const LEGACY_WISHLIST_KEY = 'wishlist';

const loadWishlistFromStorage = (uid) => {
    try {
        const saved = localStorage.getItem(getWishlistKey(uid));
        if (saved) return JSON.parse(saved);

        // one-time migration from the old localStorage-based wishlist
        const legacy = localStorage.getItem(LEGACY_WISHLIST_KEY);
        if (legacy) {
            const parsed = JSON.parse(legacy);
            localStorage.setItem(getWishlistKey(uid), JSON.stringify(parsed));
            localStorage.removeItem(LEGACY_WISHLIST_KEY);
            return parsed;
        }
        return [];
    } catch (err) {
        console.error("Failed to load wishlist from localStorage", err);
        return [];
    }
};

const saveWishlistToStorage = (uid, items) => {
    try {
        if (uid) localStorage.setItem(getWishlistKey(uid), JSON.stringify(items));
    } catch (err) {
        console.error("Failed to save wishlist to localStorage", err);
    }
};

// this single call gives you a reducer and a action creators 
const wishlistSlice = createSlice({
    name: 'wishlist',
    initialState: {
        uid: null,
        items: [],
    },
    reducers: {
        loadWishlist: (state, action) => {
            // called when user logs in, loads their specific wishlist
            state.uid = action.payload.uid;
            state.items = action.payload.uid ? loadWishlistFromStorage(action.payload.uid) : [];
        },
        // these are the action creators -> functions thate build a action object for you 
        toggleWishlist: (state, action) => {
            const product = action.payload;
            const exists = state.items.some(item => item.id === product.id);
            state.items = exists
                ? state.items.filter(item => item.id !== product.id)
                : [...state.items, product];
            saveWishlistToStorage(state.uid, state.items);
        },
        removeFromWishlist: (state, action) => {
            state.items = state.items.filter(item => item.id !== action.payload);
            saveWishlistToStorage(state.uid, state.items);
        },
        clearWishlist: (state) => {
            state.items = [];
            if (state.uid) localStorage.removeItem(getWishlistKey(state.uid));
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(logoutUser.fulfilled, (state) => {
                if (state.uid) localStorage.removeItem(getWishlistKey(state.uid));
                state.items = [];
                state.uid = null;
            })
            .addCase(logoutUser.rejected, (state, action) => {
                console.error('Logout failed, wishlist preserved:', action.error.message);
        });
    },
});

export const { loadWishlist, toggleWishlist, removeFromWishlist, clearWishlist } = wishlistSlice.actions;

export const selectWishlistItems = (state) => state.wishlist.items;
export const selectWishlistCount = (state) => state.wishlist.items.length;
export const selectIsInWishlist = (id) => (state) =>
    state.wishlist.items.some(item => item.id === id);

export default wishlistSlice.reducer;