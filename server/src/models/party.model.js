// server/src/models/party.model.js
import { DataTypes } from 'sequelize';

export default (sequelize) => {
    return sequelize.define('Party', {
        id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
        name: { type: DataTypes.STRING(150), allowNull: false },
        party_type: { 
            type: DataTypes.ENUM("customer", "supplier", "both"), 
            allowNull: false
        },
        phone: { type: DataTypes.STRING(20), allowNull: true },
        email: { type: DataTypes.STRING(100), allowNull: true },
        address: { type: DataTypes.TEXT, allowNull: true },
        tax_number: { type: DataTypes.STRING(50), allowNull: true },
        city_id: { type: DataTypes.INTEGER, allowNull: true },
        opening_balance: { type: DataTypes.DECIMAL(15, 2), allowNull: false, defaultValue: 0.00 },
        account_id: { type: DataTypes.INTEGER, allowNull: true },
        category_id: { type: DataTypes.INTEGER, allowNull: true },
        created_at: { 
            type: DataTypes.DATE, 
            defaultValue: DataTypes.NOW
        }
    }, {
        tableName: 'parties',
        timestamps: false,
    });
}
