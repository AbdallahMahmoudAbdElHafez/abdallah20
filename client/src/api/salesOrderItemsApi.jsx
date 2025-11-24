import axiosClient from "./axiosClient";

const salesOrderItemsApi = {
    getAll: (params) => axiosClient.get("/sales-order-items", { params }),
    getById: (id) => axiosClient.get(`/sales-order-items/${id}`),
    create: (data) => axiosClient.post("/sales-order-items", data),
    update: (id, data) => axiosClient.put(`/sales-order-items/${id}`, data),
    delete: (id) => axiosClient.delete(`/sales-order-items/${id}`),
};

export default salesOrderItemsApi;
