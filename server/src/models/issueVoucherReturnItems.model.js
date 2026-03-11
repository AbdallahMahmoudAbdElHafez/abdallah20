import { DataTypes } from 'sequelize';

const IssueVoucherReturnItemModel = (sequelize) => {
    const IssueVoucherReturnItem = sequelize.define('IssueVoucherReturnItem', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        return_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'issue_voucher_returns',
                key: 'id'
            }
        },
        product_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'products',
                key: 'id'
            }
        },
        batch_number: {
            type: DataTypes.STRING(100),
            allowNull: true
        },
        expiry_date: {
            type: DataTypes.DATEONLY,
            allowNull: true
        },
        returned_quantity: {
            type: DataTypes.DECIMAL(12, 3),
            allowNull: false,
            defaultValue: 0.000
        },
        quantity: {
            type: DataTypes.DECIMAL(12, 3),
            allowNull: false
        },
        cost_per_unit: {
            type: DataTypes.DECIMAL(12, 2),
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
        tableName: 'issue_voucher_return_items',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    });

    return IssueVoucherReturnItem;
};

export default IssueVoucherReturnItemModel;
