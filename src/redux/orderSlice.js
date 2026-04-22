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
        lastOrderId: null, // stores the most recently placed order ID
    },
    reducers: {
        addOrder: (state, action) => {
            const newOrder = {
                // generates an id that has vx as a prefix and a timestamp in milliseconds for the date now
                id: `VX-${Date.now()}`,
                userEmail: action.payload.userEmail,
                createdAt: new Date().toISOString(),
                status: 'confirmed',
                ...action.payload,
            };

            state.items.unshift(newOrder); // newest first
            state.lastOrderId = newOrder.id; // mutate draft only, no return
            saveOrdersToStorage(state.items);
        },
        clearAllOrders: (state) => {
            state.items = [];
            state.lastOrderId = null;
            localStorage.removeItem(ORDERS_STORAGE_KEY);
        },
    },
});

export const { addOrder, clearAllOrders } = orderSlice.actions;
export const selectAllOrders = (state) => state.orders.items;
export const selectLastOrderId = (state) => state.orders.lastOrderId;

export default orderSlice.reducer;