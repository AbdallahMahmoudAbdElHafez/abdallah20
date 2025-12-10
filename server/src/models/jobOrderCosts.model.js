// src/models/jobOrderCosts.model.js
import { DataTypes } from 'sequelize';

export default (sequelize) => {
    return sequelize.define(
        'JobOrderCost',
        {
            id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
            job_order_id: { type: DataTypes.INTEGER, allowNull: false },
            cost_type: {
                type: DataTypes.ENUM('raw_material', 'processing', 'transport', 'other'),
                allowNull: false,
            },
            amount: { type: DataTypes.DECIMAL(12, 2), allowNull: false },
            cost_per_unit: { type: DataTypes.DECIMAL(12, 2), allowNull: true },
            cost_date: { type: DataTypes.DATEONLY, allowNull: true },
            notes: { type: DataTypes.TEXT, allowNull: true },
        },
        {
            tableName: 'job_order_costs',
            timestamps: false,
        }
    );
};
