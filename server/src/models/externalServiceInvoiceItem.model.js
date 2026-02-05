// src/models/externalServiceInvoiceItem.model.js
import { DataTypes } from 'sequelize';

export default (sequelize) => {
    return sequelize.define(
        'ExternalServiceInvoiceItem',
        {
            id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
            invoice_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: { model: 'external_service_invoices', key: 'id' },
                onDelete: 'CASCADE'
            },
            service_type_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: { model: 'service_types', key: 'id' }
            },
            description: { type: DataTypes.TEXT, allowNull: true },
            quantity: { type: DataTypes.DECIMAL(12, 3), defaultValue: 1.000 },
            unit_price: { type: DataTypes.DECIMAL(12, 2), allowNull: false },
            line_total: { type: DataTypes.DECIMAL(14, 2), allowNull: false },
        },
        {
            tableName: 'external_service_invoice_items',
            underscored: true,
            timestamps: false,
        }
    );
};
