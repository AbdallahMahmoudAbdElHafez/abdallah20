

import axiosClient from "./axiosClient";

const processingOrderCostsApi = {
  getAll: (orderId) => axiosClient.get(`/processing-order-costs?orderId=${orderId}`),
  create: (data) => axiosClient.post("/processing-order-costs", data),
  update: (id, data) => axiosClient.put(`/processing-order-costs/${id}`, data),
  delete: (id) => axiosClient.delete(`/processing-order-costs/${id}`),
};

export default processingOrderCostsApi;
