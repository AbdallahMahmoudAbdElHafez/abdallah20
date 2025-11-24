import axiosClient from "./axiosClient";

const expensesApi = {
    getAll: () => axiosClient.get("/expenses"),
    getById: (id) => axiosClient.get(`/expenses/${id}`),
    create: (data) => axiosClient.post("/expenses", data),
    update: (id, data) => axiosClient.put(`/expenses/${id}`, data),
    delete: (id) => axiosClient.delete(`/expenses/${id}`),
};

export default expensesApi;
