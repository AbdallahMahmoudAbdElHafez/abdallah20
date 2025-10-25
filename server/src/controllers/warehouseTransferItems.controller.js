// src/controllers/warehouseTransferItems.controller.js
import * as service from "../services/warehouseTransferItems.service.js";

export const getAll = async (req, res) => {
  try {
    const items = await service.getAllTransferItems();
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getByTransfer = async (req, res) => {
  try {
    const { transferId } = req.params;
    const items = await service.getTransferItemsByTransfer(transferId);
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const create = async (req, res) => {
  try {
    const item = await service.createTransferItem(req.body);
    res.status(201).json(item);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const update = async (req, res) => {
  try {
    const { id } = req.params;
    const item = await service.updateTransferItem(id, req.body);
    res.json(item);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const remove = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await service.deleteTransferItem(id);
    res.json(result);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};
