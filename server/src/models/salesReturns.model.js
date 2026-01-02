import { DataTypes } from "sequelize";

export default (sequelize) => {
    return sequelize.define(
        "sales_returns",
        {
            id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
            sales_invoice_id: { type: DataTypes.INTEGER, allowNull: true },
            warehouse_id: { type: DataTypes.INTEGER, allowNull: false },
            return_date: { type: DataTypes.DATEONLY, allowNull: false, defaultValue: sequelize.literal("CURDATE()") },
            notes: { type: DataTypes.TEXT },
            return_type: { type: DataTypes.ENUM('cash', 'credit'), allowNull: false, defaultValue: 'cash' },
            created_at: { type: DataTypes.DATE, defaultValue: sequelize.literal("CURRENT_TIMESTAMP") }
        },
        {
            timestamps: false,
            tableName: "sales_returns"
        }
    );
}
