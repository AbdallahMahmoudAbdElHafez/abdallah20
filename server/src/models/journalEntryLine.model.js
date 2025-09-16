import { DataTypes } from "sequelize";

export default (sequelize) => {
    return sequelize.define('JournalEntryLine', {
        journal_entry_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: { model: "journal_entries", key: "id" },
        },
        account_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: { model: "accounts", key: "id" },
        },
        debit: {
            type: DataTypes.DECIMAL(15, 2),
            defaultValue: 0.00,
            validate: { min: 0 }
        },
        credit: {
            type: DataTypes.DECIMAL(15, 2),
            defaultValue: 0.00,
            validate: { min: 0 }
        },
        description: DataTypes.STRING,
    }, {
        tableName: 'journal_entry_lines',
        underscored: true,
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
    });
};
