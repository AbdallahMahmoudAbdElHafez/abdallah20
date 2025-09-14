import axiosClient from "./axiosClient";

const purchaseInvoicesApi = {
  // 👇 دعم query للفلترة
  getAll: (params = {}) => {
    const query = params.purchase_order_id
      ? `?purchase_order_id=${params.purchase_order_id}`
      : "";
    return axiosClient.get(`/purchase-invoices${query}`);
  },
  getById: (id) => axiosClient.get(`/purchase-invoices/${id}`),
  create: (data) => axiosClient.post("/purchase-invoices", data),
  update: (id, data) => axiosClient.put(`/purchase-invoices/${id}`, data),
  delete: (id) => axiosClient.delete(`/purchase-invoices/${id}`),
};

export default purchaseInvoicesApi;
