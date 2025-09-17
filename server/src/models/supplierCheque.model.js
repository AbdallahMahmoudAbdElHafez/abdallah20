import { DataTypes } from "sequelize";

export default (sequelize) =>
  sequelize.define(
    "SupplierCheque",
    {
      purchase_payment_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: "purchase_invoice_payments", key: "id" },
      },
      cheque_number: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      bank_name: DataTypes.STRING,
      issue_date: { type: DataTypes.DATEONLY, allowNull: false },
      due_date: { type: DataTypes.DATEONLY, allowNull: false },
      amount: { type: DataTypes.DECIMAL(18, 2), allowNull: false },
      status: {
        type: DataTypes.ENUM("issued", "cleared", "bounced", "cancelled"),
        defaultValue: "issued",
      },
    },
    {
      tableName: "supplier_cheques",
      underscored: true,
      timestamps: true,
    }
  );
