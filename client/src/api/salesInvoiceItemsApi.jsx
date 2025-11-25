import axiosClient from "./axiosClient";

const salesInvoiceItemsApi = {
    getAll: (params) => axiosClient.get("/sales-invoice-items", { params }),
    getById: (id) => axiosClient.get(`/sales-invoice-items/${id}`),
    create: (data) => axiosClient.post("/sales-invoice-items", data),
    update: (id, data) => axiosClient.put(`/sales-invoice-items/${id}`, data),
    delete: (id) => axiosClient.delete(`/sales-invoice-items/${id}`),
};

export default salesInvoiceItemsApi;
