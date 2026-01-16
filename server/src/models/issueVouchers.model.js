import { DataTypes } from 'sequelize';

const IssueVoucherModel = (sequelize) => {
  const IssueVoucher = sequelize.define('IssueVoucher', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    voucher_no: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true
    },
    party_id: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    sales_return_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'sales_returns',
        key: 'id'
      }
    },
    employee_id: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    doctor_id: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    warehouse_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    issued_by: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    approved_by: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    status: {
      type: DataTypes.ENUM('draft', 'approved', 'posted', 'cancelled'),
      allowNull: false,
      defaultValue: 'draft'
    },
    issue_date: {
      type: DataTypes.DATEONLY,
      allowNull: false
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
    },
    account_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    issue_type: {
      type: DataTypes.ENUM('internal', 'replacement', 'damage', 'other'),
      allowNull: false,
      defaultValue: 'internal'
    }
  }, {
    tableName: 'issue_vouchers',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  return IssueVoucher;
};

export default IssueVoucherModel;