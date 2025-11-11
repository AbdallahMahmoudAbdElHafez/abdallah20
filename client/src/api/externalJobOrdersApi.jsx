import axiosClient from "./axiosClient";

const externalJobOrdersApi = {
  getAll: () => axiosClient.get("/external-job-orders"),
  getById: (id) => axiosClient.get(`/external-job-orders/${id}`),
  create: (data) => axiosClient.post("/external-job-orders", data),
  update: (id, data) => axiosClient.put(`/external-job-orders/${id}`, data),
  remove: (id) => axiosClient.delete(`/external-job-orders/${id}`),
};

export default externalJobOrdersApi;