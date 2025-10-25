// src/models/externalWorkOrderReceipt.model.js
import { DataTypes } from 'sequelize';

export default (sequelize) => {
  const ExternalWorkOrderReceipt = sequelize.define('external_work_order_receipt', {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    work_order_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
    },
    warehouse_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
    },
    received_quantity: {
      type: DataTypes.DECIMAL(12, 3),
      allowNull: false,
    },
    receive_date: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  }, {
    tableName: 'external_work_order_receipts',
    timestamps: false,
  });

  return ExternalWorkOrderReceipt;
};
