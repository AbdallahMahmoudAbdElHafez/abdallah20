import { Router } from 'express';
import { IssueVouchersController } from '../controllers/IssueVouchers.controller.js';
import issueVoucherItemsRoutes from '../routes/IssueVoucherItems.routes.js';

const router = Router();
const issueVouchersController = new IssueVouchersController();

// Main issue vouchers routes
router.post('/', issueVouchersController.createIssueVoucher.bind(issueVouchersController));
router.get('/', issueVouchersController.getAllIssueVouchers.bind(issueVouchersController));
router.get('/:id', issueVouchersController.getIssueVoucherById.bind(issueVouchersController));
router.get('/voucher-no/:voucher_no', issueVouchersController.getIssueVoucherByVoucherNo.bind(issueVouchersController));
router.put('/:id', issueVouchersController.updateIssueVoucher.bind(issueVouchersController));
router.delete('/:id', issueVouchersController.deleteIssueVoucher.bind(issueVouchersController));
router.patch('/:id/status', issueVouchersController.updateVoucherStatus.bind(issueVouchersController));

// Additional routes
router.get('/:id/totals', issueVouchersController.getVoucherTotals.bind(issueVouchersController));
router.post('/check-inventory', issueVouchersController.checkInventoryAvailability.bind(issueVouchersController));

// Include issue voucher items routes
router.use('/', issueVoucherItemsRoutes);

export default router;