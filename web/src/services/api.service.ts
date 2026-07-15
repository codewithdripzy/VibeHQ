import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3005";

class ApiService {
    private client: AxiosInstance;

    constructor() {
        this.client = axios.create({
            baseURL: API_BASE_URL,
            timeout: 15000,
            headers: { "Content-Type": "application/json" },
            withCredentials: true,
        });

        this.client.interceptors.request.use((config: InternalAxiosRequestConfig) => {
            if (typeof window !== "undefined") {
                const token = localStorage.getItem("accessToken");
                if (token && config.headers) {
                    config.headers.Authorization = `Bearer ${token}`;
                }
            }
            return config;
        });

        this.client.interceptors.response.use(
            (response) => response,
            (error: AxiosError<{ message?: string }>) => {
                const message =
                    error.response?.data?.message || error.message || "Something went wrong";
                const status = error.response?.status || 500;
                return Promise.reject(new ApiError(message, status));
            }
        );
    }

    protected get<T>(url: string) {
        return this.client.get<T>(url);
    }

    protected post<T>(url: string, data?: unknown) {
        return this.client.post<T>(url, data);
    }

    protected put<T>(url: string, data?: unknown) {
        return this.client.put<T>(url, data);
    }

    protected patch<T>(url: string, data?: unknown) {
        return this.client.patch<T>(url, data);
    }

    protected delete<T>(url: string) {
        return this.client.delete<T>(url);
    }
}

export class ApiError extends Error {
    status: number;

    constructor(message: string, status: number) {
        super(message);
        this.name = "ApiError";
        this.status = status;
    }
}

export default ApiService;
