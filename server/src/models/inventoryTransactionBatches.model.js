import { DataTypes } from "sequelize";

export default (sequelize) => {
    return sequelize.define('InventoryTransactionBatches', {
        id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
        inventory_transaction_id: { type: DataTypes.INTEGER, allowNull: false, references: { model: 'inventory_transactions', key: 'id' } },
        batch_id: { type: DataTypes.INTEGER, allowNull: false, references: { model: 'batches', key: 'id' } },
        quantity: { type: DataTypes.INTEGER, allowNull: false },
        cost_per_unit: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
    }, {
        tableName: 'inventory_transaction_batches',
        timestamps: false,
    });
}
