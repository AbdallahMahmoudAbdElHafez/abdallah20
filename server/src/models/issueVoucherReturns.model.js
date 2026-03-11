import { DataTypes } from 'sequelize';

const IssueVoucherReturnModel = (sequelize) => {
    const IssueVoucherReturn = sequelize.define('IssueVoucherReturn', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        return_no: {
            type: DataTypes.STRING(100),
            allowNull: false,
            unique: true
        },
        issue_voucher_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'issue_vouchers',
                key: 'id'
            }
        },
        warehouse_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'warehouses',
                key: 'id'
            }
        },
        return_date: {
            type: DataTypes.DATEONLY,
            allowNull: false
        },
        status: {
            type: DataTypes.ENUM('draft', 'approved', 'posted', 'cancelled'),
            allowNull: false,
            defaultValue: 'draft'
        },
        employee_id: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        approved_by: {
            type: DataTypes.INTEGER,
            allowNull: true
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
        tableName: 'issue_voucher_returns',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    });

    return IssueVoucherReturn;
};

export default IssueVoucherReturnModel;
