
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
import PurchaseReturnModel from "./purchaseReturns.model.js";
import PurchaseReturnItemModel from "./purchaseReturnItems.model.js";
import SalesReturnModel from "./salesReturns.model.js";
import SalesReturnItemModel from "./salesReturnItems.model.js";
import SalesOrderModel from "./salesOrders.model.js";
import SalesOrderItemModel from "./salesOrderItems.model.js";
import SalesInvoiceModel from "./salesInvoices.model.js";
import SalesInvoiceItemModel from "./salesInvoiceItems.model.js";
import BatchesModel from "./batches.model.js";
import InventoryTransactionBatchesModel from "./inventoryTransactionBatches.model.js";
import SalesInvoicePaymentModel from "./salesInvoicePayments.model.js";
import EntryTypeModel from "./entryTypes.model.js";
import JobOrderCostModel from "./jobOrderCosts.model.js";
import JournalEntryLineModel from "./journalEntryLine.model.js";
import AccountingSettingModel from "./accountingSetting.model.js";
import PurchaseInvoicePaymentModel from "./purchaseInvoicePayment.model.js";
import SupplierChequeModel from "./supplierCheque.model.js";
import ExpenseModel from "./expenses.model.js";
import ExpenseCategoryModel from "./expenseCategory.model.js";
import BillOfMaterialModel from './billOfMaterial.model.js';
import purchaseOrderHooks from '../hooks/purchaseOrderHooks.js';
import purchaseInvoiceHooks from "../hooks/purchaseInvoiceHooks.js";
import purchaseInvoicePaymentHooks from "../hooks/purchaseInvoicePaymentHooks.js";
import salesInvoicePaymentHooks from "../hooks/salesInvoicePaymentHooks.js";
import salesInvoiceHooks from "../hooks/salesInvoiceHooks.js";
import salesReturnsHooks from "../hooks/salesReturnsHooks.js";
import purchaseReturnsHooks from "../hooks/purchaseReturnsHooks.js";
import externalJobOrderHooks from "../hooks/externalJobOrderHooks.js";
import expensesHooks from "../hooks/expensesHooks.js";

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
const PurchaseReturn = PurchaseReturnModel(sequelize);
const PurchaseReturnItem = PurchaseReturnItemModel(sequelize);
const SalesReturn = SalesReturnModel(sequelize);
const SalesReturnItem = SalesReturnItemModel(sequelize);
const SalesOrder = SalesOrderModel(sequelize);
const SalesOrderItem = SalesOrderItemModel(sequelize);
const SalesInvoice = SalesInvoiceModel(sequelize);
const SalesInvoiceItem = SalesInvoiceItemModel(sequelize);
const Batches = BatchesModel(sequelize);
const InventoryTransactionBatches = InventoryTransactionBatchesModel(sequelize);
const SalesInvoicePayment = SalesInvoicePaymentModel(sequelize);
const EntryType = EntryTypeModel(sequelize);
const JobOrderCost = JobOrderCostModel(sequelize);

