import { DataTypes } from "sequelize";

export default (sequelize) => {
    return sequelize.define('Warehouse', {
        id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        name: { type: DataTypes.STRING(100), allowNull: false },
        address: { type: DataTypes.TEXT, allowNull: true },
        city_id: { type: DataTypes.INTEGER, allowNull: true },
        created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    }, {
        tableName: 'warehouses',
        timestamps: false
    });
}
 

