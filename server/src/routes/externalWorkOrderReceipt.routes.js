import express from 'express';
import ExternalWorkOrderReceiptController from '../controllers/externalWorkOrderReceipt.controller.js';

const router = express.Router();

router.get('/', ExternalWorkOrderReceiptController.getAll);
router.post('/', ExternalWorkOrderReceiptController.create);
router.delete('/:id', ExternalWorkOrderReceiptController.delete);

export default router;