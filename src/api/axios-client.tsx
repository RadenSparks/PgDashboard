import axios, { AxiosError, type InternalAxiosRequestConfig } from 'axios';

const baseURL = import.meta.env.VITE_BASE_API || '';

const api = axios.create({
    baseURL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor: add token if exists
api.interceptors.request.use(
    (config: InternalAxiosRequestConfig<any>) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers = config.headers || {};
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error: AxiosError) => Promise.reject(error)
);

// Response interceptor: handle errors globally
api.interceptors.response.use(
    response => response,
    (error: AxiosError) => {
        // Optionally handle 401/403 or show a toast
        if (error.response && error.response.status === 401) {
            // For example, redirect to login or clear storage
            localStorage.removeItem('token');
            localStorage.removeItem('username');
            localStorage.removeItem('role');
            window.location.href = '/signin';
        }
        return Promise.reject(error);
    }
);

export default api;