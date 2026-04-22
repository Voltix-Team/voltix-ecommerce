import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { auth } from '../firebase/firebaseConfig';
import { onAuthStateChanged, signOut, updateProfile } from 'firebase/auth';
import { redirect } from 'react-router-dom';


const loadExtras = (uid) => {
    try {
        const saved = localStorage.getItem(`user_extras_${uid}`);
        return saved ? JSON.parse(saved) : {};
    } catch { return {}; }
};

const saveExtras = (uid, fields) => {
    try {
        localStorage.setItem(`user_extras_${uid}`, JSON.stringify(fields));
    } catch {}
};

const buildUser = (firebaseUser) => {
    const extras = loadExtras(firebaseUser.uid);
    return {
        uid: firebaseUser.uid,
        name: firebaseUser.displayName || firebaseUser.email.split('@')[0],
        email: firebaseUser.email,
        phone: extras.phone || '',
        avatar: firebaseUser.photoURL || null,
        memberSince: firebaseUser.metadata?.creationTime
            ? new Date(firebaseUser.metadata.creationTime).toLocaleDateString('en-US', {
                month: 'long', year: 'numeric'
            })
            : 'Unknown',
        address: extras.address || { street: '', suite: '', city: '', state: '', zip: '', country: '' },
    };
};

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
        data: null,
        loading: true,
    },
    reducers: {
        setUser: (state, action) => {
            state.data = action.payload ? buildUser(action.payload) : null;
            state.loading = false;
        },
        setLoading: (state, action) => {
            state.loading = action.payload;
        }
    },
    extraReducers: (builder) => {
    builder
        .addCase(logoutUser.pending, (state) => {
            state.loading = true; // ← forces UI to wait
        })
        .addCase(logoutUser.fulfilled, (state) => {
            state.data = null;
        })
        .addCase(logoutUser.rejected, (state, action) => {
            console.error('Logout failed:', action.error.message);
        })
        .addCase(updateUserProfile.fulfilled, (state, action) => {
            if (state.data && action.payload) {
                state.data = {
                    ...state.data,
                    name: action.payload.name || state.data.name,
                    phone: action.payload.phone ?? state.data.phone,
                    address: {
                        ...(state.data.address || {}),
                        ...(action.payload.address || {})
                    }
                };
                saveExtras(state.data.uid, {
                    phone: state.data.phone,
                    address: state.data.address,
                });
            }
        });
},
});
export const { setUser, setLoading } = userSlice.actions;
export default userSlice.reducer;