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
router.get('/job-orders', reportsController.getJobOrdersReport);
router.get('/warehouse', reportsController.getWarehouseReport);
router.get('/issue-vouchers', reportsController.getIssueVouchersReport);

// Export
router.get('/export/:type', reportsController.exportReport);

export default router;
