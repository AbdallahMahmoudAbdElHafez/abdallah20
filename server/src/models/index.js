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
import purchaseInvoicePaymentHooks from "../hooks/purchaseInvoicePaymentHooks.js";
import inventoryTransactionHooks from "../hooks/inventoryTransactionHooks.js";
import PurchaseInvoicePaymentModel from "./purchaseInvoicePayment.model.js";
import SupplierChequeModel from "./supplierCheque.model.js";
import ExpenseModel from "./expense.model.js";
import ExpenseCategoryModel from "./expenseCategory.model.js";
import BillOfMaterialModel from './billOfMaterial.model.js';
import WarehouseTransferModel from './warehouseTransfers.model.js';
import WarehouseTransferItemModel from "./warehouseTransferItems.model.js";
import ProductCostModel from './productCosts.model.js';
import ProcessModel from './processes.model.js';
import ExternalJobOrderModel from './externalJobOrders.model.js';
import CurrentInventoryModel from "./currentInventory.model.js";
import DepartmentModel from "./departments.model.js";
import jobTitleModel from "./jobTitles.model.js";
import employeeModel from "./employees.model.js";
import IssueVoucherTypesModel from "./issueVoucherTypes.model.js";
import IssueVoucherTypeAccountsModel from "./issueVoucherTypeAccounts.model.js";
import IssueVoucherModel from './issueVouchers.model.js';
import IssueVoucherItemModel from './issueVoucherItems.model.js';
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
const PurchaseInvoicePayment = PurchaseInvoicePaymentModel(sequelize);
const SupplierCheque = SupplierChequeModel(sequelize);
const Expense = ExpenseModel(sequelize);
const ExpenseCategory = ExpenseCategoryModel(sequelize);
const BillOfMaterial = BillOfMaterialModel(sequelize);
const WarehouseTransfer = WarehouseTransferModel(sequelize);
const WarehouseTransferItem = WarehouseTransferItemModel(sequelize);
const ProductCost = ProductCostModel(sequelize);
const Process = ProcessModel(sequelize);
const ExternalJobOrder = ExternalJobOrderModel(sequelize);
const CurrentInventory = CurrentInventoryModel(sequelize);
const Department = DepartmentModel(sequelize);
const JobTitle = jobTitleModel(sequelize);
const Employee = employeeModel(sequelize);
const IssueVoucherType = IssueVoucherTypesModel(sequelize);
const IssueVoucherTypeAccount = IssueVoucherTypeAccountsModel(sequelize);
const IssueVoucher = IssueVoucherModel(sequelize);
const IssueVoucherItem = IssueVoucherItemModel(sequelize);

purchaseOrderHooks(sequelize);
purchaseInvoiceHooks(sequelize);
purchaseInvoicePaymentHooks(sequelize)
InventoryTransaction.addHook("afterCreate", inventoryTransactionHooks.afterCreate);
InventoryTransaction.addHook("afterBulkCreate", inventoryTransactionHooks.afterBulkCreate);


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
PurchaseInvoice.hasMany(PurchaseInvoiceItem, { foreignKey: "purchase_invoice_id", as: "items", });
PurchaseInvoiceItem.belongsTo(PurchaseInvoice, { foreignKey: "purchase_invoice_id", as: "invoice", });

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

JournalEntryLine.belongsTo(Account, {
  foreignKey: 'account_id',
})
JournalEntryLine.belongsTo(JournalEntry, {
  foreignKey: 'journal_entry_id',
  as: 'journal_entry'
})

PurchaseInvoicePayment.belongsTo(PurchaseInvoice, {
  foreignKey: "purchase_invoice_id",
  as: "purchase_invoice",
});


PurchaseInvoicePayment.hasMany(SupplierCheque, {
  foreignKey: "purchase_payment_id",
  as: "cheques",
});
SupplierCheque.belongsTo(PurchaseInvoicePayment, {
  foreignKey: "purchase_payment_id",
  as: "payment",
});
// WarehouseTransfer ↔ Warehouse (من وإلى)
Warehouse.hasMany(WarehouseTransfer, {
  foreignKey: "from_warehouse_id",
  as: "transfers_from",
});
Warehouse.hasMany(WarehouseTransfer, {
  foreignKey: "to_warehouse_id",
  as: "transfers_to",
});

WarehouseTransfer.belongsTo(Warehouse, {
  foreignKey: "from_warehouse_id",
  as: "fromWarehouse",
});
WarehouseTransfer.belongsTo(Warehouse, {
  foreignKey: "to_warehouse_id",
  as: "toWarehouse",
});
WarehouseTransfer.hasMany(WarehouseTransferItem, {
  foreignKey: "transfer_id",
  as: "items",
});
WarehouseTransferItem.belongsTo(WarehouseTransfer, {
  foreignKey: "transfer_id",
  as: "transfer",
});

Product.hasMany(WarehouseTransferItem, {
  foreignKey: "product_id",
  as: "transfer_items",
});
WarehouseTransferItem.belongsTo(Product, {
  foreignKey: "product_id",
  as: "product",
});





Product.hasMany(ProductCost, {
  foreignKey: 'product_id',
  as: 'costs',
});

