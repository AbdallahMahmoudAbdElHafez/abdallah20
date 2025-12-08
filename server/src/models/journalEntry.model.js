import { DataTypes } from "sequelize";

export default (sequelize) => {
    return sequelize.define('JournalEntry', {
        entry_date: { type: DataTypes.DATEONLY, defaultValue: DataTypes.NOW, allowNull: false },
        description: { type: DataTypes.STRING(255), allowNull: true },
        reference_type_id: { type: DataTypes.INTEGER, allowNull: false },
        reference_id: { type: DataTypes.INTEGER, allowNull: true },
        entry_type_id: { type: DataTypes.INTEGER, allowNull: false }
    }, {
        tableName: 'journal_entries',
        underscored: true,
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    });
};