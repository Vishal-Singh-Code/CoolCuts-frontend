import api from "./api";

/* =======================
   SERVICES API
======================= */

// GET all services
const getServices = async () => {
  const response = await api.get("/api/services/");
  return response.data;
};

// CREATE a service
const createService = async (data) => {
  const response = await api.post("/api/services/", data);
  return response.data;
};

// UPDATE a service
const updateService = async (id, data) => {
  const response = await api.put(`/api/services/${id}/`, data);
  return response.data;
};

// DELETE a service
const deleteService = async (id) => {
  const response = await api.delete(`/api/services/${id}/`);
  return response.data;
};

export default {
  getServices,
  createService,
  updateService,
  deleteService,
};
