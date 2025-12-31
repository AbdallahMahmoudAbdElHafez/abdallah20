import { DataTypes } from "sequelize";

export default (sequelize) => {
    return sequelize.define('Batches', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        product_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'products',
                key: 'id'
            }
        },
        batch_number: {
            type: DataTypes.STRING(100),
            allowNull: false
        },
        expiry_date: {
            type: DataTypes.DATEONLY,
            allowNull: true
        }
    }, {
        tableName: 'batches',
        timestamps: false
    });
};
