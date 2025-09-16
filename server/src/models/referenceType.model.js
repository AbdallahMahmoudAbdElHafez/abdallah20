// models/referenceType.model.js
import { DataTypes } from "sequelize";

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

  ReferenceType.associate = (models) => {
    ReferenceType.hasMany(models.JournalEntry, {
      foreignKey: 'reference_type_id'
    });
  };


};
