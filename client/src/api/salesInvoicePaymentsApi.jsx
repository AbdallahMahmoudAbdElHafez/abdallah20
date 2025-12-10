import axiosClient from "./axiosClient";

const salesInvoicePaymentsApi = {
    // جلب كل المدفوعات
    getAll: () => axiosClient.get("/sales-invoice-payments/all"),

    // جلب المدفوعات الخاصة بفاتورة معيّنة
    getAllByInvoice: (invoiceId) => axiosClient.get(`/sales-invoice-payments/${invoiceId}`),

    // إنشاء دفعة جديدة
    create: (data) => axiosClient.post("/sales-invoice-payments", data),

    // تحديث دفعة
    update: (id, data) => axiosClient.put(`/sales-invoice-payments/${id}`, data),

    // حذف دفعة
    delete: (id) => axiosClient.delete(`/sales-invoice-payments/${id}`),
};

export default salesInvoicePaymentsApi;
