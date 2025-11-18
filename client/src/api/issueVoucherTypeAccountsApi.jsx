// src/api/issueVoucherTypeAccountsApi.jsx
import axiosClient from "./axiosClient";

const base = "/issue-voucher-type-accounts";

const issueVoucherTypeAccountsApi = {
  getAll: () => axiosClient.get(base),
  getById: (id) => axiosClient.get(`${base}/${id}`),
  getByType: (typeId) => axiosClient.get(`${base}/type/${typeId}`),
  create: (data) => axiosClient.post(base, data),
  bulkCreate: (list) => axiosClient.post(`${base}/bulk`, list),
  remove: (id) => axiosClient.delete(`${base}/${id}`),
  removeByType: (typeId) => axiosClient.delete(`${base}/type/${typeId}`), // optional endpoint if backend supports
};

export default issueVoucherTypeAccountsApi;
