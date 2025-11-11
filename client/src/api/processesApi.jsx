import axiosClient from "./axiosClient";

const processesApi = {
  getAll: async () => {
    const res = await axiosClient.get("/processes");
    return res.data;
  },

  getById: async (id) => {
    const res = await axiosClient.get(`/processes/${id}`);
    return res.data;
  },

  create: async (data) => {
    const res = await axiosClient.post("/processes", data);
    return res.data;
  },

  update: async (id, data) => {
    const res = await axiosClient.put(`/processes/${id}`, data);
    return res.data;
  },

  remove: async (id) => {
    const res = await axiosClient.delete(`/processes/${id}`);
    return res.data;
  },
};

export default processesApi;
