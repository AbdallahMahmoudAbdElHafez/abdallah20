import axiosClient from "./axiosClient";

const purchaseReturnsApi = {
  getAll: () => axiosClient.get("/purchase-returns"),
  getById: (id) => axiosClient.get(`/purchase-returns/${id}`),
  create: (data) => axiosClient.post("/purchase-returns", data),
  update: (id, data) => axiosClient.put(`/purchase-returns/${id}`, data),
  delete: (id) => axiosClient.delete(`/purchase-returns/${id}`),
};

export default purchaseReturnsApi;
