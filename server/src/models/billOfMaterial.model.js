// src/models/billOfMaterial.model.js
import { DataTypes } from 'sequelize';

export default (sequelize) => {
  return sequelize.define('BillOfMaterial', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    product_id: { type: DataTypes.INTEGER, allowNull: false },
    material_id: { type: DataTypes.INTEGER, allowNull: false },
    quantity_per_unit: { type: DataTypes.DECIMAL(12,3), allowNull: false }
  }, {
    tableName: 'bill_of_materials',
    timestamps: false
  });
};
