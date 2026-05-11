// src/services/voltixApi.js
// Central axios instance for all Django backend API calls.
// Automatically attaches the JWT access token to every request.
// Also handles token expiry — if a 401 is returned, it tries to refresh
// the access token automatically before retrying the request.

import axios from 'axios';
import { getAccessToken, getRefreshToken, saveTokens, clearTokens } from '../redux/userSlice';

const voltixApi = axios.create({
    baseURL: process.env.REACT_APP_API_URL || 'http://127.0.0.1:8000/api',
    timeout: 10000,
    headers: { 'Content-Type': 'application/json' },
});

// attach access token to every request automatically
voltixApi.interceptors.request.use((config) => {
    const token = getAccessToken();
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

// handle token expiry automatically
voltixApi.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            const refresh = getRefreshToken();
            if (!refresh) {
                clearTokens();
                window.location.href = '/login';
                return Promise.reject(error);
            }
            try {
                const res = await axios.post(
                    `${process.env.REACT_APP_API_URL || 'http://127.0.0.1:8000/api'}/auth/token/refresh/`,
                    { refresh }
                );
                saveTokens(res.data.access, refresh);
                originalRequest.headers.Authorization = `Bearer ${res.data.access}`;
                return voltixApi(originalRequest);
            } catch {
                clearTokens();
                window.location.href = '/login';
                return Promise.reject(error);
            }
        }
        return Promise.reject(error);
    }
);

export default voltixApi;