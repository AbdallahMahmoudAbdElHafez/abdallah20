import axiosClient from "./axiosClient";

const purchasePaymentsApi = {
  getAllByInvoice: (invoiceId) => axiosClient.get(`/purchase-payments/invoice/${invoiceId}`),
  getById: (id) => axiosClient.get(`/purchase-payments/${id}`),
  create: (data) => axiosClient.post("/purchase-payments", data),
  update: (id, data) => axiosClient.put(`/purchase-payments/${id}`, data),
  delete: (id) => axiosClient.delete(`/purchase-payments/${id}`),
};

export default purchasePaymentsApi;