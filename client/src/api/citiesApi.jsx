import axiosClient from "./axiosClient";

const citiesApi = {
  getAll: () => axiosClient.get("/cities"),
  getById: (id) => axiosClient.get(`/cities/${id}`),
  create: (data) => axiosClient.post("/cities", data),
  update: (id, data) => axiosClient.put(`/cities/${id}`, data),
  delete: (id) => axiosClient.delete(`/cities/${id}`),
};

export default citiesApi;
