import type { BaseQueryFn } from '@reduxjs/toolkit/query'
import type { AxiosRequestConfig, AxiosError } from 'axios'
import axios from "axios";

const baseURL = import.meta.env.VITE_BASE_API || "http://localhost:3000";
const axiosInstance = axios.create({ baseURL });

export const axiosBaseQuery =
    (p0: { baseUrl: string }): BaseQueryFn<
        {
            url: string
            method: AxiosRequestConfig['method']
            data?: AxiosRequestConfig['data']
            params?: AxiosRequestConfig['params']
        },
        unknown,
        unknown
    > =>
        async ({ url, method, data, params }) => {
            try {
                // Get token from localStorage or your auth store
                const token = localStorage.getItem('token');
                const headers = token ? { Authorization: `Bearer ${token}` } : {};
                const result = await axiosInstance({ url, method, data, params, headers });
                return { data: result.data }
            } catch (axiosError) {
                const err = axiosError as AxiosError
                return {
                    error: {
                        status: err.response?.status || 500,
                        data: err.response?.data || err.message,
                    },
                }
            }
        }
