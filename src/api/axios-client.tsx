import axios, { type Method } from 'axios';

const baseURL = import.meta.env.VITE_BASE_API || '';

const api = axios.create({
    baseURL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export interface ApiOptions<T = unknown> {
    method?: Method;
    url: string;
    data?: T;
    params?: Record<string, string | number>;
    headers?: Record<string, string>;
}

export async function apiCall<R = unknown, B = unknown>(options: ApiOptions<B>): Promise<R> {
    const allowedMethods: Method[] = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'HEAD', 'OPTIONS'];
    const method = (options.method || 'GET').toUpperCase() as Method;
    if (!allowedMethods.includes(method)) {
        throw new Error(`Invalid HTTP method: ${options.method}`);
    }

    // Validate url
    if (!options.url || typeof options.url !== 'string' || !options.url.trim()) {
        throw new Error('the url option is required and must be a non-empty string.');
    }

    const response = await api.request<R>({
        method,
        url: options.url,
        data: options.data,
        params: options.params,
        headers: options.headers,
    });
    return response.data;
}