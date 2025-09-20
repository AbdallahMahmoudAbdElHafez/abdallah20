import axiosClient from "./axiosClient";

const accountSettingsApi = {
    list: (params) => axiosClient.get("/accounting-settings", { params }),
    getAll: () => axiosClient.get("/accounting-settings"),
    getById: (id) => axiosClient.get(`/accounting-settings/${id}`),
    create: (data) => axiosClient.post("/accounting-settings", data),
    update: (id, data) => axiosClient.put(`/accounting-settings/${id}`, data),
    delete: (id) => axiosClient.delete(`/accounting-settings/${id}`),
};
export default accountSettingsApi
