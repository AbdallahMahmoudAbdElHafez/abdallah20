import { DataTypes } from 'sequelize';
export default (sequelize) => {
    return sequelize.define('Governate', {
        id: {
            type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true
        },
        name: { type: DataTypes.STRING(100), allowNull: false },
        country_id: { type: DataTypes.INTEGER, allowNull: true, references: { model: 'countries', key: 'id' } },
    }, {
        tableName: 'governates',
        timestamps: false
    });
}



