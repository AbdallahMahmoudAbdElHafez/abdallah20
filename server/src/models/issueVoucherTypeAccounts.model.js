import { DataTypes } from "sequelize";

export default (sequelize) => {
    return sequelize.define(
        "IssueVoucherTypeAccount",
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },

            issue_voucher_type_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },

            account_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
        },
        {
            tableName: "issue_voucher_type_accounts",
            timestamps: false,
        }
    );
}
