import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api"
});

api.interceptors.request.use((config) => {
  let token = null;

  try {
    token = window.localStorage.getItem("token");
  } catch (_error) {
    token = null;
  }

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      try {
        window.localStorage.removeItem("token");
        window.localStorage.removeItem("user");
      } catch (_storageError) {
        // Ignore storage errors caused by browser privacy settings.
      }
    }

    return Promise.reject(error);
  }
);

export default api;
