import { DataTypes } from 'sequelize';

export default (sequelize) => {
    const Company = sequelize.define('Company', {
        id: {
            type: DataTypes.INTEGER.UNSIGNED,
            autoIncrement: true,
            primaryKey: true,
        },
        company_name: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        company_name_en: {
            type: DataTypes.STRING(255),
            allowNull: true,
        },
        commercial_register: {
            type: DataTypes.STRING(50),
            allowNull: true,
        },
        tax_number: {
            type: DataTypes.STRING(50),
            allowNull: true,
        },
        vat_number: {
            type: DataTypes.STRING(50),
            allowNull: true,
        },
        company_type: {
            type: DataTypes.ENUM('تجارية', 'صناعية', 'خدمية', 'حكومية'),
            allowNull: false,
        },
        phone: {
            type: DataTypes.STRING(20),
            allowNull: true,
        },
        email: {
            type: DataTypes.STRING(100),
            allowNull: true,
        },
        website: {
            type: DataTypes.STRING(100),
            allowNull: true,
        },
        logo_path: {
            type: DataTypes.STRING(255),
            allowNull: true,
        },
        address: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        city_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        established_date: {
            type: DataTypes.DATEONLY,
            allowNull: true,
        },
        is_active: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
        },
    }, {
        tableName: 'companies',
        timestamps: true,
        underscored: true,
    });

    return Company;
};
