import { DataTypes } from "sequelize";

export default (sequelize) => {
    return sequelize.define(
        "sales_orders",
        {
            id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
            party_id: { type: DataTypes.INTEGER, allowNull: false },
            status: {
                type: DataTypes.ENUM('pending', 'approved', 'partial', 'completed', 'cancelled'),
                allowNull: false,
                defaultValue: 'pending'
            },
            warehouse_id: { type: DataTypes.INTEGER, allowNull: true },
            employee_id: { type: DataTypes.INTEGER, allowNull: true },
            order_date: {
                type: DataTypes.DATEONLY,
                allowNull: false,
                defaultValue: sequelize.literal("CURDATE()")
            },
            notes: { type: DataTypes.TEXT },
            created_at: {
                type: DataTypes.DATE,
                defaultValue: sequelize.literal("CURRENT_TIMESTAMP")
            },
            subtotal: {
                type: DataTypes.DECIMAL(18, 2),
                allowNull: false,
                defaultValue: 0.00
            },
            additional_discount: {
                type: DataTypes.DECIMAL(18, 2),
                allowNull: false,
                defaultValue: 0.00
            },
            vat_rate: {
                type: DataTypes.DECIMAL(5, 2),
                allowNull: false,
                defaultValue: 0.00
            },
            vat_amount: {
                type: DataTypes.DECIMAL(18, 2),
                allowNull: false,
                defaultValue: 0.00
            },
            tax_rate: {
                type: DataTypes.DECIMAL(5, 2),
                allowNull: false,
                defaultValue: 0.00
            },
            tax_amount: {
                type: DataTypes.DECIMAL(18, 2),
                allowNull: false,
                defaultValue: 0.00
            },
            total_amount: {
                type: DataTypes.DECIMAL(10, 2),
                allowNull: false,
                defaultValue: 0.00
            }
        },
        {
            timestamps: false,
            tableName: "sales_orders",
            indexes: [
                { fields: ["party_id"] },
                { fields: ["warehouse_id"] },
                { fields: ["employee_id"] }
            ]
        }
    );
};
