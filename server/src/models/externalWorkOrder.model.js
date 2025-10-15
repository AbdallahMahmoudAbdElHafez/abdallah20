import { DataTypes } from 'sequelize';

export default (sequelize) => {
  const ExternalWorkOrder = sequelize.define('ExternalWorkOrder', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    product_id: { type: DataTypes.INTEGER, allowNull: false },
    supplier_id: { type: DataTypes.INTEGER, allowNull: false },
    from_warehouse_id: { type: DataTypes.INTEGER, allowNull: false },
    to_warehouse_id: { type: DataTypes.INTEGER, allowNull: false },
    transfer_out_id: { type: DataTypes.INTEGER, allowNull: true },
    transfer_in_id: { type: DataTypes.INTEGER, allowNull: true },
    quantity_requested: { type: DataTypes.DECIMAL(15,3), allowNull: false },
    produced_quantity: { type: DataTypes.DECIMAL(15,3), allowNull: true },
    manufacturing_cost: { type: DataTypes.DECIMAL(15,2), allowNull: true },
    status: { 
      type: DataTypes.ENUM('جديد','تحت التشغيل','مستلم','ملغي'),
      defaultValue: 'جديد'
    },
    note: { type: DataTypes.TEXT, allowNull: true },
    is_closed: { type: DataTypes.BOOLEAN, defaultValue: false },
    created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    updated_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
  }, {
    tableName: 'external_work_orders',
    timestamps: false
  });

  return ExternalWorkOrder;
};
