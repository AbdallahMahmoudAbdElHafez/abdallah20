// src/models/externalWorkOrderMaterial.model.js
import { DataTypes } from 'sequelize';

export default (sequelize) => {
  const ExternalWorkOrderMaterial = sequelize.define('external_work_order_material', {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    work_order_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
    },
    product_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
    },
    warehouse_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
    },
    quantity: {
      type: DataTypes.DECIMAL(12, 3),
      allowNull: false,
    },
    cost_per_unit: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
  }, {
    tableName: 'external_work_order_materials',
    timestamps: false,
  });

  return ExternalWorkOrderMaterial;
};
