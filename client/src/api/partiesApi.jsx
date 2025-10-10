import axiosClient from "./axiosClient";

const partiesApi = {
  getAll: () => axiosClient.get("/parties"),
  getSuppliers: () => axiosClient.get("/parties/suppliers"),

  getById: (id) => axiosClient.get(`/parties/${id}`),
  create: (data) => axiosClient.post("/parties", data),
  update: (id, data) => axiosClient.put(`/parties/${id}`, data),
  delete: (id) => axiosClient.delete(`/parties/${id}`),
};

export default partiesApi;