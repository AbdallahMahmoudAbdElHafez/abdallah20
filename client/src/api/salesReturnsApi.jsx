import axiosClient from "./axiosClient";

const salesReturnsApi = {
    getAll: () => axiosClient.get("/sales-returns"),
    getById: (id) => axiosClient.get(`/sales-returns/${id}`),
    create: (data) => axiosClient.post("/sales-returns", data),
    update: (id, data) => axiosClient.put(`/sales-returns/${id}`, data),
    delete: (id) => axiosClient.delete(`/sales-returns/${id}`),
};

export default salesReturnsApi;
