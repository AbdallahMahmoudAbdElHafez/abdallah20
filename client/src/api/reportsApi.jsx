import axiosClient from './axiosClient';

const reportsApi = {
    // Dashboard
    getSummary: (params) => axiosClient.get('/reports/summary', { params }),
    getTopProducts: (params) => axiosClient.get('/reports/top-products', { params }),
    getLowStock: (params) => axiosClient.get('/reports/low-stock', { params }),

    // Detailed Reports
    getSalesReport: (params) => axiosClient.get('/reports/sales', { params }),
    getPurchasesReport: (params) => axiosClient.get('/reports/purchases', { params }),
    getExpensesReport: (params) => axiosClient.get('/reports/expenses', { params }),
    getJobOrdersReport: (params) => axiosClient.get('/reports/job-orders', { params }),
    getWarehouseReport: (params) => axiosClient.get('/reports/warehouse', { params }),
    getIssueVouchersReport: (params) => axiosClient.get('/reports/issue-vouchers', { params }),

    // Export
    exportReport: (type, params) => {
        return axiosClient.get(`/reports/export/${type}`, {
            params,
            responseType: 'blob' // Important for file download
        });
    }
};

export default reportsApi;
