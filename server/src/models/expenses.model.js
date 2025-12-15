import { DataTypes } from "sequelize";

export default (sequelize) => {
    return sequelize.define(
        "Expense",
        {
            id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
            expense_date: {
                type: DataTypes.DATEONLY,
                allowNull: false,
                defaultValue: sequelize.literal("CURDATE()")
            },
            description: {
                type: DataTypes.STRING(255),
                allowNull: false
            },
            amount: {
                type: DataTypes.DECIMAL(10, 2),
                allowNull: false,
                validate: {
                    min: 0.01 // CHECK ((`amount` > 0))
                }
            },
            debit_account_id: { type: DataTypes.INTEGER, allowNull: false },
            credit_account_id: { type: DataTypes.INTEGER, allowNull: false },
            city_id: { type: DataTypes.INTEGER, allowNull: true },
            employee_id: { type: DataTypes.INTEGER, allowNull: true },
            party_id: { type: DataTypes.INTEGER, allowNull: true },
            created_at: {
                type: DataTypes.DATE,
                defaultValue: sequelize.literal("CURRENT_TIMESTAMP")
            },
        },
        {
            timestamps: false,
            tableName: "expenses",
            indexes: [
                { fields: ["debit_account_id"] },
                { fields: ["credit_account_id"] },
                { fields: ["city_id"] },
                { fields: ["employee_id"] },
                { fields: ["party_id"] },
            ]
        }
    );
};
