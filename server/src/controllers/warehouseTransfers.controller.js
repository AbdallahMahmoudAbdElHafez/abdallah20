// src/controllers/warehouseTransfers.controller.js
import WarehouseTransfersService from '../services/warehouseTransfers.service.js';

export default class WarehouseTransfersController {


  static async getAll(req, res, next) {
    try {
      const data = await WarehouseTransfersService.getAll();
      res.json(data);
    } catch (err) {
    res.status(500).json({ message: err.message });
    }
  };

  static async getOne(req, res, next) {
    try {
      const transfer = await WarehouseTransfersService.getById(req.params.id);
      if (!transfer) return res.status(404).json({ message: 'Transfer not found' });
      res.json(transfer);
    } catch (err) {
      next(err);
    }
  };

  static async create(req, res, next) {
    try {
      const created = await WarehouseTransfersService.create(req.body);
      res.status(201).json(created);
    } catch (err) {
      next(err);
    }
  };

 static async update  (req, res, next)  {
    try {
      const updated = await WarehouseTransfersService.update(req.params.id, req.body);
      if (!updated) return res.status(404).json({ message: 'Transfer not found' });
      res.json(updated);
    } catch (err) {
      next(err);
    }
  };

 static async delete (req, res, next)  {
    try {
      const deleted = await WarehouseTransfersService.delete(req.params.id);
      res.json({ deleted });
    } catch (err) {
      next(err);
    }
  };
}
