import axiosClient from "./axiosClient";

const purchaseReturnItemsApi = {
    getAll: () => axiosClient.get("/purchase-return-items"),
    getById: (id) => axiosClient.get(`/purchase-return-items/${id}`),
    create: (data) => axiosClient.post("/purchase-return-items", data),
    update: (id, data) => axiosClient.put(`/purchase-return-items/${id}`, data),
    delete: (id) => axiosClient.delete(`/purchase-return-items/${id}`),
};

export default purchaseReturnItemsApi;
