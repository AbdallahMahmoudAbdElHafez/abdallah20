// models/inventoryTransaction.model.js
import { DataTypes } from "sequelize";


export default (sequelize) => {
    return sequelize.define('InventoryTransaction', {
        id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
        product_id: { type: DataTypes.INTEGER, allowNull: false },
        warehouse_id: { type: DataTypes.INTEGER, allowNull: false },
        transaction_type: { type: DataTypes.ENUM("in", "out"), allowNull: false },
        quantity: { type: DataTypes.INTEGER, allowNull: false },
        cost_per_unit: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
        transaction_date: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
        note: { type: DataTypes.TEXT, allowNull: true },
    }, {
        tableName: 'inventory_transactions',
        timestamps: false,
    });
}


