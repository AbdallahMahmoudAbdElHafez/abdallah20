// services/journalEntryLinesApi.jsx
import axiosClient from "./axiosClient";

const journalEntryLinesApi = {
  getAll: () => axiosClient.get("/journal-entry-lines"),
  getById: (id) => axiosClient.get(`/journal-entry-lines/${id}`),
  create: (data) => axiosClient.post("/journal-entry-lines", data),
  update: (id, data) => axiosClient.put(`/journal-entry-lines/${id}`, data),
  delete: (id) => axiosClient.delete(`/journal-entry-lines/${id}`),
};

export default journalEntryLinesApi;
