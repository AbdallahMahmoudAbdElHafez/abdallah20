// server/src/models/warehouseTransfers.model.js
import { DataTypes } from "sequelize";
export default (sequelize) => {
  const WarehouseTransfer = sequelize.define(
    "warehouse_transfer",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      from_warehouse_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      to_warehouse_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      transfer_date: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
      note: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
    },
    {
      tableName: "warehouse_transfers",
      timestamps: false,
    }
  );

  return WarehouseTransfer;
};
