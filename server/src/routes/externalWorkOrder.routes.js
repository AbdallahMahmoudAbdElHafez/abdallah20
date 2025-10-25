import express from 'express';
import ExternalWorkOrdersController from '../controllers/externalWorkOrder.controller.js';

const router = express.Router();

router.get('/', ExternalWorkOrdersController.getAll);
router.post('/', ExternalWorkOrdersController.create);
router.post('/:id/receive', ExternalWorkOrdersController.receive);
router.delete('/:id', ExternalWorkOrdersController.delete);

export default router;