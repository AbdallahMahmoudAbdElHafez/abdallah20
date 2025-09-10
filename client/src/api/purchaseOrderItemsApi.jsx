import axiosClient from "./axiosClient";

const purchaseOrderItemsApi = {
  getAllByOrder: (orderId) => axiosClient.get(`/purchase-order-items/order/${orderId}`),
  getById: (id) => axiosClient.get(`/purchase-order-items/${id}`),
  create: (data) => axiosClient.post("/purchase-order-items", data),
  update: (id, data) => axiosClient.put(`/purchase-order-items/${id}`, data),
  delete: (id) => axiosClient.delete(`/purchase-order-items/${id}`),
};

export default purchaseOrderItemsApi;
