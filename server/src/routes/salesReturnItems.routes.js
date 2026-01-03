import express from 'express';
import * as SalesReturnItemsController from '../controllers/salesReturnItems.controller.js';

const router = express.Router();

router.get('/', SalesReturnItemsController.getAll);
router.get('/:id', SalesReturnItemsController.getById);
router.post('/', SalesReturnItemsController.create);
router.put('/:id', SalesReturnItemsController.update);
router.delete('/:id', SalesReturnItemsController.remove);

export default router;
