import axiosClient from "./axiosClient";

const entryTypesApi = {
    getAll: () => axiosClient.get("/entry-types"),
    getById: (id) => axiosClient.get(`/entry-types/${id}`),
    create: (data) => axiosClient.post("/entry-types", data),
    update: (id, data) => axiosClient.put(`/entry-types/${id}`, data),
    delete: (id) => axiosClient.delete(`/entry-types/${id}`),
};

export default entryTypesApi;
