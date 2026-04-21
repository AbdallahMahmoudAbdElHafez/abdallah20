import { DataTypes } from "sequelize";

export default (sequelize) => {
  const LeaveType = sequelize.define(
    "LeaveType",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      is_paid: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
    },
    {
      tableName: "leave_types",
      timestamps: false,
    }
  );

  return LeaveType;
};
