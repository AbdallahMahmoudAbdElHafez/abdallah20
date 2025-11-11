// src/models/externalJobOrders.model.js
import { DataTypes } from 'sequelize';

export default (sequelize) => {
    return sequelize.define(
  'ExternalJobOrder',
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    party_id: { type: DataTypes.INTEGER, allowNull: false },
    product_id: { type: DataTypes.INTEGER, allowNull: false },
    process_id: { type: DataTypes.INTEGER, allowNull: true },
    warehouse_id: { type: DataTypes.INTEGER, allowNull: false },
    status: {
      type: DataTypes.ENUM('planned', 'in_progress', 'completed', 'cancelled'),
      defaultValue: 'planned',
    },
    start_date: { type: DataTypes.DATEONLY, allowNull: true },
    end_date: { type: DataTypes.DATEONLY, allowNull: true },
    order_quantity: { type: DataTypes.DECIMAL(12, 3), allowNull: true },
    produced_quantity: { type: DataTypes.DECIMAL(12, 3), allowNull: true },
    cost_estimate: { type: DataTypes.DECIMAL(12, 2), defaultValue: 0.0 },
    cost_actual: { type: DataTypes.DECIMAL(12, 2), defaultValue: 0.0 },
    reference_no: { type: DataTypes.STRING(100), allowNull: true },
  },
  {
    tableName: 'external_job_orders',
    timestamps: false,
  }
)
};

