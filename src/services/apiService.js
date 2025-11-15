import axios from "axios";
import api from "./api"

const API_URL = import.meta.env.VITE_API_URL;
export {API_URL} ;

const register = (username, email, password, first_name, last_name) =>
  axios.post(`${API_URL}/user/register/`, { username, email, password, first_name, last_name });

const login = async (username, password) => {
  const response = await axios.post(`${API_URL}/user/login/`, {
    username,
    password,
  });

  localStorage.setItem("access_token", response.data.access);
  localStorage.setItem("refresh_token", response.data.refresh);

  return response.data;
};

const logout = () => {
  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");
};

// --- Services API ---
const getServices = () => api.get(`${API_URL}/api/services/`);
const createService = (data) => api.post(`${API_URL}/api/services/`, data);
const updateService = (id, data) => api.put(`${API_URL}/api/services/${id}/`, data);
const deleteService = (id) => api.delete(`${API_URL}/api/services/${id}/`);

export default {  register,
  login,
  logout,
  getServices,
  createService,
  updateService,
  deleteService
};