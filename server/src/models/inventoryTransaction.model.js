// models/inventoryTransaction.model.js
import { DataTypes } from "sequelize";


export default (sequelize) => {
    return sequelize.define('InventoryTransaction', {
        id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
        product_id: { type: DataTypes.INTEGER, allowNull: false },
        warehouse_id: { type: DataTypes.INTEGER, allowNull: false },
        transaction_type: { type: DataTypes.ENUM("in", "out"), allowNull: false },
        transaction_date: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
        note: { type: DataTypes.TEXT, allowNull: true },
        source_type: {
            type: DataTypes.ENUM('purchase', 'manufacturing', 'transfer', 'adjustment', 'sales_invoice', 'sales_return', 'purchase_return', 'external_job_order', 'issue_voucher', 'opening'),
            defaultValue: 'adjustment'
        },
        source_id: { type: DataTypes.INTEGER, allowNull: true },
    }, {
        tableName: 'inventory_transactions',
        timestamps: false,
    });
}


