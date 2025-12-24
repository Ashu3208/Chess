import axios from "axios";
import Cookies from "universal-cookie";

const cookies = new Cookies();
const BASE_URL = import.meta.env.VITE_SERVER_URI;

// Create axios instance
const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Flag to prevent multiple simultaneous refresh requests
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// Request interceptor - add access token to requests
axiosInstance.interceptors.request.use(
  (config) => {
    const accessToken = cookies.get("ACCESS_TOKEN");
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - handle token refresh on 401
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // If error is 401 and we haven't tried to refresh yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // If already refreshing, queue this request
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return axiosInstance(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const refreshToken = cookies.get("REFRESH_TOKEN");

      if (!refreshToken) {
        // No refresh token, clear everything and redirect to login
        cookies.remove("ACCESS_TOKEN", { path: "/" });
        cookies.remove("REFRESH_TOKEN", { path: "/" });
        processQueue(error, null);
        isRefreshing = false;
        // Optionally redirect to login
        if (window.location.pathname !== "/login" && window.location.pathname !== "/register") {
          window.location.href = "/login";
        }
        return Promise.reject(error);
      }

      try {
        // Try to refresh the token
        const response = await axios.post(`${BASE_URL}/user/refresh-token`, {
          refreshToken,
        });

        const { accessToken } = response.data;
        cookies.set("ACCESS_TOKEN", accessToken, { path: "/" });

        // Update the original request with new token
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;

        // Process queued requests
        processQueue(null, accessToken);
        isRefreshing = false;

        // Retry the original request
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        // Refresh failed, clear tokens and redirect to login
        cookies.remove("ACCESS_TOKEN", { path: "/" });
        cookies.remove("REFRESH_TOKEN", { path: "/" });
        processQueue(refreshError, null);
        isRefreshing = false;

        // Redirect to login if not already there
        if (window.location.pathname !== "/login" && window.location.pathname !== "/register") {
          window.location.href = "/login";
        }

        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;

