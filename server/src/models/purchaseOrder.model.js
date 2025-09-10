import { DataTypes } from 'sequelize';


export default (sequelize) => {
    return sequelize.define('PurchaseOrder', {
        id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
        supplier_id: { type: DataTypes.INTEGER, allowNull: false },
        order_number: { type: DataTypes.STRING(100) },
        order_date: { type: DataTypes.DATEONLY, allowNull: false },
        status: {
            type: DataTypes.ENUM("draft", "approved", "closed", "cancelled"),
            defaultValue: "draft"
        },
        total_amount: { type: DataTypes.DECIMAL(18, 2), defaultValue: 0.0 },
    }, {
        tableName: 'purchase_orders',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    });
}
 