/* eslint-disable @typescript-eslint/no-explicit-any */
import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";

interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
    _retry?: boolean;
}

// DEBUG
const isDebug = process.env.NODE_ENV !== "production";
const baseUrl = process.env.API_URL;

const apiClient = axios.create({
    baseURL: baseUrl,
    timeout: 5000,
    headers: { "Content-Type": "application/json" }
});

let isRefreshing = false; // Flag to keep track of the token refresh status
let failedQueue: any = []; // An array to keep track of the failed requests

// Function to refresh token
const processQueue = (error: any, token: string | null = null) => {
    failedQueue.forEach((prom: any) => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });
    failedQueue = [];
};

// Add a request interceptor
apiClient.interceptors.request.use(
    function (config) {
        if (isDebug) {
            // can output log here
        }

        // Do something before the request is sent
        const token = localStorage.getItem("accessToken"); // Retrieve auth token from localStorage
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    function (error) {
        // Handle the error
        return Promise.reject(error);
    }
);

// Add a response interceptor
apiClient.interceptors.response.use(
    function (response) {
        // Do something with the response data
        if (isDebug) {
            // can output log here
            // console.log('Response:', response);
        }

        return response;
    },
    async function (error: AxiosError) {
        // Handle the response error
        if (isDebug) {
            // console.log('Error:', error);
        }

        const originalRequest = error.config as CustomAxiosRequestConfig;

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true; // Add this to prevent infinite loop

            if (!isRefreshing) {
                isRefreshing = true;

                try {
                    const refreshToken = localStorage.getItem("refreshToken");
                    if (!refreshToken) {
                        throw new Error("No refresh token available");
                    }

                    // Call the refresh token API
                    const response = await axios.post(`${baseUrl}/user/refresh`, {
                        token: refreshToken
                    });

                    const newAccessToken = response.data.accessToken;

                    // Update the token in local storage
                    localStorage.setItem("accessToken", newAccessToken);

                    // Process the failed requests
                    processQueue(null, newAccessToken);
                } catch (refreshError) {
                    processQueue(refreshError, null);
                    return Promise.reject(refreshError);
                } finally {
                    isRefreshing = false;
                }
            }

            // Return the promise for the original request
            return new Promise((resolve, reject) => {
                failedQueue.push({
                    resolve: (token: string) => {
                        if (originalRequest.headers) {
                            originalRequest.headers.Authorization = `Bearer ${token}`;
                        }
                        resolve(apiClient(originalRequest));
                    },
                    reject: (err: any) => reject(err)
                });
            });
        }

        return Promise.reject(error);
    }
);

export default apiClient;
