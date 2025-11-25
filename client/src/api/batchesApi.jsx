import axiosClient from "./axiosClient";

const batchesApi = {
    getAll: () => axiosClient.get("/batches"),
    getById: (id) => axiosClient.get(`/batches/${id}`),
    create: (data) => axiosClient.post("/batches", data),
    update: (id, data) => axiosClient.put(`/batches/${id}`, data),
    delete: (id) => axiosClient.delete(`/batches/${id}`),
};

export default batchesApi;
