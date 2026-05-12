import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import voltixApi from "../services/voltixApi";
import { logoutUser } from './userSlice';

export const fetchWishlist = createAsyncThunk(
    'wishlist/fetch',
    async (_, { rejectWithValue }) => {
        try {
            const { data } = await voltixApi.get('/wishlist/');
            return data;
        } catch (err) {
            return rejectWithValue(err.response?.data?.error || err.message);
        }
    }
);

export const toggleWishlist = createAsyncThunk(
    'wishlist/toggle',
    async (productId, { rejectWithValue }) => {
        try {
            const { data } = await voltixApi.post('/wishlist/', { product_id: productId });
            return { productId, ...data };
        } catch (err) {
            return rejectWithValue(err.response?.data?.error || err.message);
        }
    }
);

const wishlistSlice = createSlice({
    name: 'wishlist',
    initialState: {
        items: [],
        status: 'idle',
        error: null,
        togglingIds: [],
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchWishlist.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(fetchWishlist.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.items = action.payload;
            })
            .addCase(fetchWishlist.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            })

            .addCase(toggleWishlist.pending, (state, action) => {
                state.togglingIds.push(action.meta.arg);
            })
            .addCase(toggleWishlist.fulfilled, (state, action) => {
                const { productId, is_wishlisted } = action.payload;
                state.togglingIds = state.togglingIds.filter(id => id !== productId);
                if (is_wishlisted === false) {
                    state.items = state.items.filter(item => item.product?.id !== productId);
                }
                // when newly added, the next fetchWishlist call (or selector ui) will show it
                // we optimistically mark presence by appending a stub if not already present
                if (is_wishlisted === true && !state.items.some(item => item.product?.id === productId)) {
                    state.items.push({ id: `tmp-${productId}`, product: { id: productId } });
                }
            })
            .addCase(toggleWishlist.rejected, (state, action) => {
                state.togglingIds = state.togglingIds.filter(id => id !== action.meta.arg);
                state.error = action.payload;
            })

            .addCase(logoutUser.fulfilled, (state) => {
                state.items = [];
                state.status = 'idle';
                state.error = null;
                state.togglingIds = [];
            });
    },
});

export default wishlistSlice.reducer;

export const selectWishlistItems = (state) => state.wishlist.items;
export const selectWishlistStatus = (state) => state.wishlist.status;
export const selectWishlistError = (state) => state.wishlist.error;
export const selectWishlistCount = (state) => state.wishlist.items.length;
export const selectIsInWishlist = (productId) => (state) =>
    state.wishlist.items.some(item => item.product?.id === productId);
export const selectIsToggling = (productId) => (state) =>
    state.wishlist.togglingIds.includes(productId);
