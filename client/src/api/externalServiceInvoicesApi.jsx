// src/api/externalServiceInvoicesApi.jsx
import axiosClient from "./axiosClient";

const externalServiceInvoicesApi = {
    getAll: () => axiosClient.get("/external-service-invoices"),
    getById: (id) => axiosClient.get(`/external-service-invoices/${id}`),
    getByJobOrderId: (jobOrderId) => axiosClient.get(`/external-service-invoices/job-order/${jobOrderId}`),
    create: (data) => axiosClient.post("/external-service-invoices", data),
    update: (id, data) => axiosClient.put(`/external-service-invoices/${id}`, data),
    delete: (id) => axiosClient.delete(`/external-service-invoices/${id}`),
    post: (id, userId) => axiosClient.post(`/external-service-invoices/${id}/post`, { user_id: userId }),
    cancel: (id, userId) => axiosClient.post(`/external-service-invoices/${id}/cancel`, { user_id: userId }),
};

export default externalServiceInvoicesApi;
