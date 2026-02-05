// src/models/jobOrderCostTransaction.model.js
import { DataTypes } from 'sequelize';

export default (sequelize) => {
    return sequelize.define(
        'JobOrderCostTransaction',
        {
            id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
            job_order_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: { model: 'external_job_orders', key: 'id' }
            },
            invoice_id: {
                type: DataTypes.INTEGER,
                allowNull: true,
                references: { model: 'external_service_invoices', key: 'id' }
            },
            cost_type: {
                type: DataTypes.ENUM('Service', 'Transport', 'RawMaterial', 'Other'),
                allowNull: false
            },
            amount: { type: DataTypes.DECIMAL(14, 2), allowNull: false },
            transaction_date: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
            notes: { type: DataTypes.TEXT, allowNull: true },
        },
        {
            tableName: 'job_order_cost_transactions',
            underscored: true,
            timestamps: false,
        }
    );
};
