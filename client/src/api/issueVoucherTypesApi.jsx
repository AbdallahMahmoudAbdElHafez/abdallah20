// src/api/issueVoucherTypesApi.jsx
import axiosClient from "./axiosClient";

const issueVoucherTypesApi = {
  getAll: () => axiosClient.get("/issue-voucher-types"),
  getById: (id) => axiosClient.get(`/issue-voucher-types/${id}`),
  create: (data) => axiosClient.post("/issue-voucher-types", data),
  update: (id, data) => axiosClient.put(`/issue-voucher-types/${id}`, data),
  delete: (id) => axiosClient.delete(`/issue-voucher-types/${id}`),
};

export default issueVoucherTypesApi;
