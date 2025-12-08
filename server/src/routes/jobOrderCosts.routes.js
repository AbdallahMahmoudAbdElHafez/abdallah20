// src/routes/jobOrderCosts.routes.js
import { Router } from 'express';
import JobOrderCostsController from '../controllers/jobOrderCosts.controller.js';

const router = Router();

router.get('/', JobOrderCostsController.getAll);
router.get('/job-order/:jobOrderId', JobOrderCostsController.getByJobOrderId);
router.post('/', JobOrderCostsController.create);
router.get('/:id', JobOrderCostsController.getById);
router.put('/:id', JobOrderCostsController.update);
router.delete('/:id', JobOrderCostsController.remove);

export default router;
