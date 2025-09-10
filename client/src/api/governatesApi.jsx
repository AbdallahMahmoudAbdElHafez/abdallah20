import axiosClient from "./axiosClient";

const governatesApi = {
  getAll: () => axiosClient.get("/governates"),
  getById: (id) => axiosClient.get(`/governates/${id}`),
  create: (data) => axiosClient.post("/governates", data),
  update: (id, data) => axiosClient.put(`/governates/${id}`, data),
  delete: (id) => axiosClient.delete(`/governates/${id}`),
};

export default governatesApi;
