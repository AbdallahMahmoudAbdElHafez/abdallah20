import { DataTypes } from "sequelize";

export default (sequelize) => {
    return sequelize.define(
        "sales_return_items",
        {
            id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
            sales_return_id: { type: DataTypes.INTEGER, allowNull: false },
            product_id: { type: DataTypes.INTEGER, allowNull: false },
            quantity: { type: DataTypes.INTEGER, allowNull: false },
            price: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
            return_condition: {
                type: DataTypes.ENUM('good', 'damaged', 'expired'),
                allowNull: false,
                defaultValue: 'good'
            },
            batch_number: { type: DataTypes.STRING, allowNull: true },
            expiry_date: { type: DataTypes.DATEONLY, allowNull: true },
            batch_status: {
                type: DataTypes.ENUM('known', 'unknown', 'unreadable'),
                allowNull: false,
                defaultValue: 'unknown'
            }
        },
        {
            timestamps: false,
            tableName: "sales_return_items"
        }
    );
};
