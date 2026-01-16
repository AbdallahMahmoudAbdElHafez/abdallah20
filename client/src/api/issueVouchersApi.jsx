import axiosClient from './axiosClient';

const issueVouchersApi = {
  // الحصول على جميع سندات الإصدار
  getAll: (filters = {}) => {
    const params = new URLSearchParams();

    Object.keys(filters).forEach(key => {
      if (filters[key]) {
        params.append(key, filters[key]);
      }
    });

    return axiosClient.get(`/issue-vouchers?${params.toString()}`);
  },

  // الحصول على سند إصدار بواسطة ID
  getById: (id, params) => {
    const queryString = params ? '?' + new URLSearchParams(params).toString() : '';
    return axiosClient.get(`/issue-vouchers/${id}${queryString}`);
  },

  // الحصول على سند إصدار بواسطة رقم السند
  getByVoucherNo: (voucherNo) => {
    return axiosClient.get(`/issue-vouchers/voucher-no/${voucherNo}`);
  },

  // إنشاء سند إصدار جديد
  create: (voucherData) => {
    return axiosClient.post('/issue-vouchers', voucherData);
  },

  // تحديث سند إصدار
  update: (id, voucherData) => {
    return axiosClient.put(`/issue-vouchers/${id}`, voucherData);
  },

  // حذف سند إصدار
  delete: (id) => {
    return axiosClient.delete(`/issue-vouchers/${id}`);
  },

  // تحديث حالة السند
  updateStatus: (id, statusData) => {
    return axiosClient.patch(`/issue-vouchers/${id}/status`, statusData);
  }
};

export default issueVouchersApi;