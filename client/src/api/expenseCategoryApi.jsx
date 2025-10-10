// src/api/expenseCategoryApi.js
import axiosClient from "./axiosClient";

const expenseCategoryApi = {
  getAll: () => axiosClient.get("/expense-categories"),
  getById: (id) => axiosClient.get(`/expense-categories/${id}`),
  create: (data) => axiosClient.post("/expense-categories", data),
  update: (id, data) => axiosClient.put(`/expense-categories/${id}`, data),
  delete: (id) => axiosClient.delete(`/expense-categories/${id}`),
};

export default expenseCategoryApi;
