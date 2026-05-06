import axios from 'axios';
import { auth } from '../firebase/firebaseConfig';

const voltixApi = axios.create({
    baseURL: process.env.REACT_APP_VOLTIX_API_BASE_URL || 'http://localhost:8000/api',
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});

voltixApi.interceptors.request.use(async (config) => {
    const user = auth.currentUser;
    if (user) {
        const token = await user.getIdToken();
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default voltixApi;
