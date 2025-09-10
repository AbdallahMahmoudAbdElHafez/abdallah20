import axiosClient from "./axiosClient";

const partyCategoriesApi = {
  getAll: () => axiosClient.get("/party-categories"),
  getById: (id) => axiosClient.get(`/party-categories/${id}`),
  create: (data) => axiosClient.post("/party-categories", data),
  update: (id, data) => axiosClient.put(`/party-categories/${id}`, data),
  delete: (id) => axiosClient.delete(`/party-categories/${id}`),
};

export default partyCategoriesApi;
