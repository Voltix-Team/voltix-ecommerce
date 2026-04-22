import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { auth } from '../firebase/firebaseConfig';
import { onAuthStateChanged, signOut, updateProfile } from 'firebase/auth';
import { redirect } from 'react-router-dom';


const buildUser = (firebaseUser) => ({
    uid: firebaseUser.uid,
    name: firebaseUser.displayName || firebaseUser.email.split('@')[0],
    email: firebaseUser.email,
    phone: '',
    avatar: firebaseUser.photoURL || null,
    memberSince: firebaseUser.metadata?.creationTime
        ? new Date(firebaseUser.metadata.creationTime).toLocaleDateString('en-US', {
            month: 'long', year: 'numeric'
        })
        : 'Unknown',
    address: { street: '', suite: '', city: '', state: '', zip: '', country: '' },
});

/* used createAsyncThunk to handle async operations API Calls */
export const logoutUser = createAsyncThunk('user/Logout', async () => {
    await signOut(auth);
});

export const updateUserProfile = createAsyncThunk('user/updateProfile', async (fields) => {
    const firebaseUser = auth.currentUser;
    if (!firebaseUser) return;
    if (fields.name && fields.name !== firebaseUser.displayName) {
        await updateProfile(firebaseUser, { displayName: fields.name });
    }
    return fields;
});

const userSlice = createSlice({
    name: 'user', initialState: {
        date: null,// start with null to indicate no user is logged in
        Loading: true,//it create an initial loading until we check the auth state and wont redirect to login page until we know the auth state
    },
    reducers: {
        setUser: (state, action) => {
            state.data = action.payload ? buildUser(action.payload) : null;
            state.Loading = false;
        },
        setLoading: (state, action) => {
            state.Loading = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder.addCase(logoutUser.fulfilled, (state) => {
            state.data = null;
        })
            builder.addCase(updateUserProfile.fulfilled, (state, action) => {
                if (state.data && action.payload) {
                 
                    state.data = {
                        ...state.data,
                        name: action.payload.name || state.data.name,
                        phone: action.payload.phone || state.data.phone,
                        // Merge address separately to keep it as an object
                        address: {
                            ...(state.data.address || {}),
                            ...(action.payload.address || {})
                        }
                    };
                }
            });
    },
});
export const { setUser, setLoading } = userSlice.actions;
export default userSlice.reducer;