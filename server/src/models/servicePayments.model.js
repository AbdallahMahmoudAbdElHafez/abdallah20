import { DataTypes } from 'sequelize';

export default (sequelize) => {
    return sequelize.define(
        'ServicePayment',
        {
            id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
            party_id: { type: DataTypes.INTEGER, allowNull: false, references: { model: 'parties', key: 'id' } },
            amount: { type: DataTypes.DECIMAL(12, 2), allowNull: false },
            payment_date: { type: DataTypes.DATEONLY, defaultValue: DataTypes.NOW },
            payment_method: { type: DataTypes.ENUM('cash', 'bank', 'cheque', 'other'), defaultValue: 'cash' },
            reference_number: { type: DataTypes.STRING, allowNull: true },
            account_id: { type: DataTypes.INTEGER, allowNull: false, references: { model: 'accounts', key: 'id' } },
            external_job_order_id: { type: DataTypes.INTEGER, allowNull: true, references: { model: 'external_job_orders', key: 'id' } },
            note: { type: DataTypes.TEXT, allowNull: true },
        },
        {
            tableName: 'service_payments',
            underscored: true,
            timestamps: true,
        }
    );
};
