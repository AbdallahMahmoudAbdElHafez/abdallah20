// src/services/warehouseTransferItems.service.js
import { WarehouseTransferItem, Product } from "../models/index.js";

export const getAllTransferItems = async () => {
  return WarehouseTransferItem.findAll({
    include: [{ model: Product, as: "product" }],
  });
};

export const getTransferItemsByTransfer = async (transferId) => {
  return WarehouseTransferItem.findAll({
    where: { transfer_id: transferId },
    include: [{ model: Product, as: "product" }],
  });
};

export const createTransferItem = async (data) => {
  return WarehouseTransferItem.create(data);
};

export const updateTransferItem = async (id, data) => {
  const item = await WarehouseTransferItem.findByPk(id);
  if (!item) throw new Error("Item not found");
  await item.update(data);
  return item;
};

export const deleteTransferItem = async (id) => {
  const item = await WarehouseTransferItem.findByPk(id);
  if (!item) throw new Error("Item not found");
  await item.destroy();
  return { message: "Deleted successfully" };
};
