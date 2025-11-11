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
        <Route path="/products" element={<ProductsPage />} />"
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
        <Route path="/suppliers/:supplierId/statement" element={<SupplierStatementPage />} />
        <Route path="/expense-categories" element={<ExpenseCategoryPage />} />
        <Route path="/bill-of-material" element={<BillOfMaterialsPage/>} />
         <Route path="/warehouse-transfers" element={<WarehouseTransfersPage/>} />
         <Route path="/processes" element={<ProcessesPage />} />
         <Route path="/external-job-orders" element={<ExternalJobOrdersPage />} />
    <Route path="/current-inventory" element={<CurrentInventoryPage />} />
      </Routes>
      </Box>
    
    </BrowserRouter>
  );
}
