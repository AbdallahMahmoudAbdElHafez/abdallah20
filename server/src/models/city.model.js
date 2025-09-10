
import { DataTypes } from "sequelize";

export default (sequelize) => {
    return sequelize.define('City', {
        id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        name: { type: DataTypes.STRING(100), allowNull: false },
        governate_id: { type: DataTypes.INTEGER, allowNull: true },
    }, {
        tableName: 'cities',
        timestamps: false
    });
}




