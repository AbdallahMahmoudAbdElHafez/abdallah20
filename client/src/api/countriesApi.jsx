import axiosClient from "./axiosClient";

const countriesApi = {
  getAll: () => axiosClient.get("/countries"),
  getById: (id) => axiosClient.get(`/countries/${id}`),
  create: (data) => axiosClient.post("/countries", data),
  update: (id, data) => axiosClient.put(`/countries/${id}`, data),
  delete: (id) => axiosClient.delete(`/countries/${id}`),
};

export default countriesApi;
