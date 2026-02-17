import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// ====================
// REQUEST INTERCEPTOR
// ====================
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("access");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ====================
// RESPONSE INTERCEPTOR
// ====================
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If access token expired
    if (
      error.response?.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      try {
        const refresh = localStorage.getItem("refresh");

        const res = await axios.post(
          `${import.meta.env.VITE_API_BASE_URL}/auth/refresh/`,
          { refresh }
        );

        // Save new access token
        localStorage.setItem("access", res.data.access);

        // Update header & retry request
        originalRequest.headers.Authorization =
          `Bearer ${res.data.access}`;

        return api(originalRequest);
      } catch {
        // Refresh token invalid → logout
        localStorage.clear();
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);

export default api;
