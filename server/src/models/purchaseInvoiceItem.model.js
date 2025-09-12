// server/src/models/purchaseInvoiceItem.model.js

import { DataTypes } from 'sequelize';
export default (sequelize) => {
    return sequelize.define('PurchaseInvoiceItem', {
        id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
        purchase_invoice_id: { type: DataTypes.INTEGER, allowNull: false },
        product_id: { type: DataTypes.INTEGER, allowNull: false },
        warehouse_id: { type: DataTypes.INTEGER, allowNull: false },
        batch_number: { type: DataTypes.STRING(100), allowNull: true },
        expiry_date: { type: DataTypes.DATE, allowNull: true },
        quantity: { type: DataTypes.DECIMAL(18, 2), allowNull: false, defaultValue: 0.0 },
        bonus_quantity: { type: DataTypes.DECIMAL(18, 2), allowNull: false, defaultValue: 0.0 },
        unit_price: { type: DataTypes.DECIMAL(18, 2), allowNull: false, defaultValue: 0.0 },
        discount: { type: DataTypes.DECIMAL(18, 2), allowNull: false, defaultValue: 0.0 },
        total_price: {
            type: DataTypes.VIRTUAL,
            get() {
                return (
                    (Number(this.quantity) + Number(this.bonus_quantity || 0)) *
                    Number(this.unit_price) -
                    Number(this.discount || 0)
                );
            },
        },

        created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
        updated_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    }, {
        tableName: 'purchase_invoice_items',
        timestamps: false,
    });
}

