import { DataTypes } from "sequelize";

export default (sequelize) => {
    return sequelize.define('ProductType', {
        id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        name: { type: DataTypes.STRING(100), allowNull: false },
    }, {
        tableName: 'product_types',
        timestamps: false
    });
}
