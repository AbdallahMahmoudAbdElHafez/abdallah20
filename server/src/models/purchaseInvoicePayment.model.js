import { DataTypes } from "sequelize";

export default (sequelize) =>
  sequelize.define(
    "PurchaseInvoicePayment",
    {
      purchase_invoice_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: "purchase_invoices", key: "id" },
      },
      payment_date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      payment_method: {
        type: DataTypes.ENUM("cash", "bank_transfer", "cheque"),
        allowNull: false,
      },
      account_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: "accounts", key: "id" },
      },
      amount: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false,
        validate: { min: 0.01 },
      },
      reference_number: DataTypes.STRING,
      note: DataTypes.STRING,
    },
    {
      tableName: "purchase_invoice_payments",
      underscored: true,
      timestamps: true,
    }
  );
