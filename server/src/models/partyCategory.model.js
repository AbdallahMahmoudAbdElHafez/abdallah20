
import { DataTypes } from 'sequelize';
export default (sequelize) => {
    return sequelize.define('PartyCategory', {
        id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
        name: { type: DataTypes.STRING(100), allowNull: false },
    }, {
        tableName: 'party_categories',
        timestamps: false,
    });
}   

