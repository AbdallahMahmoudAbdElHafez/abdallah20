import { Router } from 'express';
import { IssueVoucherReturnsController } from '../controllers/issueVoucherReturns.controller.js';

const router = Router();
const controller = new IssueVoucherReturnsController();

router.post('/', controller.createReturn.bind(controller));
router.get('/', controller.getAllReturns.bind(controller));
router.get('/voucher-items/:voucherId', controller.getIssueVoucherItems.bind(controller));
router.get('/:id', controller.getReturnById.bind(controller));
router.put('/:id', controller.updateReturn.bind(controller));
router.delete('/:id', controller.deleteReturn.bind(controller));
router.patch('/:id/status', controller.updateReturnStatus.bind(controller));

export default router;
