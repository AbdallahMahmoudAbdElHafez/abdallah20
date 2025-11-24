import axiosClient from "./axiosClient";

const salesOrdersApi = {
    getAll: () => axiosClient.get("/sales-orders"),
    getById: (id) => axiosClient.get(`/sales-orders/${id}`),
    create: (data) => axiosClient.post("/sales-orders", data),
    update: (id, data) => axiosClient.put(`/sales-orders/${id}`, data),
    delete: (id) => axiosClient.delete(`/sales-orders/${id}`),
};

export default salesOrdersApi;
