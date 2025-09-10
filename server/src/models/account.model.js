import { DataTypes } from "sequelize";

export default (sequelize) => {
    return sequelize.define('Account', {
        id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        name: { type: DataTypes.STRING(150), allowNull: false },
        account_type: { type: DataTypes.ENUM('asset', 'liability', 'equity', 'revenue', 'expense'), allowNull: false },
        parent_account_id: { type: DataTypes.INTEGER, allowNull: true },
        opening_balance: { type: DataTypes.DECIMAL(15, 2), defaultValue: 0.0 },
        note: { type: DataTypes.TEXT, allowNull: true },
    }, {
        tableName: 'accounts',
        timestamps: false
    });
}



