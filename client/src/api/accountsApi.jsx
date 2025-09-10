import axiosClient from "./axiosClient";

const accountsApi = {
  getAll: () => axiosClient.get("/accounts"),
  getById: (id) => axiosClient.get(`/accounts/${id}`),
  create: (data) => axiosClient.post("/accounts", data),
  update: (id, data) => axiosClient.put(`/accounts/${id}`, data),
  delete: (id) => axiosClient.delete(`/accounts/${id}`),
};

export default accountsApi;
