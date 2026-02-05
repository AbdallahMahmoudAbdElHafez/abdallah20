// src/models/serviceTypes.model.js
import { DataTypes } from 'sequelize';

export default (sequelize) => {
    return sequelize.define(
        'ServiceType',
        {
            id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
            name: { type: DataTypes.STRING(100), allowNull: false },
            account_id: {
                type: DataTypes.INTEGER,
                allowNull: true,
                references: { model: 'accounts', key: 'id' }
            },
            affects_job_cost: { type: DataTypes.BOOLEAN, defaultValue: true },
        },
        {
            tableName: 'service_types',
            underscored: true,
            timestamps: true,
        }
    );
};
