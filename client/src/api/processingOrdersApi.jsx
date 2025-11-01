import axiosClient from "./axiosClient";

const processingOrdersApi = {
  getAll: () => axiosClient.get("/processing-orders"),
  getById: (id) => axiosClient.get(`/processing-orders/${id}`),
  create: (data) => axiosClient.post("/processing-orders", data),
  update: (id, data) => axiosClient.put(`/processing-orders/${id}`, data),
  delete: (id) => axiosClient.delete(`/processing-orders/${id}`),
};

export default processingOrdersApi;
