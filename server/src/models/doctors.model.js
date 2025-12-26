import { DataTypes } from "sequelize";

export default (sequelize) =>
    sequelize.define(
        "Doctor",
        {
            name: {
                type: DataTypes.STRING(150),
                allowNull: false,
            },
            phone: {
                type: DataTypes.STRING(20),
                allowNull: true,
            },
            email: {
                type: DataTypes.STRING(150),
                allowNull: true,
            },
            city_id: {
                type: DataTypes.INTEGER,
                allowNull: true,
                references: { model: "cities", key: "id" },
            },
            address: {
                type: DataTypes.STRING(255),
                allowNull: true,
            },
        },
        {
            tableName: "doctors",
            underscored: true,
            timestamps: true,
        }
    );
