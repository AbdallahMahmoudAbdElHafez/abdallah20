import { DataTypes } from 'sequelize';

export default (sequelize) => {
    return sequelize.define(
        'ExternalJobOrderItem',
        {
            id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
            job_order_id: { type: DataTypes.INTEGER, allowNull: false },
            product_id: { type: DataTypes.INTEGER, allowNull: false },
            warehouse_id: { type: DataTypes.INTEGER, allowNull: false }, // Source warehouse
            quantity_sent: { type: DataTypes.DECIMAL(12, 3), allowNull: false },
            unit_cost: { type: DataTypes.DECIMAL(12, 2), allowNull: false }, // Cost at the time of sending
            total_cost: { type: DataTypes.DECIMAL(14, 2), allowNull: false },
            batch_id: { type: DataTypes.INTEGER, allowNull: true },
        },
        {
            tableName: 'external_job_order_items',
            timestamps: false,
        }
    );
};
