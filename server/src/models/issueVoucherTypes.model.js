import { DataTypes } from "sequelize";

export default (sequelize) => {
  const IssueVoucherType = sequelize.define(
    "issue_voucher_types",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      code: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
      },
      name: {
        type: DataTypes.STRING(150),
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      tableName: "issue_voucher_types",
      timestamps: false,
    }
  );

  return IssueVoucherType;
};
