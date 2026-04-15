import { createSlice } from "@reduxjs/toolkit";

const ORDERS_STORAGE_KEY = 'voltix_orders';

const loadOrdersFromStorage = () => {
    try {
        const saved = localStorage.getItem(ORDERS_STORAGE_KEY);
        return saved ? JSON.parse(saved) : [];
    } catch (err) {
        console.error("Failed to load orders", err);
        return [];
    }
};

const saveOrdersToStorage = (orders) => {
    try {
        localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(orders));
    } catch (err) {
        console.error("Failed to save orders", err);
    }
};

const orderSlice = createSlice({
    name: 'orders',
    initialState: {
        items: loadOrdersFromStorage(),
    },
    reducers: {
        addOrder: (state, action) => {
            const newOrder = {
                id: `ord_${Date.now()}`,
                userEmail: action.payload.userEmail,   // Important for filtering per user
                createdAt: new Date().toISOString(),
                status: 'confirmed',
                ...action.payload,
            };

            state.items.unshift(newOrder); // newest first
            saveOrdersToStorage(state.items);
        },
        clearAllOrders: (state) => {
            state.items = [];
            localStorage.removeItem(ORDERS_STORAGE_KEY);
        },
    },
});

export const { addOrder, clearAllOrders } = orderSlice.actions;
export const selectAllOrders = (state) => state.orders.items;

export default orderSlice.reducer;