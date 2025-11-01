
import axiosClient from "./axiosClient";

const processingOrderItemsApi = {
  getAll: (orderId) => axiosClient.get(`/processing-order-items?orderId=${orderId}`),
  create: (data) => axiosClient.post("/processing-order-items", data),
  update: (id, data) => axiosClient.put(`/processing-order-items/${id}`, data),
  delete: (id) => axiosClient.delete(`/processing-order-items/${id}`),
};

export default processingOrderItemsApi;

