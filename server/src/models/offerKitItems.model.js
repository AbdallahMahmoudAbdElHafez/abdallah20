import { DataTypes } from 'sequelize';

export default (sequelize) => {
    return sequelize.define('OfferKitItem', {
        id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        offer_kit_id: { type: DataTypes.INTEGER, allowNull: false, references: { model: 'offer_kits', key: 'id' } },
        product_id: { type: DataTypes.INTEGER, allowNull: false, references: { model: 'products', key: 'id' } },
        quantity: { type: DataTypes.DECIMAL(10, 2), allowNull: false, defaultValue: 1.00 },
        special_price: { type: DataTypes.DECIMAL(10, 2), allowNull: false, defaultValue: 0.00 }
    }, {
        tableName: 'offer_kit_items',
        timestamps: false
    });
};
