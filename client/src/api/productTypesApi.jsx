import axiosClient from "./axiosClient";

const productTypesApi = {
    getAll: (params) => axiosClient.get("/product-types", { params }),
    getById: (id) => axiosClient.get(`/product-types/${id}`),
    create: (data) => axiosClient.post("/product-types", data),
    update: (id, data) => axiosClient.put(`/product-types/${id}`, data),
    delete: (id) => axiosClient.delete(`/product-types/${id}`),
};

export default productTypesApi;
