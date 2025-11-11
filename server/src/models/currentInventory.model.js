import { DataTypes } from "sequelize";

export default (sequelize) => {
  return sequelize.define(
    "CurrentInventory",
    {
      id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
      product_id: { type: DataTypes.INTEGER, allowNull: false },
      warehouse_id: { type: DataTypes.INTEGER, allowNull: false },
      quantity: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
      last_updated: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      tableName: "current_inventory",
      timestamps: false,
      indexes: [
        { unique: true, fields: ["product_id", "warehouse_id"] },
      ],
    }
  );
};
