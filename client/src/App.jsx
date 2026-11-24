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
import { AppBar, Box, IconButton, Toolbar, Typography } from "@mui/material";
import { Menu as MenuIcon, Note as NoteIcon } from "@mui/icons-material";
import WarehouseTransfersPage from "./pages/WarehouseTransfersPage";
import ProcessesPage from "./pages/processesPage";
import ExternalJobOrdersPage from "./pages/externalJobOrdersPage";
import CurrentInventoryPage from "./pages/CurrentInventoryPage";
import DepartmentsPage from "./pages/DepartmentsPage";
import JobTitlesPage from "./pages/JobTitlesPage";
import EmployeesPage from "./pages/EmployeesPage";
import IssueVouchersPage from "./pages/issueVouchersPage";
import IssueVoucherReturnsPage from "./pages/IssueVoucherReturnsPage";
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
import JournalExpensesReportPage from "./pages/JournalExpensesReportPage";
import JobOrdersReportPage from "./pages/JobOrdersReportPage";
import WarehouseReportPage from "./pages/WarehouseReportPage";
import ProductAverageCostReportPage from "./pages/ProductAverageCostReportPage";
import IssueVouchersReportPage from "./pages/IssueVouchersReportPage";
import OpeningSalesReportPage from "./pages/OpeningSalesReportPage";
import ZakatReportPage from "./pages/ZakatReportPage";
import ServicePaymentsPage from "./pages/servicePaymentsPage";
import DoctorsPage from "./pages/DoctorsPage";
import InventoryAdjustmentPage from "./pages/InventoryAdjustmentPage";
import CustomerReceivablesReportPage from "./pages/CustomerReceivablesReportPage";
import BatchCustomerStatementsPage from "./pages/BatchCustomerStatementsPage";
import ProfitReportPage from "./pages/ProfitReportPage";
import FinancialAnalysisPage from "./pages/FinancialAnalysisPage";
import BankAndCashBalancesPage from "./pages/BankAndCashBalancesPage";
import SafeMovementsReportPage from "./pages/SafeMovementsReportPage";
import ExternalServiceInvoicesPage from "./pages/ExternalServiceInvoicesPage";
import ServiceTypesPage from "./pages/ServiceTypesPage";
import GeneralLedgerReport from "./pages/GeneralLedgerReport";
import CrossRegionReportPage from "./pages/CrossRegionReportPage";
import AssetsReportPage from "./pages/AssetsReportPage";
import DetailedCustomerStatementPage from "./pages/DetailedCustomerStatementPage";
import SalesAnalysisPage from "./pages/SalesAnalysisPage";
import UnbalancedJournalEntriesPage from "./pages/UnbalancedJournalEntriesPage";
import OfferKitsPage from "./pages/OfferKitsPage";
import DraggableNotes from "./components/DraggableNotes";
import MobileBottomNav from "./components/MobileBottomNav";
import { useState, useEffect } from "react";

const drawerWidth = 240;

