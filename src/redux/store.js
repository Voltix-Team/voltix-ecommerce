import { configureStore } from '@reduxjs/toolkit';
import cartReducer from './cartSlice';
import orderReducer from './orderSlice';
import wishlistReducer from './wishlistSlice';
import userReducer from './userSlice';

// STEP B : building the store  -> a Component that will have our data 
const store = configureStore({
    // This combines three slice reducers into one store. 
    reducer: {
        cart: cartReducer,
        orders: orderReducer,
        wishlist: wishlistReducer,
        user: userReducer,
    },
    middleware  : (getDefaultMiddleware) => getDefaultMiddleware({
        serializableCheck: false, // Disable serializability check for actions and state required foir Firebase objects like User
    }),
});

export default store;