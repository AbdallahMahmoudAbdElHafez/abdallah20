import reportsService from '../services/reports.service.js';
import exportService from '../services/exportService.js';

const reportsController = {
    getDashboardSummary: async (req, res) => {
        try {
            const { startDate, endDate } = req.query;
            const data = await reportsService.getDashboardSummary(startDate, endDate);
            res.json(data);
        } catch (error) {
            console.error('Error fetching dashboard summary:', error);
            res.status(500).json({ message: error.message });
        }
    },

    getTopSellingProducts: async (req, res) => {
        try {
            const { startDate, endDate, limit } = req.query;
            const data = await reportsService.getTopSellingProducts(startDate, endDate, limit);
            res.json(data);
        } catch (error) {
            console.error('Error fetching top selling products:', error);
            res.status(500).json({ message: error.message });
        }
    },

    getLowStockItems: async (req, res) => {
        try {
            const { threshold } = req.query;
            const data = await reportsService.getLowStockItems(threshold);
            res.json(data);
        } catch (error) {
            console.error('Error fetching low stock items:', error);
            res.status(500).json({ message: error.message });
        }
    },

    // ============ NEW REPORT CONTROLLERS ============

    getSalesReport: async (req, res) => {
        try {
            const { startDate, endDate } = req.query;
            const data = await reportsService.getSalesReport(startDate, endDate);
            res.json(data);
        } catch (error) {
            console.error('Error fetching sales report:', error);
            res.status(500).json({ message: error.message });
        }
    },

    getPurchasesReport: async (req, res) => {
        try {
            const { startDate, endDate } = req.query;
            const data = await reportsService.getPurchasesReport(startDate, endDate);
            res.json(data);
        } catch (error) {
            console.error('Error fetching purchases report:', error);
            res.status(500).json({ message: error.message });
        }
    },

    getExpensesReport: async (req, res) => {
        try {
            const { startDate, endDate } = req.query;
            const data = await reportsService.getExpensesReport(startDate, endDate);
            res.json(data);
        } catch (error) {
            console.error('Error fetching expenses report:', error);
            res.status(500).json({ message: error.message });
        }
    },

    getJobOrdersReport: async (req, res) => {
        try {
            const { startDate, endDate } = req.query;
            const data = await reportsService.getJobOrdersReport(startDate, endDate);
            res.json(data);
        } catch (error) {
            console.error('Error fetching job orders report:', error);
            res.status(500).json({ message: error.message });
        }
    },

    getWarehouseReport: async (req, res) => {
        try {
            const { date } = req.query;
            const data = await reportsService.getWarehouseReport(date);
            res.json(data);
        } catch (error) {
            console.error('Error fetching warehouse report:', error);
            res.status(500).json({ message: error.message });
        }
    },

    getIssueVouchersReport: async (req, res) => {
        try {
            const { startDate, endDate } = req.query;
            const data = await reportsService.getIssueVouchersReport(startDate, endDate);
            res.json(data);
        } catch (error) {
            console.error('Error fetching issue vouchers report:', error);
            res.status(500).json({ message: error.message });
        }
    },

    getOpeningSalesInvoicesReport: async (req, res) => {
        try {
            const { startDate, endDate } = req.query;
            const data = await reportsService.getOpeningSalesInvoicesReport(startDate, endDate);
            res.json(data);
        } catch (error) {
            console.error('Error fetching opening sales invoices report:', error);
            res.status(500).json({ message: error.message });
        }
    },

    getZakatReport: async (req, res) => {
        try {
            const { date } = req.query;
            const data = await reportsService.getZakatReport(date);
            res.json(data);
        } catch (error) {
            console.error('Error fetching zakat report:', error);
            res.status(500).json({ message: error.message });
        }
    },

    getCustomerReceivables: async (req, res) => {
        try {
            const { startDate, endDate } = req.query;
            const data = await reportsService.getCustomerReceivablesReport(startDate, endDate);
            res.json(data);
        } catch (error) {
            console.error('Error fetching customer receivables report:', error);
            res.status(500).json({ message: error.message });
        }
    },

    // ============ EXPORT CONTROLLERS ============

    exportReport: async (req, res) => {
        try {
            const { type } = req.params;
            const { startDate, endDate } = req.query;

            let buffer;
            let filename;

            switch (type) {
                case 'sales':
                    const salesData = await reportsService.getSalesReport(startDate, endDate);
                    buffer = await exportService.exportSalesReport(salesData.data, salesData.summary);
                    filename = `Sales_Report_${startDate}_${endDate}.xlsx`;
                    break;

                case 'purchases':
                    const purchasesData = await reportsService.getPurchasesReport(startDate, endDate);
                    buffer = await exportService.exportPurchasesReport(purchasesData.data, purchasesData.summary);
                    filename = `Purchases_Report_${startDate}_${endDate}.xlsx`;
                    break;

                case 'expenses':
                    const expensesData = await reportsService.getExpensesReport(startDate, endDate);
                    buffer = await exportService.exportExpensesReport(expensesData.data, expensesData.summary);
                    filename = `Expenses_Report_${startDate}_${endDate}.xlsx`;
                    break;

                case 'job-orders':
                    const jobOrdersData = await reportsService.getJobOrdersReport(startDate, endDate);
                    buffer = await exportService.exportJobOrdersReport(jobOrdersData.data, jobOrdersData.summary);
                    filename = `JobOrders_Report_${startDate}_${endDate}.xlsx`;
                    break;

                case 'customer-receivables':
                    const receivablesData = await reportsService.getCustomerReceivablesReport(startDate, endDate);
                    buffer = await exportService.exportCustomerReceivablesReport(receivablesData.data, receivablesData.summary);
                    filename = `Customer_Receivables_${startDate}_${endDate}.xlsx`;
                    break;

                default:
                    return res.status(400).json({ message: 'Invalid report type' });
            }

            res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
            res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
            res.send(buffer);
        } catch (error) {
            console.error('Error exporting report:', error);
            res.status(500).json({ message: error.message });
        }
    }
};

export default reportsController;
