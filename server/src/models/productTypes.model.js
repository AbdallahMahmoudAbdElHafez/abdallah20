import _sequelizePkg from 'sequelize';
const { DataTypes } = _sequelizePkg;

export default (sequelize) => {
    return sequelize.define('ProductType', {
        id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        name: { type: DataTypes.STRING(100), allowNull: false },
    }, {
        tableName: 'product_types',
        timestamps: false
    });
}
