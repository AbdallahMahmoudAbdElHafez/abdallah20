// src/routes/processes.routes.js
import { Router } from 'express';
import ProcessController from '../controllers/processes.controller.js';

const router = Router();

router.get('/', ProcessController.getAll);
router.get('/:id', ProcessController.getById);
router.post('/', ProcessController.create);
router.put('/:id', ProcessController.update);
router.delete('/:id', ProcessController.remove);

export default router;
