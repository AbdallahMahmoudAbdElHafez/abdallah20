import axiosClient from "./axiosClient";

const purchasePaymentsApi = {
  // جلب كل المدفوعات
  getAll: () => axiosClient.get("/purchase-payments/all"),

  // جلب المدفوعات الخاصة بفاتورة معيّنة
  getAllByInvoice: (invoiceId) => axiosClient.get(`/purchase-payments/${invoiceId}`),

  // إنشاء دفعة جديدة
  create: (data) => axiosClient.post("/purchase-payments", data),

  // تحديث دفعة
  update: (id, data) => axiosClient.put(`/purchase-payments/${id}`, data),

  // حذف دفعة
  delete: (id) => axiosClient.delete(`/purchase-payments/${id}`),
};

export default purchasePaymentsApi;
