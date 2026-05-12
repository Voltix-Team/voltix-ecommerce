import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const BASE_URL = process.env.REACT_APP_API_URL || 'http://127.0.0.1:8000/api';

// ── token helpers ─────────────────────────────────────────────────────────────
export const saveTokens   = (access, refresh) => {
    localStorage.setItem('voltix_access',  access);
    localStorage.setItem('voltix_refresh', refresh);
};
export const clearTokens  = () => {
    localStorage.removeItem('voltix_access');
    localStorage.removeItem('voltix_refresh');
};
export const getAccessToken  = () => localStorage.getItem('voltix_access');
export const getRefreshToken = () => localStorage.getItem('voltix_refresh');

// ── thunks ────────────────────────────────────────────────────────────────────

export const loadUserFromToken = createAsyncThunk(
    'user/loadFromToken',
    async (_, { rejectWithValue }) => {
        const token = getAccessToken();
        if (!token) return rejectWithValue('No token');
        const res = await fetch(`${BASE_URL}/auth/me/`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        if (!res.ok) return rejectWithValue('Token invalid');
        return await res.json();
    }
);

export const registerUser = createAsyncThunk(
    'user/register',
    async (formData, { rejectWithValue }) => {
        const res = await fetch(`${BASE_URL}/auth/register/`, {
            method:  'POST',
            headers: { 'Content-Type': 'application/json' },
            body:    JSON.stringify(formData),
        });
        const data = await res.json();
        if (!res.ok) return rejectWithValue(data);
        return data;
    }
);

export const verifyEmail = createAsyncThunk(
    'user/verifyEmail',
    async (formData, { rejectWithValue }) => {
        const res = await fetch(`${BASE_URL}/auth/verify-email/`, {
            method:  'POST',
            headers: { 'Content-Type': 'application/json' },
            body:    JSON.stringify(formData),
        });
        const data = await res.json();
        if (!res.ok) return rejectWithValue(data);
        return data;
    }
);

export const loginUser = createAsyncThunk(
    'user/login',
    async (formData, { rejectWithValue }) => {
        const res = await fetch(`${BASE_URL}/auth/login/`, {
            method:  'POST',
            headers: { 'Content-Type': 'application/json' },
            body:    JSON.stringify(formData),
        });
        const data = await res.json();
        if (!res.ok) return rejectWithValue(data);

        // ── BUG FIX: block unverified users on the frontend too ──────────────
        // Django's LoginSerializer does NOT check is_verified, so an unverified
        // user gets valid tokens back. We catch it here and reject cleanly so
        // Login.jsx can show the right error message instead of redirecting.
        if (!data.user?.is_verified) {
            return rejectWithValue({
                detail: 'Please verify your email before logging in.'
            });
        }
        // ─────────────────────────────────────────────────────────────────────

        saveTokens(data.access, data.refresh);
        return data;
    }
);

export const logoutUser = createAsyncThunk(
    'user/logout',
    async (_, { rejectWithValue }) => {
        const access  = getAccessToken();
        const refresh = getRefreshToken();
        try {
            await fetch(`${BASE_URL}/auth/logout/`, {
                method:  'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization:  `Bearer ${access}`,
                },
                body: JSON.stringify({ refresh }),
            });
        } catch {}
        clearTokens();
        return true;
    }
);

export const updateUserProfile = createAsyncThunk(
    'user/updateProfile',
    async (fields, { rejectWithValue }) => {
        const token = getAccessToken();
        const res = await fetch(`${BASE_URL}/auth/me/`, {
            method:  'PATCH',
            headers: {
                'Content-Type': 'application/json',
                Authorization:  `Bearer ${token}`,
            },
            body: JSON.stringify(fields),
        });
        const data = await res.json();
        if (!res.ok) return rejectWithValue(data);
        return data;
    }
);

export const requestPasswordReset = createAsyncThunk(
    'user/requestReset',
    async (email, { rejectWithValue }) => {
        const res = await fetch(`${BASE_URL}/auth/password-reset/`, {
            method:  'POST',
            headers: { 'Content-Type': 'application/json' },
            body:    JSON.stringify({ email }),
        });
        const data = await res.json();
        if (!res.ok) return rejectWithValue(data);
        return data;
    }
);

export const confirmPasswordReset = createAsyncThunk(
    'user/confirmReset',
    async (formData, { rejectWithValue }) => {
        const res = await fetch(`${BASE_URL}/auth/password-reset/confirm/`, {
            method:  'POST',
            headers: { 'Content-Type': 'application/json' },
            body:    JSON.stringify(formData),
        });
        const data = await res.json();
        if (!res.ok) return rejectWithValue(data);
        return data;
    }
);

// ── slice ─────────────────────────────────────────────────────────────────────

const userSlice = createSlice({
    name: 'user',
    initialState: {
        data:    null,
        // ── BUG FIX ──────────────────────────────────────────────────────────
        // Was `true`. That meant the app booted in a perpetual "loading" state
        // until loadUserFromToken resolved. Any route guard that reads
        // `loading === true && data === null` would redirect back to /login
        // AFTER a successful login + navigate("/"), undoing the redirect.
        // Start as `false`; loadUserFromToken sets it to true while it runs.
        // ─────────────────────────────────────────────────────────────────────
        loading: false,
        error:   null,
    },
    reducers: {
        clearError: (state) => { state.error = null; },
    },
    extraReducers: (builder) => {
        builder
        // loadUserFromToken — sets loading true ONLY while the token check runs
        .addCase(loadUserFromToken.pending,   (state) => { state.loading = true; })
        .addCase(loadUserFromToken.fulfilled, (state, action) => {
            state.data    = action.payload;
            state.loading = false;
        })
        .addCase(loadUserFromToken.rejected,  (state) => {
            state.data    = null;
            state.loading = false;
        })

        // loginUser
        .addCase(loginUser.pending,   (state) => { state.loading = true;  state.error = null; })
        .addCase(loginUser.fulfilled, (state, action) => {
            state.data    = action.payload.user;
            state.loading = false;
            state.error   = null;
        })
        .addCase(loginUser.rejected,  (state, action) => {
            state.loading = false;
            state.error   = action.payload;
        })

        // logoutUser
        .addCase(logoutUser.fulfilled, (state) => { state.data = null; state.loading = false; })
        .addCase(logoutUser.rejected,  (state) => { state.data = null; state.loading = false; })

        // updateUserProfile
        .addCase(updateUserProfile.fulfilled, (state, action) => {
            state.data  = action.payload;
            state.error = null;
        })
        .addCase(updateUserProfile.rejected, (state, action) => {
            state.error = action.payload;
        })

        // registerUser
        .addCase(registerUser.pending,   (state) => { state.loading = true;  state.error = null; })
        .addCase(registerUser.fulfilled, (state) => { state.loading = false; })
        .addCase(registerUser.rejected,  (state, action) => {
            state.loading = false;
            state.error   = action.payload;
        });
    },
});

export const { clearError } = userSlice.actions;
export default userSlice.reducer;