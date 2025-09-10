// purchaseOrderItem.js
import { DataTypes } from "sequelize";

export default (sequelize) => {
    return sequelize.define('PurchaseOrderItem', {
        id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
        purchase_order_id: { type: DataTypes.INTEGER, allowNull: false },
        product_id: { type: DataTypes.INTEGER, allowNull: false },
        batch_number: { type: DataTypes.STRING(100) },
        expiry_date: { type: DataTypes.DATE },
        quantity: { type: DataTypes.DECIMAL(18, 2), defaultValue: 0.0 },
        unit_price: { type: DataTypes.DECIMAL(18, 2), defaultValue: 0.0 },
        discount: { type: DataTypes.DECIMAL(18, 2), defaultValue: 0.0 },
        bonus_quantity: { type: DataTypes.DECIMAL(18, 2), defaultValue: 0.0 },
        total_price: { type: DataTypes.DECIMAL(18, 2) },
        expected_date: { type: DataTypes.DATE },
    }, {
        tableName: 'purchase_order_items',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    });
}

// server/src/models/purchaseOrderItem.model.js
