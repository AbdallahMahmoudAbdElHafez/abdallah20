import { DataTypes } from "sequelize";

export default (sequelize) => {
    return sequelize.define(
        "sales_invoice_items",
        {
            id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
            sales_invoice_id: { type: DataTypes.INTEGER, allowNull: false },
            product_id: { type: DataTypes.INTEGER, allowNull: false },
            quantity: { type: DataTypes.INTEGER, allowNull: false },
            price: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
            discount: { type: DataTypes.DECIMAL(10, 2), allowNull: false, defaultValue: 0.00 },
            tax_percent: { type: DataTypes.DECIMAL(5, 2), allowNull: false, defaultValue: 0.00 },
            tax_amount: { type: DataTypes.DECIMAL(10, 2), allowNull: false, defaultValue: 0.00 },
            warehouse_id: { type: DataTypes.INTEGER, allowNull: true },
            bonus: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
            vat_rate: { type: DataTypes.DECIMAL(5, 2), allowNull: false, defaultValue: 0.00 },
            vat_amount: { type: DataTypes.DECIMAL(10, 2), allowNull: false, defaultValue: 0.00 }
        },
        {
            timestamps: false,
            tableName: "sales_invoice_items",
            indexes: [
                { fields: ["sales_invoice_id"] },
                { fields: ["product_id"] },
                { fields: ["warehouse_id"] }
            ]
        }
    );
};
