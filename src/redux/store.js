import { configureStore } from '@reduxjs/toolkit';
import cartReducer from './cartSlice';
import orderReducer from './orderSlice';

const store = configureStore({
    reducer: {
        cart: cartReducer,
        orders: orderReducer,
    },
});

export default store;