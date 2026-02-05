// src/models/externalServiceInvoice.model.js
import { DataTypes } from 'sequelize';

export default (sequelize) => {
    return sequelize.define(
        'ExternalServiceInvoice',
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
            invoice_no: { type: DataTypes.STRING(50), allowNull: true },
            invoice_date: { type: DataTypes.DATEONLY, allowNull: false },
            status: {
                type: DataTypes.ENUM('Draft', 'Posted', 'Cancelled'),
                defaultValue: 'Draft'
            },
            sub_total: { type: DataTypes.DECIMAL(14, 2), defaultValue: 0.00 },
            tax_total: { type: DataTypes.DECIMAL(14, 2), defaultValue: 0.00 },
            total_amount: { type: DataTypes.DECIMAL(14, 2), defaultValue: 0.00 },
            notes: { type: DataTypes.TEXT, allowNull: true },
            journal_entry_id: {
                type: DataTypes.INTEGER,
                allowNull: true,
                references: { model: 'journal_entries', key: 'id' }
            },
            posted_at: { type: DataTypes.DATE, allowNull: true },
            posted_by: {
                type: DataTypes.INTEGER,
                allowNull: true,
                references: { model: 'users', key: 'id' }
            },
        },
        {
            tableName: 'external_service_invoices',
            underscored: true,
            timestamps: true,
        }
    );
};
