import { DataTypes } from "sequelize";
export default (sequelize)=> { 
return sequelize.define(
  "purchase_returns",
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    purchase_invoice_id: { type: DataTypes.INTEGER, allowNull: false },
    return_date: { type: DataTypes.DATEONLY, allowNull: false, defaultValue: sequelize.literal("CURDATE()") },
    notes: { type: DataTypes.TEXT },
    created_at: { type: DataTypes.DATE, defaultValue: sequelize.literal("CURRENT_TIMESTAMP") },
    total_amount: { type: DataTypes.DECIMAL(10, 2), allowNull: false, defaultValue: 0.0 },
    tax_amount: { type: DataTypes.DECIMAL(10, 2), allowNull: false, defaultValue: 0.0 }
  },
  {
    timestamps: false,
    tableName: "purchase_returns"
  }
);
}
