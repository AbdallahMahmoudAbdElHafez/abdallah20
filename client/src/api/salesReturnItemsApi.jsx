import axiosClient from "./axiosClient";

const salesReturnItemsApi = {
    getAll: () => axiosClient.get("/sales-return-items"),
    getById: (id) => axiosClient.get(`/sales-return-items/${id}`),
    create: (data) => axiosClient.post("/sales-return-items", data),
    update: (id, data) => axiosClient.put(`/sales-return-items/${id}`, data),
    delete: (id) => axiosClient.delete(`/sales-return-items/${id}`),
};

export default salesReturnItemsApi;
