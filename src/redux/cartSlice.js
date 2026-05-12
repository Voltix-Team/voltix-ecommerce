import { createSlice, createSelector } from "@reduxjs/toolkit";
import { logoutUser } from './userSlice';

// ── localStorage helpers ──────────────────────────────────────────────────────
const loadCart = () => {
    try {
        const savedCart = localStorage.getItem('cartItems');
        return savedCart ? JSON.parse(savedCart) : [];
    } catch {
        return [];
    }
};

const saveCart = (items) => {
    localStorage.setItem('cartItems', JSON.stringify(items));
};

// ── Discount helper (supports Django snake_case & dummyjson camelCase) ────────
const getDiscountedPrice = (item) => {
    const discount = item.discount_percentage ?? item.discountPercentage ?? 0;
    return discount > 0
        ? Math.round(item.price * (1 - discount / 100))
        : Number(item.price);
};
// ─────────────────────────────────────────────────────────────────────────────

const cartSlice = createSlice({
    name: 'cart',
    initialState: {
        items: loadCart(),
    },
    reducers: {
        addToCart: (state, action) => {
            const existing = state.items.find(item => item.id === action.payload.id);
            if (existing) {
                existing.quantity += 1;
            } else {
                state.items.push({ ...action.payload, quantity: 1 });
            }
            saveCart(state.items);
        },

        // Supports both:
        //   { id, delta: +1 / -1 }  ← used by Cart.jsx stepper buttons
        //   { id, quantity: N }      ← direct set (kept for backwards compat)
        updateQuantity: (state, action) => {
            const { id, delta, quantity } = action.payload;
            const item = state.items.find(item => item.id === id);
            if (!item) return;

            if (delta !== undefined) {
                const next = item.quantity + delta;
                if (next <= 0) {
                    // Remove item when decremented below 1
                    state.items = state.items.filter(i => i.id !== id);
                } else {
                    item.quantity = next;
                }
            } else if (quantity !== undefined) {
                if (quantity <= 0) {
                    state.items = state.items.filter(i => i.id !== id);
                } else {
                    item.quantity = quantity;
                }
            }
            saveCart(state.items);
        },

        removeFromCart: (state, action) => {
            state.items = state.items.filter(item => item.id !== action.payload);
            saveCart(state.items);
        },

        clearCart: (state) => {
            state.items = [];
            localStorage.removeItem('cartItems');
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

// ── Selectors ─────────────────────────────────────────────────────────────────
export const selectCartItems = (state) => state.cart.items;

/** Total number of units across all cart items (for nav badge etc.) */
export const selectCartCount = (state) =>
    state.cart.items.reduce((total, item) => total + item.quantity, 0);

/** Subtotal using discounted unit prices — memoised to avoid re-renders */
export const selectCartTotal = createSelector(
    selectCartItems,
    (items) =>
        items.reduce(
            (total, item) => total + getDiscountedPrice(item) * item.quantity,
            0
        )
);

/** Original (pre-discount) total — useful for showing savings */
export const selectCartOriginalTotal = createSelector(
    selectCartItems,
    (items) =>
        items.reduce(
            (total, item) => total + Number(item.price) * item.quantity,
            0
        )
);

/** Total amount saved across all discounted items */
export const selectCartSavings = createSelector(
    selectCartOriginalTotal,
    selectCartTotal,
    (original, discounted) => original - discounted
);

export default cartSlice.reducer;