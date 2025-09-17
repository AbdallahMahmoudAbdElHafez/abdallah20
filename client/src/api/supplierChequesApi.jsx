import axiosClient from "./axiosClient";

const supplierChequesApi = {
  getAllByInvoice: (invoiceId) => axiosClient.get(`/supplier-cheque/invoice/${invoiceId}`),
  getById: (id) => axiosClient.get(`/supplier-cheque/${id}`),
  create: (data) => axiosClient.post("/supplier-cheque", data),
  update: (id, data) => axiosClient.put(`/supplier-cheque/${id}`, data),
  delete: (id) => axiosClient.delete(`/supplier-cheque/${id}`),
};

export default supplierChequesApi;