ProductCost.belongsTo(Product, {
  foreignKey: 'product_id',
  as: 'product',
});

ExternalJobOrder.belongsTo(Party, {
  foreignKey: 'party_id',
  as: 'party',
});

// ExternalJobOrder ↔ Product
ExternalJobOrder.belongsTo(Product, {
  foreignKey: 'product_id',
  as: 'product',
});



// ExternalJobOrder ↔ Process
ExternalJobOrder.belongsTo(Process, {
  foreignKey: 'process_id',
  as: 'process',
});

// ExternalJobOrder ↔ Warehouse
ExternalJobOrder.belongsTo(Warehouse, {
  foreignKey: 'warehouse_id',
  as: 'warehouse',
});
Employee.belongsTo(JobTitle, {
  foreignKey: "job_title_id",
  as: "job_title",
});

Employee.belongsTo(Department, {
  foreignKey: "department_id",
  as: "department",
});

Employee.belongsTo(Employee, { foreignKey: "parent_id", as: "parent_employee", });
Employee.hasMany(Employee, { foreignKey: "parent_id", as: "children", });

IssueVoucherType.hasMany(IssueVoucherTypeAccount, { foreignKey: "issue_voucher_type_id", as: "accounts", onDelete: "CASCADE", });
Account.hasMany(IssueVoucherTypeAccount, { foreignKey: "account_id", as: "voucher_types", onDelete: "CASCADE", });
IssueVoucherTypeAccount.belongsTo(IssueVoucherType, { foreignKey: "issue_voucher_type_id", as: "type", onDelete: "CASCADE", });
IssueVoucherTypeAccount.belongsTo(Account, {foreignKey: "account_id", as: "account", onDelete: "CASCADE",});
// === علاقات Issue Voucher ===

// IssueVoucher ↔ IssueVoucherType
IssueVoucherType.hasMany(IssueVoucher, {
  foreignKey: "type_id",
  as: "vouchers"
});
IssueVoucher.belongsTo(IssueVoucherType, {
  foreignKey: "type_id",
  as: "type"
});

// IssueVoucher ↔ Party
Party.hasMany(IssueVoucher, {
  foreignKey: "party_id",
  as: "issue_vouchers"
});
IssueVoucher.belongsTo(Party, {
  foreignKey: "party_id",
  as: "party"
});

// IssueVoucher ↔ Employee (موظف مسؤول عن الإصدار)
Employee.hasMany(IssueVoucher, {
  foreignKey: "employee_id",
  as: "responsible_vouchers"
});
IssueVoucher.belongsTo(Employee, {
  foreignKey: "employee_id",
  as: "responsible_employee"
});

// IssueVoucher ↔ Warehouse
Warehouse.hasMany(IssueVoucher, {
  foreignKey: "warehouse_id",
  as: "issue_vouchers"
});
IssueVoucher.belongsTo(Warehouse, {
  foreignKey: "warehouse_id",
  as: "warehouse"
});

// IssueVoucher ↔ Employee (issued_by - الذي أصدر السند)
Employee.hasMany(IssueVoucher, {
  foreignKey: "issued_by",
  as: "issued_vouchers"
});
IssueVoucher.belongsTo(Employee, {
  foreignKey: "issued_by",
  as: "issuer"
});

// IssueVoucher ↔ Employee (approved_by - الذي وافق على السند)
Employee.hasMany(IssueVoucher, {
  foreignKey: "approved_by",
  as: "approved_vouchers"
});
IssueVoucher.belongsTo(Employee, {
  foreignKey: "approved_by",
  as: "approver"
});
// العلاقات الجديدة
// IssueVoucher ↔ IssueVoucherItem
IssueVoucher.hasMany(IssueVoucherItem, {
  foreignKey: "voucher_id",
  as: "items",
  onDelete: "CASCADE"
});
IssueVoucherItem.belongsTo(IssueVoucher, {
  foreignKey: "voucher_id",
  as: "voucher"
});

// IssueVoucherItem ↔ Product
Product.hasMany(IssueVoucherItem, {
  foreignKey: "product_id",
  as: "issue_voucher_items"
});
IssueVoucherItem.belongsTo(Product, {
  foreignKey: "product_id",
  as: "product"
});

// IssueVoucherItem ↔ Warehouse
Warehouse.hasMany(IssueVoucherItem, {
  foreignKey: "warehouse_id",
  as: "issue_voucher_items"
});
IssueVoucherItem.belongsTo(Warehouse, {
  foreignKey: "warehouse_id",
  as: "warehouse"
});
Expense.belongsTo(Account, { foreignKey: "account_id" });
Expense.belongsTo(ExpenseCategory, { foreignKey: "category_id" });
ExpenseCategory.hasMany(Expense, { foreignKey: "category_id" });
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
  AccountingSetting,
  PurchaseInvoicePayment,
  SupplierCheque,
  Expense,
  ExpenseCategory,
  BillOfMaterial,
  WarehouseTransfer,
  WarehouseTransferItem,
  ProductCost,
  Process,
  ExternalJobOrder,
  CurrentInventory,
  Department,
  JobTitle,
  Employee,
  IssueVoucherType,
  IssueVoucherTypeAccount,
  IssueVoucher,
  IssueVoucherItem,


};
