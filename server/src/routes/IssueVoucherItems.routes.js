import { Router } from 'express';
import { IssueVoucherItemsController } from '../controllers/IssueVoucherItems.controller.js';

const router = Router();
const issueVoucherItemsController = new IssueVoucherItemsController();

// Routes for individual items
router.post('/items', issueVoucherItemsController.createIssueVoucherItem.bind(issueVoucherItemsController));
router.get('/items/:id', issueVoucherItemsController.getIssueVoucherItemById.bind(issueVoucherItemsController));
router.put('/items/:id', issueVoucherItemsController.updateIssueVoucherItem.bind(issueVoucherItemsController));
router.delete('/items/:id', issueVoucherItemsController.deleteIssueVoucherItem.bind(issueVoucherItemsController));

// Routes for bulk operations
router.post('/items/bulk', issueVoucherItemsController.createBulkItems.bind(issueVoucherItemsController));
router.get('/voucher/:voucherId/items', issueVoucherItemsController.getItemsByVoucherId.bind(issueVoucherItemsController));
router.delete('/voucher/:voucherId/items', issueVoucherItemsController.deleteAllItemsByVoucherId.bind(issueVoucherItemsController));

// Routes for calculations and utilities
router.get('/voucher/:voucherId/totals', issueVoucherItemsController.getVoucherTotals.bind(issueVoucherItemsController));
router.post('/check-inventory', issueVoucherItemsController.checkInventoryAvailability.bind(issueVoucherItemsController));
router.patch('/voucher/:voucherId/update-costs', issueVoucherItemsController.updateItemCosts.bind(issueVoucherItemsController));

export default router;