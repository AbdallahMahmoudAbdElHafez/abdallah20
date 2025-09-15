// server/src/models/purchaseOrder.model.js
import { DataTypes } from 'sequelize';

export default (sequelize) => {
  const PurchaseOrder = sequelize.define('PurchaseOrder', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    supplier_id: { type: DataTypes.INTEGER, allowNull: false },
    order_number: { type: DataTypes.STRING(100), allowNull: true },
    order_date: { type: DataTypes.DATEONLY, allowNull: false },
    status: {
      type: DataTypes.ENUM('draft', 'approved', 'closed', 'cancelled'),
      defaultValue: 'draft'
    },
    subtotal: { type: DataTypes.DECIMAL(18, 2), defaultValue: 0.0 },
    additional_discount: { type: DataTypes.DECIMAL(18, 2), defaultValue: 0.0 },
    vat_rate: { type: DataTypes.DECIMAL(5, 2), defaultValue: 0.0 },
    vat_amount: { type: DataTypes.DECIMAL(18, 2), defaultValue: 0.0 },
    tax_rate: { type: DataTypes.DECIMAL(5, 2), defaultValue: 0.0 },
    tax_amount: { type: DataTypes.DECIMAL(18, 2), defaultValue: 0.0 },
    total_amount: { type: DataTypes.DECIMAL(18, 2), defaultValue: 0.0 },
    created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    updated_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  }, {
    tableName: 'purchase_orders',
    timestamps: false,
    indexes: [
      {
        unique: true,
        name: 'uq_po_supplier_number',
        fields: ['supplier_id', 'order_number']
      },
      {
        unique: true,
        name: 'uq_po_number',
        fields: ['order_number']
      },
      {
        name: 'idx_po_supplier',
        fields: ['supplier_id']
      },
      {
        name: 'idx_po_order_date',
        fields: ['order_date']
      }
    ]
  });



  return PurchaseOrder;
};
