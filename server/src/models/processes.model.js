// src/models/processes.model.js
import { DataTypes } from 'sequelize';

export default (sequelize) => {
  return sequelize.define(
    'Process',
    {
      id: {
        type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    tableName: 'processes',
    timestamps: false,
  }
)
}
;
