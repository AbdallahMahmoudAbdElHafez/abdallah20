import axiosClient from "./axiosClient";

const jobOrderCostsApi = {
    getAll: () => axiosClient.get("/job-order-costs"),
    getByJobOrderId: (jobOrderId) => axiosClient.get(`/job-order-costs/job-order/${jobOrderId}`),
    getById: (id) => axiosClient.get(`/job-order-costs/${id}`),
    create: (data) => axiosClient.post("/job-order-costs", data),
    update: (id, data) => axiosClient.put(`/job-order-costs/${id}`, data),
    remove: (id) => axiosClient.delete(`/job-order-costs/${id}`),
};

export default jobOrderCostsApi;
