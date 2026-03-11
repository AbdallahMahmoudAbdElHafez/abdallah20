import axiosClient from './axiosClient';

const issueVoucherReturnsApi = {
    // الحصول على جميع مرتجعات اذون الصرف
    getAll: (filters = {}) => {
        const params = new URLSearchParams();
        Object.keys(filters).forEach(key => {
            if (filters[key]) {
                params.append(key, filters[key]);
            }
        });
        return axiosClient.get(`/issue-voucher-returns?${params.toString()}`);
    },

    // الحصول على مرتجع بواسطة ID
    getById: (id, params) => {
        const queryString = params ? '?' + new URLSearchParams(params).toString() : '';
        return axiosClient.get(`/issue-voucher-returns/${id}${queryString}`);
    },

    // إنشاء مرتجع جديد
    create: (data) => {
        return axiosClient.post('/issue-voucher-returns', data);
    },

    // تحديث مرتجع
    update: (id, data) => {
        return axiosClient.put(`/issue-voucher-returns/${id}`, data);
    },

    // حذف مرتجع
    delete: (id) => {
        return axiosClient.delete(`/issue-voucher-returns/${id}`);
    },

    // تحديث الحالة
    updateStatus: (id, statusData) => {
        return axiosClient.patch(`/issue-voucher-returns/${id}/status`, statusData);
    },

    // الحصول على أصناف اذن الصرف
    getVoucherItems: (voucherId) => {
        return axiosClient.get(`/issue-voucher-returns/voucher-items/${voucherId}`);
    }
};

export default issueVoucherReturnsApi;
