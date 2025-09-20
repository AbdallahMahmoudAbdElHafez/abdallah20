// server/src/models/accountingSetting.model.js
import { DataTypes } from "sequelize";

export default (sequelize) => {
  return sequelize.define(
    "AccountingSetting",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      operation_type: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      scope: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      parent_account_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      default_account_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      description: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
    },
    {
      tableName: "accounting_settings",
      underscored: true,
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );
};
