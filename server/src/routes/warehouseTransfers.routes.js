// src/routes/warehouseTransfers.routes.js
import express from 'express';
import WarehouseTransfersController from '../controllers/warehouseTransfers.controller.js';

const router = express.Router();


router.get('/', WarehouseTransfersController.getAll);
router.get('/:id', WarehouseTransfersController.getOne);
router.post('/', WarehouseTransfersController.create);
router.put('/:id', WarehouseTransfersController.update);
router.delete('/:id', WarehouseTransfersController.delete);

export default router;
