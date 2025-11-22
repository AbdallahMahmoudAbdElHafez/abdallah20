import { DataTypes } from "sequelize";

export default (sequelize) => {
    return sequelize.define(
        "purchase_return_items",
        {
            id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
            purchase_return_id: { type: DataTypes.INTEGER, allowNull: false },
            purchase_invoice_item_id: { type: DataTypes.INTEGER, allowNull: false },
            product_id: { type: DataTypes.INTEGER, allowNull: false },
            quantity: { type: DataTypes.INTEGER, allowNull: false },
            reason: { type: DataTypes.TEXT },
        },
        {
            timestamps: false,
            tableName: "purchase_return_items",
        }
    );
};
