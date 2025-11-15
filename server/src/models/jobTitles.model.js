import { DataTypes } from "sequelize";

export default (sequelize) => {
    return sequelize.define(
        "JobTitle",
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            title_name: {
                type: DataTypes.STRING(100),
                allowNull: false,
            },
        },
        {
            tableName: "job_titles",
            timestamps: false,
        }
    );
}