export default function App() {
  const [showNotes, setShowNotes] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  // Open notes after a short delay on desktop only (avoid blocking mobile screen on load)
  useEffect(() => {
    if (window.innerWidth < 900) return;
    const timer = setTimeout(() => {
      setShowNotes(true);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <BrowserRouter>
      {/* Mobile Top Bar */}
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          display: { xs: "block", md: "none" },
          background: "linear-gradient(135deg, #1e1b4b 0%, #1d4ed8 100%)",
          boxShadow: "0 4px 20px rgba(30, 27, 75, 0.22)",
          zIndex: (theme) => theme.zIndex.drawer + 1,
        }}
      >
        <Toolbar sx={{ minHeight: 58, px: 1.5, justifyContent: "space-between" }}>
          <IconButton
            color="inherit"
            edge="start"
            onClick={() => setMobileOpen(true)}
            aria-label="فتح القائمة"
            sx={{ bgcolor: "rgba(255,255,255,0.12)", borderRadius: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography
            variant="subtitle1"
            sx={{ fontWeight: 800, fontSize: "1.05rem", color: "#fff", letterSpacing: 0.2 }}
          >
            نظام إدارة الحسابات
          </Typography>
          <IconButton
            color="inherit"
            edge="end"
            onClick={() => setShowNotes((prev) => !prev)}
            aria-label="الملاحظات"
            sx={{ bgcolor: "rgba(255,255,255,0.12)", borderRadius: 2 }}
          >
            <NoteIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      <Sidebar
        mobileOpen={mobileOpen}
        onMobileClose={() => setMobileOpen(false)}
        onToggleNotes={() => setShowNotes((prev) => !prev)}
      />

      <Box
        component="main"
        sx={{
          mr: { xs: 0, md: `${drawerWidth}px` },
          width: { xs: "100%", md: `calc(100% - ${drawerWidth}px)` },
          minHeight: "100dvh",
          maxWidth: "100%",
          overflowX: "clip",
          pb: { xs: 10, md: 0 },
          boxSizing: "border-box",
        }}
      >
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
          <Route path="/issue-voucher-returns" element={<IssueVoucherReturnsPage />} />
          <Route path="/purchase-returns" element={<PurchaseReturnsPage />} />
          <Route path="/expenses" element={<ExpensesPage />} />
          <Route path="/sales-orders" element={<SalesOrdersPage />} />
          <Route path="/sales-invoices" element={<SalesInvoicesPage />} />
          <Route path="/sales-invoice-payments" element={<SalesInvoicePaymentsPage />} />
          <Route path="/customers/statement" element={<CustomerStatementPage />} />
          <Route path="/customers/:customerId/statement" element={<CustomerStatementPage />} />
          <Route path="/customers/statement-detailed" element={<DetailedCustomerStatementPage />} />
          <Route path="/customers/:customerId/statement-detailed" element={<DetailedCustomerStatementPage />} />
          <Route path="/sales-returns" element={<SalesReturnsPage />} />
          <Route path="/companies" element={<CompaniesPage />} />
          <Route path="/reports" element={<ReportsPage />} />
          <Route path="/reports-dashboard" element={<ReportsDashboard />} />
          <Route path="/reports/financial-analysis" element={<FinancialAnalysisPage />} />
          <Route path="/reports/sales-analysis" element={<SalesAnalysisPage />} />
          <Route path="/reports/sales" element={<SalesReportPage />} />
          <Route path="/reports/purchases" element={<PurchasesReportPage />} />
          <Route path="/reports/expenses" element={<ExpensesReportPage />} />
          <Route path="/reports/journal-expenses" element={<JournalExpensesReportPage />} />
          <Route path="/reports/unbalanced-journal-entries" element={<UnbalancedJournalEntriesPage />} />
          <Route path="/reports/job-orders" element={<JobOrdersReportPage />} />
          <Route path="/reports/warehouse" element={<WarehouseReportPage />} />
          <Route path="/reports/product-average-cost" element={<ProductAverageCostReportPage />} />
          <Route path="/reports/issue-vouchers" element={<IssueVouchersReportPage />} />
          <Route path="/reports/opening-sales" element={<OpeningSalesReportPage />} />
          <Route path="/reports/zakat" element={<ZakatReportPage />} />
          <Route path="/reports/customer-receivables" element={<CustomerReceivablesReportPage />} />
            <Route path="/reports/batch-customer-statements" element={<BatchCustomerStatementsPage />} />
          <Route path="/reports/profit" element={<ProfitReportPage />} />
          <Route path="/reports/bank-cash" element={<BankAndCashBalancesPage />} />
          <Route path="/reports/assets" element={<AssetsReportPage />} />
          <Route path="/reports/safe-movements" element={<SafeMovementsReportPage />} />
          <Route path="/reports/general-ledger" element={<GeneralLedgerReport />} />
          <Route path="/reports/cross-region" element={<CrossRegionReportPage />} />
          <Route path="/service-payments" element={<ServicePaymentsPage />} />
          <Route path="/doctors" element={<DoctorsPage />} />
          <Route path="/inventory-adjustment" element={<InventoryAdjustmentPage />} />
          <Route path="/external-service-invoices" element={<ExternalServiceInvoicesPage />} />
          <Route path="/service-types" element={<ServiceTypesPage />} />
          <Route path="/offer-kits" element={<OfferKitsPage />} />
        </Routes>
      </Box>
      <MobileBottomNav onOpenMenu={() => setMobileOpen(true)} />
      {showNotes && <DraggableNotes onClose={() => setShowNotes(false)} />}
    </BrowserRouter>
  );
}
