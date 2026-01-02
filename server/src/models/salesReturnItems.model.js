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
            }
        },
        {
            timestamps: false,
            tableName: "sales_return_items"
        }
    );
};
