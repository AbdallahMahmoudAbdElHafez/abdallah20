import axiosClient from "./axiosClient";

const purchaseInvoicesApi = {
  getAll: () => axiosClient.get("/purchase-invoices"),
  getById: (id) => axiosClient.get(`/purchase-invoices/${id}`),
  create: (data) => axiosClient.post("/purchase-invoices", data),
  update: (id, data) => axiosClient.put(`/purchase-invoices/${id}`, data),
  delete: (id) => axiosClient.delete(`/purchase-invoices/${id}`),
};

export default purchaseInvoicesApi;
