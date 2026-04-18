import { configureStore } from '@reduxjs/toolkit';
import cartReducer from './cartSlice';
import orderReducer from './orderSlice';
import wishlistReducer from './wishlistSlice';

const store = configureStore({
    reducer: {
        cart: cartReducer,
        orders: orderReducer,
        wishlist: wishlistReducer,
    },
});

export default store;