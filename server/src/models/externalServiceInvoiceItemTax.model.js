// src/models/externalServiceInvoiceItemTax.model.js
import { DataTypes } from 'sequelize';

export default (sequelize) => {
    return sequelize.define(
        'ExternalServiceInvoiceItemTax',
        {
            id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
            invoice_item_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: { model: 'external_service_invoice_items', key: 'id' },
                onDelete: 'CASCADE'
            },
            tax_name: { type: DataTypes.STRING(50), allowNull: false },
            tax_rate: { type: DataTypes.DECIMAL(5, 4), allowNull: false },
            tax_amount: { type: DataTypes.DECIMAL(12, 2), allowNull: false },
        },
        {
            tableName: 'external_service_invoice_item_taxes',
            underscored: true,
            timestamps: false,
        }
    );
};
