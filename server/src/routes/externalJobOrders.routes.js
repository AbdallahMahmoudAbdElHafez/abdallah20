// src/routes/externalJobOrders.routes.js
import { Router } from 'express';
import ExternalJobOrdersController from '../controllers/externalJobOrders.controller.js';

const router = Router();

router.get('/', ExternalJobOrdersController.getAll);
router.get('/calculate-cost', ExternalJobOrdersController.calculateCost);
router.post('/', ExternalJobOrdersController.create);
router.get('/:id', ExternalJobOrdersController.getById);
router.put('/:id', ExternalJobOrdersController.update);
router.delete('/:id', ExternalJobOrdersController.remove);

export default router;

