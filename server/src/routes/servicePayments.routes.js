import express from 'express';
import ServicePaymentsController from '../controllers/servicePayments.controller.js';

const router = express.Router();

router.get('/', ServicePaymentsController.getAll);
router.get('/:id', ServicePaymentsController.getById);
router.post('/', ServicePaymentsController.create);
router.put('/:id', ServicePaymentsController.update);
router.delete('/:id', ServicePaymentsController.remove);

export default router;
