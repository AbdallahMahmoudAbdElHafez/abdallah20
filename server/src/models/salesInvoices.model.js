import { DataTypes } from "sequelize";

export default (sequelize) => {
    return sequelize.define(
        "sales_invoices",
        {
            id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
            invoice_number: { type: DataTypes.STRING(100), allowNull: false, unique: true },
            invoice_type: {
                type: DataTypes.ENUM('normal', 'opening'),
                allowNull: false,
                defaultValue: 'normal'
            },
            status: {
                type: DataTypes.ENUM('unpaid', 'paid', 'partial', 'cancelled'),
                allowNull: false,
                defaultValue: 'unpaid'
            },
            sales_order_id: { type: DataTypes.INTEGER, allowNull: true },
            party_id: { type: DataTypes.INTEGER, allowNull: false },
            invoice_date: {
                type: DataTypes.DATEONLY,
                allowNull: false,
                defaultValue: sequelize.literal("CURDATE()")
            },
            due_date: { type: DataTypes.DATEONLY, allowNull: true },
            shipping_amount: {
                type: DataTypes.DECIMAL(10, 2),
                allowNull: false,
                defaultValue: 0.00
            },
            created_at: {
                type: DataTypes.DATE,
                defaultValue: sequelize.literal("CURRENT_TIMESTAMP")
            },
            employee_id: { type: DataTypes.INTEGER, allowNull: true },
            warehouse_id: { type: DataTypes.INTEGER, allowNull: true },
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
            },
            note: {
                type: DataTypes.STRING(255),
                allowNull: true,
                defaultValue: null
            }
        },
        {
            timestamps: false,
            tableName: "sales_invoices",
            indexes: [
                { fields: ["invoice_number"], unique: true },
                { fields: ["sales_order_id"] },
                { fields: ["party_id"] },
                { fields: ["employee_id"] },
                { fields: ["warehouse_id"] }
            ]
        }
    );
};
