import { DataTypes } from "sequelize";

export default (sequelize) => {
  return sequelize.define(
    "AccountingSetting",
    {
      operation_type: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      account_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      description: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
    },
    {
      tableName: "accounting_settings",
      timestamps: false, // سيضيف createdAt و updatedAt تلقائياً
    }
  );
};
