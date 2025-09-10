import { DataTypes } from "sequelize";




export default (sequelize) => { 
    return sequelize.define('Product', {
        id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true
        },
        name: { type: DataTypes.STRING(150), allowNull: false },
        price: { type: DataTypes.DECIMAL(10, 2), allowNull: false },


        cost_price: { type: DataTypes.DECIMAL(10, 2), defaultValue: 0.0 },
        unit_id: { type: DataTypes.INTEGER, allowNull: true, references: { model: 'units', key: 'id' } },
        created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    }, {
        tableName: 'products',  
        timestamps: false
    });
}




