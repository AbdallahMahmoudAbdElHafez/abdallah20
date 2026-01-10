import axiosClient from "./axiosClient";

const salesInvoicesApi = {
    getAll: (params) => axiosClient.get("/sales-invoices", { params }),
    getById: (id) => axiosClient.get(`/sales-invoices/${id}`),
    create: (data) => axiosClient.post("/sales-invoices", data),
    update: (id, data) => axiosClient.put(`/sales-invoices/${id}`, data),
    delete: (id) => axiosClient.delete(`/sales-invoices/${id}`),
};

export default salesInvoicesApi;
