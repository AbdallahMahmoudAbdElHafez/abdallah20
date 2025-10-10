// server/src/models/expenseCategory.model.js
import { DataTypes } from "sequelize";

export default (sequelize) => {
  return sequelize.define("ExpenseCategory", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
    },
  }, {
    tableName: "expense_categories",
    timestamps: false,
  });
};
