import { DataTypes } from "sequelize";

export default (sequelize) => {
    return sequelize.define(
        "sales_returns",
        {
            id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
            sales_invoice_id: { type: DataTypes.INTEGER, allowNull: true },
            party_id: { type: DataTypes.INTEGER, allowNull: false },
            employee_id: { type: DataTypes.INTEGER, allowNull: true },
            warehouse_id: { type: DataTypes.INTEGER, allowNull: false },
            return_date: { type: DataTypes.DATEONLY, allowNull: false, defaultValue: sequelize.literal("CURDATE()") },
            notes: { type: DataTypes.TEXT },
            return_type: { type: DataTypes.ENUM('cash', 'credit', 'exchange'), allowNull: false, defaultValue: 'cash' },
            account_id: { type: DataTypes.INTEGER, allowNull: true },
            total_amount: { type: DataTypes.DECIMAL(10, 2), allowNull: false, defaultValue: 0.0 }, // Net + Tax
            tax_amount: { type: DataTypes.DECIMAL(10, 2), allowNull: false, defaultValue: 0.0 },
            created_at: { type: DataTypes.DATE, defaultValue: sequelize.literal("CURRENT_TIMESTAMP") }
        },
        {
            timestamps: false,
            tableName: "sales_returns",
            indexes: [
                { fields: ["sales_invoice_id"] },
                { fields: ["party_id"] },
                { fields: ["warehouse_id"] },
                { fields: ["employee_id"] }
            ]
        }
    );
}
