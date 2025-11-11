import axiosClient from "./axiosClient";

const currentInventoryApi = {
  getAll: () => axiosClient.get("/current-inventory"),
  getById: (id) => axiosClient.get(`/current-inventory/${id}`),
  create: (data) => axiosClient.post("/current-inventory", data),
  update: (id, data) => axiosClient.put(`/current-inventory/${id}`, data),
  remove: (id) => axiosClient.delete(`/current-inventory/${id}`),
};

export default currentInventoryApi;
