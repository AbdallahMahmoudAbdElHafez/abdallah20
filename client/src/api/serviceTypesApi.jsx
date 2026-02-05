// src/api/serviceTypesApi.jsx
import axiosClient from "./axiosClient";

const serviceTypesApi = {
    getAll: () => axiosClient.get("/service-types"),
    getById: (id) => axiosClient.get(`/service-types/${id}`),
    create: (data) => axiosClient.post("/service-types", data),
    update: (id, data) => axiosClient.put(`/service-types/${id}`, data),
    delete: (id) => axiosClient.delete(`/service-types/${id}`),
};

export default serviceTypesApi;
