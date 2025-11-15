import axiosClient from "./axiosClient";

const jobTitlesApi = {
  getAll: () => axiosClient.get("/job-titles"),
  getById: (id) => axiosClient.get(`/job-titles/${id}`),
  create: (data) => axiosClient.post("/job-titles", data),
  update: (id, data) => axiosClient.put(`/job-titles/${id}`, data),
  delete: (id) => axiosClient.delete(`/job-titles/${id}`),
};

export default jobTitlesApi;
