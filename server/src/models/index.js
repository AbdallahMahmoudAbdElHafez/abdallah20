// server/src/models/index.js
import { Sequelize } from 'sequelize';
import { env } from '../config/env.js';
import ProductModel from './product.model.js';
import UnitModel from './unit.model.js';
import CountryModel from './country.model.js';
import GovernateModel from './governate.model.js';
import CityModel from './city.model.js';
import warehouseModel from './warehouse.model.js';
import AccountModel from './account.model.js';
import PurchaseOrderModel from './purchaseOrder.model.js';
import PurchaseOrderItemModel from './purchaseOrderItem.model.js';
import PartyModel from './party.model.js';
import partyCategoryModel from './partyCategory.model.js';


const sequelize = new Sequelize(env.db.name, env.db.user, env.db.pass, {
  host: env.db.host,
  port: env.db.port,
  dialect: 'mysql',
  logging: false,
});

// تعريف الموديلات
const Product = ProductModel(sequelize);
const Unit = UnitModel(sequelize);
const Country = CountryModel(sequelize);
const Governate = GovernateModel(sequelize);
const City = CityModel(sequelize);
const Warehouse = warehouseModel(sequelize);
const Account = AccountModel(sequelize);
const Party = PartyModel(sequelize);
const PartyCategory = partyCategoryModel(sequelize);
const PurchaseOrder = PurchaseOrderModel(sequelize);
const PurchaseOrderItem = PurchaseOrderItemModel(sequelize);


// العلاقات
// Product - Unit relationship
Unit.hasMany(Product, { foreignKey: 'unit_id', as: 'products' });
Product.belongsTo(Unit, { foreignKey: 'unit_id', as: 'unit' });
// Country - Governate relationship
Country.hasMany(Governate, { foreignKey: "country_id", as: "governates" });
Governate.belongsTo(Country, { foreignKey: "country_id", as: "country" });

//Governate - City relationship
Governate.hasMany(City, { foreignKey: "governate_id", as: "cities" });
City.belongsTo(Governate, { foreignKey: "governate_id", as: "governate" });

// City - Warehouse relationship
City.hasMany(Warehouse, { foreignKey: "city_id", as: "warehouses" });
Warehouse.belongsTo(City, { foreignKey: "city_id", as: "city" });

// Account - self relationship
Account.belongsTo(Account, { as: "parent", foreignKey: "parent_account_id" });
Account.hasMany(Account, { as: "children", foreignKey: "parent_account_id" });

// PurchaseOrder  -party relationship
Party.hasMany(PurchaseOrder, { foreignKey: "supplier_id" });
PurchaseOrder.belongsTo(Party, { foreignKey: "supplier_id" });
// PurchaseOrder - PurchaseOrderItem - Product relationship
PurchaseOrder.hasMany(PurchaseOrderItem, { foreignKey: "purchase_order_id", as: "items" });
PurchaseOrderItem.belongsTo(PurchaseOrder, { foreignKey: "purchase_order_id" });
Product.hasMany(PurchaseOrderItem, { foreignKey: "product_id" });
PurchaseOrderItem.belongsTo(Product, { foreignKey: "product_id" });


//party - party category relationship
PartyCategory.hasMany(Party, { foreignKey: "category_id" });
Party.belongsTo(PartyCategory, { foreignKey: "category_id" });

//party - account  relationship
Account.hasMany(Party, { foreignKey: "account_id" })
Party.belongsTo(Account, { foreignKey: "account_id" })
//party - city  relationship
City.hasMany(Party, { foreignKey: "city_id" })
Party.belongsTo(City, { foreignKey: "city_id" })



export {
  sequelize,
  Product,
  Unit,
  Country,
  Governate,
  City,
  Warehouse,
  Account,
  PurchaseOrder,
  PurchaseOrderItem,
  Party,
  PartyCategory
};