purchaseOrderHooks(sequelize);
purchaseInvoiceHooks(sequelize);
purchaseInvoicePaymentHooks(sequelize);
salesInvoicePaymentHooks(sequelize);
salesInvoiceHooks(sequelize);
salesReturnsHooks(sequelize);
purchaseReturnsHooks(sequelize);
externalJobOrderHooks(sequelize);
expensesHooks(sequelize);



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
JournalEntry.belongsTo(EntryType, {
  foreignKey: 'entry_type_id',
  as: 'entry_type'
});
EntryType.hasMany(JournalEntry, {
  foreignKey: 'entry_type_id',
  as: 'journal_entries'
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

// ExternalJobOrder ↔ JobOrderCost
ExternalJobOrder.hasMany(JobOrderCost, {
  foreignKey: 'job_order_id',
  as: 'costs',
  onDelete: 'CASCADE',
});
JobOrderCost.belongsTo(ExternalJobOrder, {
  foreignKey: 'job_order_id',
  as: 'job_order',
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
IssueVoucherTypeAccount.belongsTo(Account, { foreignKey: "account_id", as: "account", onDelete: "CASCADE", });
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

// === PurchaseInvoice ↔ PurchaseReturn ===
PurchaseInvoice.hasMany(PurchaseReturn, {
  foreignKey: "purchase_invoice_id",
  as: "returns",
  onDelete: "RESTRICT"
});
PurchaseReturn.belongsTo(PurchaseInvoice, {
  foreignKey: "purchase_invoice_id",
  as: "invoice",
  onDelete: "RESTRICT"
});

PurchaseReturn.belongsTo(Party, {
  foreignKey: "supplier_id",
  as: "supplier"
});

PurchaseReturn.belongsTo(Warehouse, {
  foreignKey: "warehouse_id",
  as: "warehouse"
});

// === PurchaseReturn ↔ PurchaseReturnItem ===
PurchaseReturn.hasMany(PurchaseReturnItem, {
  foreignKey: "purchase_return_id",
  as: "items",
  onDelete: "CASCADE"
});
PurchaseReturnItem.belongsTo(PurchaseReturn, {
  foreignKey: "purchase_return_id",
  as: "purchase_return"
});

// === PurchaseReturnItem ↔ PurchaseInvoiceItem ===
PurchaseInvoiceItem.hasMany(PurchaseReturnItem, {
  foreignKey: "purchase_invoice_item_id",
  as: "return_items"
});
PurchaseReturnItem.belongsTo(PurchaseInvoiceItem, {
  foreignKey: "purchase_invoice_item_id",
  as: "invoice_item",
  onDelete: "SET NULL",
  onUpdate: "CASCADE"
});

// === PurchaseReturnItem ↔ Product ===
Product.hasMany(PurchaseReturnItem, {
  foreignKey: "product_id",
  as: "return_items"
});
PurchaseReturnItem.belongsTo(Product, {
  foreignKey: "product_id",
  as: "product"
});

// === SalesInvoice ↔ SalesReturn ===
SalesInvoice.hasMany(SalesReturn, {
  foreignKey: "sales_invoice_id",
  as: "returns",
  onDelete: "RESTRICT"
});
SalesReturn.belongsTo(SalesInvoice, {
  foreignKey: "sales_invoice_id",
  as: "invoice",
  onDelete: "RESTRICT"
});

SalesReturn.belongsTo(Party, {
  foreignKey: "sales_invoice_id",
  as: "customer",
  through: SalesInvoice
});

SalesReturn.belongsTo(Warehouse, {
  foreignKey: "warehouse_id",
  as: "warehouse"
});

// === SalesReturn ↔ SalesReturnItem ===
SalesReturn.hasMany(SalesReturnItem, {
  foreignKey: "sales_return_id",
  as: "items",
  onDelete: "CASCADE"
});
SalesReturnItem.belongsTo(SalesReturn, {
  foreignKey: "sales_return_id",
  as: "sales_return"
});

// === SalesReturnItem ↔ Product ===
Product.hasMany(SalesReturnItem, {
  foreignKey: "product_id",
  as: "sales_return_items"
});
SalesReturnItem.belongsTo(Product, {
  foreignKey: "product_id",
  as: "product"
});


// === Sales Order Associations ===
SalesOrder.belongsTo(Party, { foreignKey: "party_id", as: "party" });
Party.hasMany(SalesOrder, { foreignKey: "party_id", as: "sales_orders" });

SalesOrder.belongsTo(Warehouse, { foreignKey: "warehouse_id", as: "warehouse" });
Warehouse.hasMany(SalesOrder, { foreignKey: "warehouse_id", as: "sales_orders" });

SalesOrder.belongsTo(Employee, { foreignKey: "employee_id", as: "employee" });
Employee.hasMany(SalesOrder, { foreignKey: "employee_id", as: "sales_orders" });

SalesOrder.hasMany(SalesOrderItem, { foreignKey: "sales_order_id", as: "items", onDelete: "CASCADE" });
SalesOrderItem.belongsTo(SalesOrder, { foreignKey: "sales_order_id", as: "sales_order" });

SalesOrderItem.belongsTo(Product, { foreignKey: "product_id", as: "product" });
Product.hasMany(SalesOrderItem, { foreignKey: "product_id", as: "sales_order_items" });

SalesOrderItem.belongsTo(Warehouse, { foreignKey: "warehouse_id", as: "warehouse" });
Warehouse.hasMany(SalesOrderItem, { foreignKey: "warehouse_id", as: "sales_order_items" });

// === Sales Invoice Associations ===
SalesInvoice.belongsTo(Party, { foreignKey: "party_id", as: "party" });
Party.hasMany(SalesInvoice, { foreignKey: "party_id", as: "sales_invoices" });

SalesInvoice.belongsTo(Warehouse, { foreignKey: "warehouse_id", as: "warehouse" });
Warehouse.hasMany(SalesInvoice, { foreignKey: "warehouse_id", as: "sales_invoices" });

SalesInvoice.belongsTo(Employee, { foreignKey: "employee_id", as: "employee" });
Employee.hasMany(SalesInvoice, { foreignKey: "employee_id", as: "sales_invoices" });

SalesInvoice.belongsTo(SalesOrder, { foreignKey: "sales_order_id", as: "sales_order" });
SalesOrder.hasMany(SalesInvoice, { foreignKey: "sales_order_id", as: "invoices" });

SalesInvoice.hasMany(SalesInvoiceItem, { foreignKey: "sales_invoice_id", as: "items", onDelete: "CASCADE" });
SalesInvoiceItem.belongsTo(SalesInvoice, { foreignKey: "sales_invoice_id", as: "sales_invoice" });

SalesInvoiceItem.belongsTo(Product, { foreignKey: "product_id", as: "product" });
Product.hasMany(SalesInvoiceItem, { foreignKey: "product_id", as: "sales_invoice_items" });

// SalesInvoiceItem ↔ Warehouse
SalesInvoiceItem.belongsTo(Warehouse, { foreignKey: "warehouse_id", as: "warehouse" });
Warehouse.hasMany(SalesInvoiceItem, { foreignKey: "warehouse_id", as: "sales_invoice_items" });

// SalesInvoicePayment Associations
SalesInvoicePayment.belongsTo(SalesInvoice, { foreignKey: "sales_invoice_id", as: "sales_invoice" });
SalesInvoice.hasMany(SalesInvoicePayment, { foreignKey: "sales_invoice_id", as: "payments" });

SalesInvoicePayment.belongsTo(Account, { foreignKey: "account_id", as: "account" });
Account.hasMany(SalesInvoicePayment, { foreignKey: "account_id", as: "sales_invoice_payments" });

// Batches Associations
Product.hasMany(Batches, { foreignKey: "product_id", as: "batches" });
Batches.belongsTo(Product, { foreignKey: "product_id", as: "product" });

// Inventory Transaction Batches Associations
InventoryTransaction.hasMany(InventoryTransactionBatches, { foreignKey: "inventory_transaction_id", as: "transaction_batches" });
InventoryTransactionBatches.belongsTo(InventoryTransaction, { foreignKey: "inventory_transaction_id", as: "transaction" });

Batches.hasMany(InventoryTransactionBatches, { foreignKey: "batch_id", as: "transaction_batches" });
InventoryTransactionBatches.belongsTo(Batches, { foreignKey: "batch_id", as: "batch" });

// Current Inventory Associations
CurrentInventory.belongsTo(Product, { foreignKey: "product_id", as: "product" });
CurrentInventory.belongsTo(Warehouse, { foreignKey: "warehouse_id", as: "warehouse" });

// BillOfMaterial Associations
BillOfMaterial.belongsTo(Product, { foreignKey: "product_id", as: "product" });
BillOfMaterial.belongsTo(Product, { foreignKey: "material_id", as: "material" });
Product.hasMany(BillOfMaterial, { foreignKey: "product_id", as: "bill_of_materials" });
Product.hasMany(BillOfMaterial, { foreignKey: "material_id", as: "material_usages" });



// Expense Associations
Expense.belongsTo(Account, { as: 'debitAccount', foreignKey: 'debit_account_id' });
Expense.belongsTo(Account, { as: 'creditAccount', foreignKey: 'credit_account_id' });
Expense.belongsTo(City, { foreignKey: 'city_id', as: 'city' });
Expense.belongsTo(Employee, { foreignKey: 'employee_id', as: 'employee' });
Expense.belongsTo(Party, { foreignKey: 'party_id', as: 'party' });

Account.hasMany(Expense, { foreignKey: 'debit_account_id', as: 'debitExpenses' });
Account.hasMany(Expense, { foreignKey: 'credit_account_id', as: 'creditExpenses' });
City.hasMany(Expense, { foreignKey: 'city_id', as: 'expenses' });
Employee.hasMany(Expense, { foreignKey: 'employee_id', as: 'expenses' });
Party.hasMany(Expense, { foreignKey: 'party_id', as: 'partyExpenses' });

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
  PurchaseReturn,
  PurchaseReturnItem,
  SalesReturn,
  SalesReturnItem,
  SalesOrder,
  SalesOrderItem,
  SalesInvoice,
  SalesInvoiceItem,
  Batches,
  InventoryTransactionBatches,
  SalesInvoicePayment,
  EntryType,
  JobOrderCost,

};
