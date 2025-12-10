// server/src/models/entryTypes.model.js
import { DataTypes } from 'sequelize';

export default (sequelize) => {
    return sequelize.define('EntryType', {
        id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        name: { type: DataTypes.STRING(100), allowNull: false },
    }, {
        tableName: 'entry_types',
        timestamps: false
    });
};
