import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import Dashboard from "./pages/Dashboard";
import UnitsPage from "./pages/UnitsPage";
import Sidebar from "./components/Sidebar";
import ProductsPage from "./pages/ProductsPage";
import CountriesPage from "./pages/CountryPage";
import GovernatesPage from "./pages/GovernatePage";
import CitiesPage from "./pages/CitiesPage";
import WarehousesPage from "./pages/WarehousesPage";
import AccountsPage from "./pages/AccountsPage";
import PartyCategoriesPage from "./pages/PartyCategoriesPage";
import PartiesPage from "./pages/PartiesPage";
import PurchaseOrdersPage from "./pages/PurchaseOrdersPage";
import PurchaseInvoicesPage from "./pages/PurchaseInvoicesPage";
import InventoryTransactionsPage from './pages/InventoryTransactionsPage'
import { JournalEntryLinesTable } from "./components/JournalEntryLinesTable";
import SupplierChequesPage from "./pages/SupplierChequesPage";
import PurchasePaymentsPage from "./pages/PurchasePaymentsPage";
import AccountingSettingsPage from "./pages/AccountingSettingsPage";
import SupplierStatementPage from "./pages/SupplierStatementPage";
import ExpenseCategoryPage from "./pages/ExpenseCategoryPage";
import BillOfMaterialsPage from "./pages/BillOfMaterialsPage";
import { Box } from "@mui/material";
import WarehouseTransfersPage from "./pages/WarehouseTransfersPage";
import ProcessesPage from "./pages/processesPage";
import ExternalJobOrdersPage from "./pages/externalJobOrdersPage";
import CurrentInventoryPage from "./pages/CurrentInventoryPage";
import DepartmentsPage from "./pages/DepartmentsPage";
import JobTitlesPage from "./pages/JobTitlesPage";
import EmployeesPage from "./pages/EmployeesPage";
import IssueVouchersPage from "./pages/issueVouchersPage";
import PurchaseReturnsPage from "./pages/purchaseReturnsPage";
import ExpensesPage from "./pages/ExpensesPage";
import SalesOrdersPage from "./pages/salesOrdersPage";
import SalesInvoicesPage from "./pages/salesInvoicesPage";
import SalesInvoicePaymentsPage from "./pages/salesInvoicePaymentsPage";
import CustomerStatementPage from "./pages/CustomerStatementPage";
import SalesReturnsPage from "./pages/salesReturnsPage";
import CompaniesPage from "./pages/CompaniesPage";
import ReportsPage from "./pages/ReportsPage";
import ReportsDashboard from "./pages/ReportsDashboard";
import SalesReportPage from "./pages/SalesReportPage";
import PurchasesReportPage from "./pages/PurchasesReportPage";
import ExpensesReportPage from "./pages/ExpensesReportPage";
import JobOrdersReportPage from "./pages/JobOrdersReportPage";
import WarehouseReportPage from "./pages/WarehouseReportPage";
import IssueVouchersReportPage from "./pages/IssueVouchersReportPage";
import OpeningSalesReportPage from "./pages/OpeningSalesReportPage";
import ServicePaymentsPage from "./pages/servicePaymentsPage";
import DoctorsPage from "./pages/DoctorsPage";
import InventoryAdjustmentPage from "./pages/InventoryAdjustmentPage";

const drawerWidth = 240;

export default function App() {
  return (
    <BrowserRouter>
      <Sidebar />
      <Box sx={{ mr: `${drawerWidth}px` }}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/units" element={<UnitsPage />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/countries" element={<CountriesPage />} />
          <Route path="/governates" element={<GovernatesPage />} />
          <Route path="/cities" element={<CitiesPage />} />
          <Route path="/warehouses" element={<WarehousesPage />} />
          <Route path="/accounts" element={<AccountsPage />} />
          <Route path="/party-categories" element={<PartyCategoriesPage />} />
          <Route path="/parties" element={<PartiesPage />} />
          <Route path="/purchase-orders" element={<PurchaseOrdersPage />} />
          <Route path="/purchase-invoices" element={<PurchaseInvoicesPage />} />
          <Route path="/inventory-transactions" element={<InventoryTransactionsPage />} />
          <Route path="/journal-entry-lines" element={<JournalEntryLinesTable></JournalEntryLinesTable>} />
          <Route path="/supplier-cheques" element={<SupplierChequesPage />} />
          <Route path="/purchase-payments" element={<PurchasePaymentsPage />} />
          <Route path="/accounting-settings" element={<AccountingSettingsPage />} />
          <Route path="/suppliers/statement" element={<SupplierStatementPage />} />
          <Route path="/suppliers/:supplierId/statement" element={<SupplierStatementPage />} />
          <Route path="/expense-categories" element={<ExpenseCategoryPage />} />
          <Route path="/bill-of-material" element={<BillOfMaterialsPage />} />
          <Route path="/warehouse-transfers" element={<WarehouseTransfersPage />} />
          <Route path="/processes" element={<ProcessesPage />} />
          <Route path="/external-job-orders" element={<ExternalJobOrdersPage />} />
          <Route path="/current-inventory" element={<CurrentInventoryPage />} />
          <Route path="/departments" element={<DepartmentsPage />} />
          <Route path="/job-titles" element={<JobTitlesPage />} />
          <Route path="/employees" element={<EmployeesPage />} />
          <Route path="/issue-vouchers" element={<IssueVouchersPage />} />
          <Route path="/purchase-returns" element={<PurchaseReturnsPage />} />
          <Route path="/expenses" element={<ExpensesPage />} />
          <Route path="/sales-orders" element={<SalesOrdersPage />} />
          <Route path="/sales-invoices" element={<SalesInvoicesPage />} />
          <Route path="/sales-invoice-payments" element={<SalesInvoicePaymentsPage />} />
          <Route path="/customers/statement" element={<CustomerStatementPage />} />
          <Route path="/customers/:customerId/statement" element={<CustomerStatementPage />} />
          <Route path="/sales-returns" element={<SalesReturnsPage />} />
          <Route path="/companies" element={<CompaniesPage />} />
          <Route path="/reports" element={<ReportsPage />} />
          <Route path="/reports-dashboard" element={<ReportsDashboard />} />
          <Route path="/reports/sales" element={<SalesReportPage />} />
          <Route path="/reports/purchases" element={<PurchasesReportPage />} />
          <Route path="/reports/expenses" element={<ExpensesReportPage />} />
          <Route path="/reports/job-orders" element={<JobOrdersReportPage />} />
          <Route path="/reports/warehouse" element={<WarehouseReportPage />} />
          <Route path="/reports/issue-vouchers" element={<IssueVouchersReportPage />} />
          <Route path="/reports/opening-sales" element={<OpeningSalesReportPage />} />
          <Route path="/service-payments" element={<ServicePaymentsPage />} />
          <Route path="/doctors" element={<DoctorsPage />} />
          <Route path="/inventory-adjustment" element={<InventoryAdjustmentPage />} />
        </Routes>
      </Box>
    </BrowserRouter>
  );
}
