import { DataTypes } from 'sequelize';

export default (sequelize) => {
return sequelize.define('Country', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING(100), allowNull: false },        
}, {
    tableName: 'countries',
    timestamps: false
});
};

