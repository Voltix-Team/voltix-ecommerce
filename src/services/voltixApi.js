import axios from 'axios';
import { getAccessToken } from '../redux/userSlice';

const voltixApi = axios.create({
    baseURL: process.env.REACT_APP_VOLTIX_API_BASE_URL || 'http://localhost:8000/api',
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});

voltixApi.interceptors.request.use((config) => {
    const token = getAccessToken();
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default voltixApi;
