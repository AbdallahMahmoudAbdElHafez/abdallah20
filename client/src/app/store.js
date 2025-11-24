
import { configureStore } from "@reduxjs/toolkit";
import unitsReducer from "../features/units/unitsSlice";
import productsReducer from "../features/products/productsSlice";
import countriesReducer from "../features/countries/countriesSlice";
import governatesReducer from '../features/governates/governatesSlice';
import citiesReducer from '../features/cities/citiesSlice';
import warehousesReducer from "../features/warehouses/warehousesSlice";
import accountsReducer from "../features/accounts/accountsSlice";
import PartyCategoriesreducer from "../features/partyCategories/partyCategoriesSlice";
import PartiesReducer from "../features/parties/partiesSlice"
import PurchaseOrdersreducer from "../features/purchaseOrders/purchaseOrdersSlice"
import purchaseOrderItemsReducer from '../features/purchaseOrderItems/purchaseOrderItemsSlice'
import purchaseInvoicesReducer from '../features/purchaseInvoices/purchaseInvoicesSlice'
import purchaseInvoiceItemsReducer from '../features/purchaseInvoiceItems/purchaseInvoiceItemsSlice'
import inventoryTransactionsReducer from '../features/inventoryTransactions/inventoryTransactionsSlice'
import journalEntryLinesReducer from "../features/journalEntryLines/journalEntryLinesSlice";
import purchasePaymentsReducer from '../features/purchasePayments/purchasePaymentsSlice'
import supplierChequesReducer from '../features/supplierCheques/supplierChequesSlice'
import accountingSettingsReducer from "../features/accountingSettings/accountingSettingsSlice";
import expenseCategoryReducer from "../features/expenseCategories/expenseCategoriesSlice";
import billOfMaterialsReducer from "../features/billOfMaterials/billOfMaterialsSlice";
import warehouseTransfersReducer from "../features/warehouseTransfers/warehouseTransfersSlice";
import productCostsReducer from "../features/productCosts/productCostsSlice";
import processesReducer from "../features/processes/processesSlice";
import externalJobOrdersReducer from "../features/externalJobOrders/externalJobOrdersSlice";
import currentInventoryReducer from "../features/currentInventory/currentInventorySlice";
import DepartmentsReducer from "../features/departments/departmentsSlice";
import jobTitlesReducer from "../features/jobTitles/jobTitlesSlice";
import employeesReducer from "../features/employees/employeesSlice";
import issueVoucherTypesReducer from "../features/issueVoucherTypes/issueVoucherTypesSlice";
import issueVoucherTypeAccountsReducer from "../features/issueVoucherTypeAccounts/issueVoucherTypeAccountsSlice";
import issueVouchersReducer from "../features/issueVouchers/issueVouchersSlice";
import purchaseReturnsReducer from "../features/purchaseReturns/purchaseReturnsSlice";
import expensesReducer from "../features/expenses/expensesSlice";
import salesOrdersReducer from "../features/salesOrders/salesOrdersSlice";
import salesOrderItemsReducer from "../features/salesOrderItems/salesOrderItemsSlice";
export const store = configureStore({
  reducer: {
    units: unitsReducer,
    products: productsReducer,
    countries: countriesReducer,
    governates: governatesReducer,
    cities: citiesReducer,
    warehouses: warehousesReducer,
    accounts: accountsReducer,
    partyCategories: PartyCategoriesreducer,
    parties: PartiesReducer,
    purchaseOrders: PurchaseOrdersreducer,
    purchaseOrderItems: purchaseOrderItemsReducer,
    purchaseInvoices: purchaseInvoicesReducer,
    purchaseInvoiceItems: purchaseInvoiceItemsReducer,
    inventoryTransactions: inventoryTransactionsReducer,
    journalEntryLines: journalEntryLinesReducer,
    purchasePayments: purchasePaymentsReducer,
    supplierCheques: supplierChequesReducer,
    accountingSettings: accountingSettingsReducer,
    expenseCategories: expenseCategoryReducer,
    billOfMaterials: billOfMaterialsReducer,
    warehouseTransfers: warehouseTransfersReducer,
    productCosts: productCostsReducer,
    processes: processesReducer,
    externalJobOrders: externalJobOrdersReducer,
    currentInventory: currentInventoryReducer,
    departments: DepartmentsReducer,
    jobTitles: jobTitlesReducer,
    employees: employeesReducer,
    issueVoucherTypes: issueVoucherTypesReducer,
    issueVoucherTypeAccounts: issueVoucherTypeAccountsReducer,
    issueVouchers: issueVouchersReducer,
    purchaseReturns: purchaseReturnsReducer,
    expenses: expensesReducer,
    salesOrders: salesOrdersReducer,
    salesOrderItems: salesOrderItemsReducer,
  },
});