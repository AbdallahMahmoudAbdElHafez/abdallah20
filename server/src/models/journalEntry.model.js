import { DataTypes } from "sequelize";

export default (sequelize) => {
    return sequelize.define('JournalEntry', {
        entry_date: { type: DataTypes.DATEONLY, defaultValue: DataTypes.NOW, allowNull: false },
        description: DataTypes.STRING,
        reference_type_id: { type: DataTypes.INTEGER, allowNull: false },
        reference_id: { type: DataTypes.INTEGER, allowNull: true } // <- هنا
    }, {
        tableName: 'journal_entries',
        underscored: true,
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    });
};