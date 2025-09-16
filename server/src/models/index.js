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
import PurchaseInvoiceModel from './purchaseInvoice.model.js';
import PurchaseInvoiceItemModel from './purchaseInvoiceItem.model.js';
import InventoryTransactionModel from './inventoryTransaction.model.js';
import ReferenceTypeModel from './referenceType.model.js';
import JournalEntryModel from './journalEntry.model.js';
import JournalEntryLineModel from './journalEntryLine.model.js';
import AccountingSettingModel from './accountingSetting.model.js';
import purchaseOrderHooks from '../hooks/purchaseOrderHooks.js';
import purchaseInvoiceHooks from "../hooks/purchaseInvoiceHooks.js";

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
const PurchaseInvoice = PurchaseInvoiceModel(sequelize);
const PurchaseInvoiceItem = PurchaseInvoiceItemModel(sequelize);
const InventoryTransaction = InventoryTransactionModel(sequelize);
const ReferenceType = ReferenceTypeModel(sequelize);
const JournalEntry = JournalEntryModel(sequelize);
const JournalEntryLine = JournalEntryLineModel(sequelize);
const AccountingSetting = AccountingSettingModel(sequelize);

purchaseOrderHooks(sequelize);
purchaseInvoiceHooks(sequelize)

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
// PurchaseOrder - PurchaseOrderItem  relationship
PurchaseOrder.hasMany(PurchaseOrderItem, { foreignKey: "purchase_order_id", as: "items" });
PurchaseOrderItem.belongsTo(PurchaseOrder, { foreignKey: "purchase_order_id" });
// PurchaseOrderItem - Product relationship
Product.hasMany(PurchaseOrderItem, { foreignKey: "product_id" });
PurchaseOrderItem.belongsTo(Product, { foreignKey: "product_id" });

// purchaseorderitem - warehouse relationship
Warehouse.hasMany(PurchaseOrderItem, { foreignKey: "warehouse_id" });
PurchaseOrderItem.belongsTo(Warehouse, { foreignKey: "warehouse_id" });
// purchaseInvoiceitem - warehouse relationship
Warehouse.hasMany(PurchaseInvoiceItem, { foreignKey: "warehouse_id" });
PurchaseInvoiceItem.belongsTo(Warehouse, { foreignKey: "warehouse_id" });

//party - party category relationship
PartyCategory.hasMany(Party, { foreignKey: "category_id" });
Party.belongsTo(PartyCategory, { foreignKey: "category_id" });

//party - account  relationship
Account.hasMany(Party, { foreignKey: "account_id" })
Party.belongsTo(Account, { foreignKey: "account_id" })
//party - city  relationship
City.hasMany(Party, { foreignKey: "city_id" })
Party.belongsTo(City, { foreignKey: "city_id" })

// PurchaseInvoice ↔ Party (supplier)
Party.hasMany(PurchaseInvoice, {
  foreignKey: "supplier_id",
  as: "invoices",
});
PurchaseInvoice.belongsTo(Party, {
  foreignKey: "supplier_id",
  as: "supplier",
});

// PurchaseInvoice ↔ PurchaseOrder
PurchaseOrder.hasMany(PurchaseInvoice, {
  foreignKey: "purchase_order_id",
  as: "invoices",
});
PurchaseInvoice.belongsTo(PurchaseOrder, {
  foreignKey: "purchase_order_id",
  as: "purchase_order",
});

// ✅ PurchaseInvoice ↔ Items
PurchaseInvoice.hasMany(PurchaseInvoiceItem, {
  foreignKey: "purchase_invoice_id",
  as: "items",
});
PurchaseInvoiceItem.belongsTo(PurchaseInvoice, {
  foreignKey: "purchase_invoice_id",
  as: "invoice",
});

// ✅ Product ↔ PurchaseInvoiceItem
Product.hasMany(PurchaseInvoiceItem, {
  foreignKey: "product_id",
  as: "invoice_items",
});
PurchaseInvoiceItem.belongsTo(Product, {
  foreignKey: "product_id",
  as: "product",
});

InventoryTransaction.belongsTo(Product, {
  foreignKey: "product_id",
  as: "product",
});

InventoryTransaction.belongsTo(Warehouse, {
  foreignKey: "warehouse_id",
  as: "warehouse",
});


JournalEntry.belongsTo(ReferenceType, {
  foreignKey: 'reference_type_id'
});
JournalEntry.hasMany(JournalEntryLine, {
  foreignKey: 'journal_entry_id',
  as: 'lines'
});
Account.hasMany(AccountingSetting, {
  foreignKey: 'account_id',
});
JournalEntryLine.belongsTo(Account,{
  foreignKey: 'account_id',
})
JournalEntryLine.belongsTo(JournalEntry,{
  foreignKey:'journal_entry_id'
})
AccountingSetting.belongsTo(Account,{
  foreignKey: 'account_id',
})
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
  PartyCategory,
  PurchaseInvoice,
  PurchaseInvoiceItem,
  InventoryTransaction,
  JournalEntry,
  JournalEntryLine,
  ReferenceType,
  AccountingSetting

};
