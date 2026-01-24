import { DataTypes } from "sequelize";

export default (sequelize) => {
    return sequelize.define(
        "sales_invoice_payments",
        {
            id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
            sales_invoice_id: { type: DataTypes.INTEGER, allowNull: false },
            payment_date: {
                type: DataTypes.DATEONLY,
                allowNull: false,
                defaultValue: sequelize.literal("CURDATE()")
            },
            payment_method: {
                type: DataTypes.ENUM('cash', 'bank_transfer', 'cheque'),
                allowNull: false
            },
            account_id: { type: DataTypes.INTEGER, allowNull: false },
            amount: {
                type: DataTypes.DECIMAL(18, 2),
                allowNull: false,
                validate: {
                    min: 0.01
                }
            },
            reference_number: { type: DataTypes.STRING(100), allowNull: true },
            employee_id: { type: DataTypes.INTEGER, allowNull: true },
            note: { type: DataTypes.STRING(255), allowNull: true },
            withholding_tax_rate: {
                type: DataTypes.DECIMAL(5, 2),
                allowNull: false,
                defaultValue: 0.00
            },
            withholding_tax_amount: {
                type: DataTypes.DECIMAL(10, 2),
                allowNull: false,
                defaultValue: 0.00
            },
            created_at: {
                type: DataTypes.DATE,
                defaultValue: sequelize.literal("CURRENT_TIMESTAMP")
            },
            updated_at: {
                type: DataTypes.DATE,
                defaultValue: sequelize.literal("CURRENT_TIMESTAMP")
            }
        },
        {
            timestamps: true,
            createdAt: 'created_at',
            updatedAt: 'updated_at',
            tableName: "sales_invoice_payments",
            indexes: [
                { fields: ["sales_invoice_id"] },
                { fields: ["account_id"] }
            ]
        }
    );
};
