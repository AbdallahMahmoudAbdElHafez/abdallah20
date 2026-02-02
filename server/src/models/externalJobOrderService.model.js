import { DataTypes } from 'sequelize';

export default (sequelize) => {
    return sequelize.define(
        'ExternalJobOrderService',
        {
            id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
            job_order_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: { model: 'external_job_orders', key: 'id' }
            },
            party_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: { model: 'parties', key: 'id' }
            },
            service_date: { type: DataTypes.DATEONLY, defaultValue: DataTypes.NOW },
            amount: { type: DataTypes.DECIMAL(18, 2), allowNull: false },
            status: {
                type: DataTypes.ENUM('unpaid', 'partially_paid', 'paid'),
                defaultValue: 'unpaid'
            },
            note: { type: DataTypes.TEXT, allowNull: true },
        },
        {
            tableName: 'external_job_order_services',
            underscored: true,
            timestamps: true,
        }
    );
};
