// server/src/models/purchaseInvoice.model.js

import { DataTypes } from 'sequelize';
export default (sequelize) => {
    return sequelize.define('PurchaseInvoice', {
        id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
        supplier_id: { type: DataTypes.INTEGER, allowNull: false },
        purchase_order_id: { type: DataTypes.INTEGER, allowNull: true },
        invoice_number: { type: DataTypes.STRING(100), allowNull: false },
        invoice_date: { type: DataTypes.DATEONLY, allowNull: false },
        due_date: { type: DataTypes.DATEONLY, allowNull: true },
        status: {
            type: DataTypes.ENUM("unpaid", "paid", "partially_paid", "cancelled"),
            defaultValue: "unpaid"
        },
        subtotal: { type: DataTypes.DECIMAL(18, 2), defaultValue: 0.0 },
        additional_discount: { type: DataTypes.DECIMAL(18, 2), defaultValue: 0.0 },
        vat_rate: { type: DataTypes.DECIMAL(5, 2), defaultValue: 0.0 },
        vat_amount: { type: DataTypes.DECIMAL(18, 2), defaultValue: 0.0 },
        tax_rate: { type: DataTypes.DECIMAL(5, 2), defaultValue: 0.0 },
        tax_amount: { type: DataTypes.DECIMAL(18, 2), defaultValue: 0.0 },
        total_amount: { type: DataTypes.DECIMAL(18, 2), defaultValue: 0.0 },
        created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
        updated_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    }, {
        tableName: 'purchase_invoices',
        timestamps: false,
    });
}

