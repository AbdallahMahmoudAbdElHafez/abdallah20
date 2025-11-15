import axiosClient from "./axiosClient";

const employeesApi = {
  getAll: () => axiosClient.get("/employees"),
  create: (data) => axiosClient.post("/employees", data),
  update: (id, data) => axiosClient.put(`/employees/${id}`, data),
  delete: (id) => axiosClient.delete(`/employees/${id}`),

  getJobTitles: () => axiosClient.get("/job-titles"),
  getDepartments: () => axiosClient.get("/departments"),
  getManagers: () => axiosClient.get("/employees"), // نفس جدول الموظفين
};

export default employeesApi;
