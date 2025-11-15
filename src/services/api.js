import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

const api = axios.create({
  baseURL: API_URL,
});

// ---- Attach access token automatically ----
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});


const logout = () => {
  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");
  window.location.href = "/login";
};


// ---- Refresh token if expired ----
api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const refresh = localStorage.getItem('refresh_token');

      if (!refresh) {
        logout(); 
        return Promise.reject(error);
      }

      try {
        const res = await axios.post(`${API_URL}/user/refresh/`, { refresh });

        localStorage.setItem("access_token", res.data.access);

        if (res.data.refresh) {
          localStorage.setItem("refresh_token", res.data.refresh);
        }

        api.defaults.headers.Authorization = `Bearer ${res.data.access}`;
        originalRequest.headers.Authorization = `Bearer ${res.data.access}`;

        return api(originalRequest);

      } catch {
        logout();
      }
    }

    return Promise.reject(error);
  }
);


export default api;
