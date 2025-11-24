import { DataTypes } from "sequelize";

export default (sequelize) => {
    return sequelize.define(
        "sales_order_items",
        {
            id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
            sales_order_id: { type: DataTypes.INTEGER, allowNull: false },
            product_id: { type: DataTypes.INTEGER, allowNull: false },
            quantity: { type: DataTypes.INTEGER, allowNull: false },
            price: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
            discount: { type: DataTypes.DECIMAL(10, 2), allowNull: false, defaultValue: 0.00 },
            tax_percent: { type: DataTypes.DECIMAL(5, 2), allowNull: false, defaultValue: 0.00 },
            tax_amount: { type: DataTypes.DECIMAL(10, 2), allowNull: false, defaultValue: 0.00 },
            bonus: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
            warehouse_id: { type: DataTypes.INTEGER, allowNull: true }
        },
        {
            timestamps: false,
            tableName: "sales_order_items",
            indexes: [
                { fields: ["sales_order_id"] },
                { fields: ["product_id"] },
                { fields: ["warehouse_id"] }
            ]
        }
    );
};
