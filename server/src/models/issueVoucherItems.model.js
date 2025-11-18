import { DataTypes } from 'sequelize';

const IssueVoucherItemModel = (sequelize) => {
  const IssueVoucherItem = sequelize.define('IssueVoucherItem', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    voucher_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    product_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    warehouse_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    batch_number: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    expiry_date: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    quantity: {
      type: DataTypes.DECIMAL(12, 3),
      allowNull: false
    },
    unit_price: {
      type: DataTypes.DECIMAL(12, 2),
      defaultValue: 0.00
    },
    cost_per_unit: {
      type: DataTypes.DECIMAL(12, 2),
      defaultValue: 0.00
    },
    note: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
    updated_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  }, {
    tableName: 'issue_voucher_items',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  return IssueVoucherItem;
};

export default IssueVoucherItemModel;