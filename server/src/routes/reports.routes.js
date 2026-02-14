import express from 'express';
import reportsController from '../controllers/reports.controller.js';

const router = express.Router();

// Dashboard Summary
router.get('/summary', reportsController.getDashboardSummary);
router.get('/top-products', reportsController.getTopSellingProducts);
router.get('/low-stock', reportsController.getLowStockItems);

// Detailed Reports
router.get('/sales', reportsController.getSalesReport);
router.get('/purchases', reportsController.getPurchasesReport);
router.get('/expenses', reportsController.getExpensesReport);
router.get('/journal-expenses', reportsController.getJournalExpensesReport);
router.get('/job-orders', reportsController.getJobOrdersReport);
router.get('/warehouse', reportsController.getWarehouseReport);
router.get('/issue-vouchers', reportsController.getIssueVouchersReport);
router.get('/issue-vouchers-employee', reportsController.getIssueVouchersEmployeeSummary);
router.get('/opening-sales', reportsController.getOpeningSalesInvoicesReport);
router.get('/zakat', reportsController.getZakatReport);
router.get('/customer-receivables', reportsController.getCustomerReceivables);
router.get('/profit', reportsController.getProfitReport);
router.get('/bank-cash', reportsController.getBankAndCashReport);
router.get('/safe-movements', reportsController.getSafeMovementsReport);
router.get('/general-ledger', reportsController.getGeneralLedgerReport);

// Export
router.get('/export/:type', reportsController.exportReport);

export default router;
