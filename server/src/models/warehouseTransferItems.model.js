// src/models/warehouseTransferItems.model.js
import { DataTypes } from "sequelize";

export default (sequelize) => {
  const WarehouseTransferItem = sequelize.define(
    "WarehouseTransferItem",
    {
      id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
      transfer_id: { type: DataTypes.INTEGER, allowNull: false },
      product_id: { type: DataTypes.INTEGER, allowNull: false },
      quantity: { type: DataTypes.INTEGER, allowNull: false },
      cost_per_unit: { type: DataTypes.DECIMAL(10, 2), allowNull: false },

    },
    {
      tableName: "warehouse_transfer_items",
      timestamps: false,
    }
  );

  return WarehouseTransferItem;
};
