import { DataTypes } from "sequelize";

export default (sequelize) => {
    return sequelize.define('BatchInventory', {
        batch_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            references: {
                model: 'batches',
                key: 'id'
            }
        },
        warehouse_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            references: {
                model: 'warehouses',
                key: 'id'
            }
        },
        quantity: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
            validate: {
                min: 0
            }
        }
    }, {
        tableName: 'batch_inventory',
        timestamps: false,
    });
};
