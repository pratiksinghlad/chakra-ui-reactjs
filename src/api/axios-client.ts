import axios, { AxiosError } from 'axios';

const API_BASE_URL = 'https://jsonplaceholder.typicode.com';

/**
 * Base axios instance with default configuration
 */
export const axiosClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

/**
 * Global response interceptor for unified error handling
 */
axiosClient.interceptors.response.use(
    (response) => response,
    (error: AxiosError) => {
        const message = error.response?.data
            ? (error.response.data as { message?: string }).message || error.message
            : error.message;

        // You could add logging or toast notifications here
        console.error(`[API Error] ${error.config?.url}:`, message);

        return Promise.reject({
            message: message || 'An unexpected error occurred',
            status: error.response?.status,
            code: error.code,
        });
    }
);
