import axiosClient from "./axiosClient";

const doctorsApi = {
    getAll: () => axiosClient.get("/doctors"),
    getById: (id) => axiosClient.get(`/doctors/${id}`),
    create: (data) => axiosClient.post("/doctors", data),
    update: (id, data) => axiosClient.put(`/doctors/${id}`, data),
    delete: (id) => axiosClient.delete(`/doctors/${id}`),
};

export default doctorsApi;
