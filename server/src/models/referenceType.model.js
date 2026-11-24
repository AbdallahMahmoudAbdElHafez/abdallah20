// models/referenceType.model.js
import _sequelizePkg from 'sequelize';
const { DataTypes } = _sequelizePkg;

export default (sequelize) => {
  return sequelize.define('ReferenceType', {
    code: {
      type: DataTypes.STRING(50),
      unique: true,
      allowNull: false
    },
    label: {
      type: DataTypes.STRING(150),
      allowNull: false
    },
    description: DataTypes.TEXT
  }, {
    tableName: 'reference_types',
    underscored: true
  });





};
