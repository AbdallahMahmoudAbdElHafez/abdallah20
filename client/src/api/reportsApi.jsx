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
    getJournalExpensesReport: (params) => axiosClient.get('/reports/journal-expenses', { params }), // NEW
    getJobOrdersReport: (params) => axiosClient.get('/reports/job-orders', { params }),
    getWarehouseReport: (params) => axiosClient.get('/reports/warehouse', { params }),
    getIssueVouchersReport: (params) => axiosClient.get('/reports/issue-vouchers', { params }),
    getOpeningSalesReport: (params) => axiosClient.get('/reports/opening-sales', { params }),
    getZakatReport: (params) => axiosClient.get('/reports/zakat', { params }),
    getProfitReport: (params) => axiosClient.get('/reports/profit', { params }),
    getBankAndCashReport: (params) => axiosClient.get('/reports/bank-cash', { params }),
    getSafeMovementsReport: (params) => axiosClient.get('/reports/safe-movements', { params }),
    getCustomerReceivables: (params) => axiosClient.get('/reports/customer-receivables', { params }),

    // Export
    exportReport: (type, params) => {
        return axiosClient.get(`/reports/export/${type}`, {
            params,
            responseType: 'blob' // Important for file download
        });
    }
};

export default reportsApi;
