// server/src/models/unit.model.js
import { DataTypes } from 'sequelize';

export default (sequelize) => {
  return sequelize.define('Unit', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING(100), allowNull: false },
  }, {
    tableName: 'units',
    timestamps: false
  });
};

