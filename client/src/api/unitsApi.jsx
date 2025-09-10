import axiosClient from "./axiosClient";

const unitsApi = {
  getAll: () => axiosClient.get("/units"),
  getById: (id) => axiosClient.get(`/units/${id}`),
  create: (data) => axiosClient.post("/units", data),
  update: (id, data) => axiosClient.put(`/units/${id}`, data),
  delete: (id) => axiosClient.delete(`/units/${id}`),
};

export default unitsApi;