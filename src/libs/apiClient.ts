/* eslint-disable @typescript-eslint/no-explicit-any */
import { toast } from "@store/toastStore";
import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import Cookies from "js-cookie";

interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
    _retry?: boolean;
}

// DEBUG
const isDebug = process.env.NODE_ENV !== "production";
const baseUrl = "/api";
const secretKey = "clever-link";

const apiClient = axios.create({
    baseURL: baseUrl,
    timeout: 5000,
    headers: { "Content-Type": "application/json", secret: secretKey }
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
        const token = localStorage.getItem("access-token"); // Retrieve auth token from localStorage

        config.headers.token = token || "token";

        return config;
    },
    function (error) {
        // Handle the error
        return Promise.reject(error);
    }
);

// Add a response interceptor
apiClient.interceptors.response.use(
    async function (response) {
        // Do something with the response data
        if (isDebug) {
            // can output log here
            // console.log('Response:', response);
        }

        if (response.data?.err === 1) {
            toast.error({
                title: "API Error",
                description: response.data.msg?.message || "Unknown error"
            });
        }

        return response.data;
    },
    async function (error: AxiosError) {
        // Handle the response error
        if (isDebug) {
            // console.log("Error:", error);
            if (error.status !== 401) {
                toast.error({
                    title: "API Error",
                    description: error.message
                });
            }
        }

        const originalRequest = error.config as CustomAxiosRequestConfig;

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true; // Add this to prevent infinite loop

            if (!isRefreshing) {
                isRefreshing = true;

                try {
                    const refreshToken = Cookies.get("refresh-token");
                    if (!refreshToken) {
                        throw new Error("No refresh token available");
                    }

                    // Call the refresh token API
                    const response = await axios.post(`${baseUrl}/user/refresh`, {
                        token: refreshToken
                    });

                    const newAccessToken = response.data.accessToken;
                    const newRefreshToken = response.data.refreshToken;

                    // Update the token in local storage
                    localStorage.setItem("access-token", newAccessToken);
                    Cookies.set("refresh-token", newRefreshToken);

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
