import axiosClient from "./axiosClient";

const purchaseOrdersApi = {
  getAll: () => axiosClient.get("/purchase-orders"),
  getById: (id) => axiosClient.get(`/purchase-orders/${id}`),
  create: (data) => axiosClient.post("/purchase-orders", data),
  update: (id, data) => axiosClient.put(`/purchase-orders/${id}`, data),
  delete: (id) => axiosClient.delete(`/purchase-orders/${id}`),
};

export default purchaseOrdersApi;
