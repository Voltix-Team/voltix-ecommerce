import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import voltixApi from "../services/voltixApi";
import { logoutUser } from "./userSlice";

// Fetch all orders for the logged-in user
export const fetchOrders = createAsyncThunk(
    'orders/fetch',
    async (_, { rejectWithValue }) => {
        try {
            const { data } = await voltixApi.get('/orders/');
            return data;
        } catch (err) {
            return rejectWithValue(err.response?.data?.error || err.message);
        }
    }
);

// Place a new order
export const placeOrder = createAsyncThunk(
    'orders/place',
    async (orderData, { rejectWithValue }) => { // Change _ to orderData
        try {
            // Pass orderData into the POST request
            const { data } = await voltixApi.post('/orders/', orderData);
            return data;
        } catch (err) {
            // Return the full error object so we can see what's wrong
            return rejectWithValue(err.response?.data || err.message);
        }
    }
);

const orderSlice = createSlice({
    name: 'orders',
    initialState: {
        items: [],
        status: 'idle',
        error: null,
        placeStatus: 'idle',
        placeError: null,
        lastOrderId: null,
    },
    reducers: {
        clearPlaceState: (state) => {
            state.placeStatus = 'idle';
            state.placeError = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchOrders.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchOrders.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.items = action.payload;
            })
            .addCase(fetchOrders.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            })
            .addCase(placeOrder.pending, (state) => {
                state.placeStatus = 'loading';
                state.placeError = null;
            })
            .addCase(placeOrder.fulfilled, (state, action) => {
                state.placeStatus = 'succeeded';
                state.lastOrderId = action.payload.id;
                state.items.unshift(action.payload);
            })
            .addCase(placeOrder.rejected, (state, action) => {
                state.placeStatus = 'failed';
                state.placeError = action.payload;
            })
            .addCase(logoutUser.fulfilled, (state) => {
                state.items = [];
                state.status = 'idle';
                state.error = null;
                state.placeStatus = 'idle';
                state.placeError = null;
                state.lastOrderId = null;
            });
    },
});

export const { clearPlaceState } = orderSlice.actions;

export const selectAllOrders   = (state) => state.orders.items;
export const selectOrdersStatus = (state) => state.orders.status;
export const selectOrdersError  = (state) => state.orders.error;
export const selectLastOrderId  = (state) => state.orders.lastOrderId;
export const selectPlaceStatus  = (state) => state.orders.placeStatus;
export const selectPlaceError   = (state) => state.orders.placeError;

export default orderSlice.reducer;