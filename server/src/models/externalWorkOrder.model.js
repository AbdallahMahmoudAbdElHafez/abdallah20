// src/models/externalWorkOrder.model.js
import { DataTypes } from 'sequelize';

export default (sequelize) => {
  const ExternalWorkOrder = sequelize.define('external_work_order', {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    supplier_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
    },
    product_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
    },

    quantity: {
      type: DataTypes.DECIMAL(12, 3),
      allowNull: false,
    },
status: {
  type: DataTypes.ENUM('pending', 'in_progress', 'completed', 'cancelled'),
  defaultValue: 'pending',
  allowNull: false,
},
order_date: {
  type: DataTypes.DATE,
  allowNull: true,
  defaultValue: DataTypes.NOW,
},

    note: {
      type: DataTypes.TEXT,
    },
  }, {
    tableName: 'external_work_orders',
    timestamps: false,
  });

  return ExternalWorkOrder;
};
