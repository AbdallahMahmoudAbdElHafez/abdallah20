import axiosClient from "./axiosClient";

const accountsApi = {
  getAll: () => axiosClient.get("/accounts"),
  getById: (id) => axiosClient.get(`/accounts/${id}`),
  create: (data) => axiosClient.post("/accounts", data),
  update: (id, data) => axiosClient.put(`/accounts/${id}`, data),
  delete: (id) => axiosClient.delete(`/accounts/${id}`),
  postOpeningBalances: (data) => axiosClient.post("/accounts/post-opening-balances", data),
};

export default accountsApi;
