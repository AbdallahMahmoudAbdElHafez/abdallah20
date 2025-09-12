import axiosClient from "./axiosClient";

const purchaseInvoiceItemsApi = {
  getAllByInvoice: (invoiceId) => axiosClient.get(`/purchase-invoice-items/invoice/${invoiceId}`),
  getById: (id) => axiosClient.get(`/purchase-invoice-items/${id}`),
  create: (data) => axiosClient.post("/purchase-invoice-items", data),
  update: (id, data) => axiosClient.put(`/purchase-invoice-items/${id}`, data),
  delete: (id) => axiosClient.delete(`/purchase-invoice-items/${id}`),
};

export default purchaseInvoiceItemsApi;