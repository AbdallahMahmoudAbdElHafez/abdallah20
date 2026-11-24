import {
  Drawer,
  List,
  ListItemButton,
  ListItemText,
  Collapse,
  Toolbar,
  Typography,
  Divider,
  IconButton,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import {
  ExpandLess,
  ExpandMore,
  Note as NoteIcon,
  Close as CloseIcon,
} from "@mui/icons-material";
import { Link, useLocation } from "react-router-dom";
import { useState } from "react";

export const drawerWidth = 240;

const navItems = [
  { label: "الرئيسية", path: "/" },
  { label: "لوحة التحكم", path: "/dashboard" },
  { label: "الوحدات", path: "/units" },
  { label: "الدول", path: "/countries" },
  { label: "المصروفات", path: "/expenses" },
  { label: "الحسابات", path: "/accounts" },
  { label: "فئات العملاء/الموردين", path: "/party-categories" },
  { label: "العملاء الموردين", path: "/parties" },
  { label: "العمليات", path: "/processes" },
  { label: "فئات المصروفات", path: "/expense-categories" },
  { label: "مكونات التصنيع", path: "/bill-of-material" },
  { label: "الأطباء", path: "/doctors" },
];

const productsMenu = [
  { label: "المنتجات", path: "/products" },
  { label: "تكلفة المنتجات", path: "/product-costs" },
  { label: "متوسط تكلفة الوحدة", path: "/reports/product-average-cost" },
];

const companyInfoMenu = [
  { label: "الشركات", path: "/companies" },
  { label: "الاقسام", path: "/departments" },
  { label: "المسميات الوظيفيه", path: "/job-titles" },
  { label: "الموظفين", path: "/employees" },
];

const purchasesMenu = [
  { label: "أوامر الشراء", path: "/purchase-orders" },
  { label: "فواتير الشراء", path: "/purchase-invoices" },
  { label: "مدفوعات", path: "/purchase-payments" },
  { label: "أوراق قبض", path: "/supplier-cheques" },
  { label: "مرتجعات", path: "/purchase-returns" },
];

const manufacturingMenu = [
  { label: "أوامر التشغيل", path: "/external-job-orders" },
  { label: "فواتير الخدمات", path: "/external-service-invoices" },
  { label: "أنواع الخدمات", path: "/service-types" },
  { label: "مدفوعات خدمية", path: "/service-payments" },
];

const salesMenu = [
  { label: "أوامر البيع", path: "/sales-orders" },
  { label: "فواتير البيع", path: "/sales-invoices" },
  { label: "المقبوضات", path: "/sales-invoice-payments" },
  { label: "مرتجعات", path: "/sales-returns" },
  { label: "العروض الترويجية", path: "/offer-kits" },
];

const warehousesMenu = [
  { label: "حركة المخازن", path: "/inventory-transactions" },
  { label: "ارصدة المخازن", path: "/current-inventory" },
  { label: "متوسط تكلفة الوحدة", path: "/reports/product-average-cost" },
  { label: "تقرير المخازن", path: "/reports/warehouse" },
  { label: "دليل المخازن", path: "/warehouses" },
  { label: "التحويل من مخزن الى مخزن", path: "/warehouse-transfers" },
  { label: "اذونات الصرف", path: "/issue-vouchers" },
  { label: "مرتجعات اذون الصرف", path: "/issue-voucher-returns" },
  { label: "تسوية جرد", path: "/inventory-adjustment" },
];

const reportsMenu = [
  { label: "إعداد التقارير", path: "/reports-dashboard" },
  { label: "التحليل المالي الذكي", path: "/reports/financial-analysis" },
  { label: "متوسط تكلفة الوحدة", path: "/reports/product-average-cost" },
  { label: "تقرير المخازن", path: "/reports/warehouse" },
  { label: "كشف حساب المورد", path: "/suppliers/statement" },
  { label: "كشف حساب العميل", path: "/customers/statement" },
  { label: "تحليل المبيعات", path: "/reports/sales-analysis" },
  { label: "القيود", path: "/journal-entry-lines" },
  { label: "ملخص التقارير", path: "/reports" },
  { label: "تقرير مستحقات العملاء", path: "/reports/customer-receivables" },
  { label: "أرصدة البنوك والصناديق", path: "/reports/bank-cash" },
  { label: "كشف حركة الصندوق/البنك", path: "/reports/safe-movements" },
];

function Sidebar({ onToggleNotes, mobileOpen = false, onMobileClose }) {
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const [openProducts, setOpenProducts] = useState(false);
  const [openPurchases, setOpenPurchases] = useState(false);
  const [openWarehouses, setOpenWarehouses] = useState(false);
  const [openCompanyInfo, setOpenCompanyInfo] = useState(false);
  const [openSales, setOpenSales] = useState(false);
  const [openManufacturing, setOpenManufacturing] = useState(false);
  const [openReports, setOpenReports] = useState(false);

  const isActive = (path) => location.pathname === path;

  const handleNavClick = () => {
    if (isMobile && onMobileClose) {
      onMobileClose();
    }
  };

  const renderSubMenu = (items) => (
    <List component="div" disablePadding>
      {items.map((item) => (
        <ListItemButton
          key={`${item.path}-${item.label}`}
          component={Link}
          to={item.path}
          onClick={handleNavClick}
          sx={{
            pr: 4,
            bgcolor: isActive(item.path)
              ? "rgba(255,255,255,0.16)"
              : "transparent",
            "&:hover": { bgcolor: "rgba(255,255,255,0.2)" },
          }}
        >
          <ListItemText primary={item.label} />
        </ListItemButton>
      ))}
    </List>
  );

  const drawerContent = (
    <>
      <Toolbar sx={{ display: "flex", justifyContent: "space-between", px: 2 }}>
        <Typography
          variant="h6"
          sx={{ fontWeight: "bold", mx: isMobile ? 0 : "auto", fontSize: "1.05rem" }}
        >
          نظام إدارة الحسابات
        </Typography>
        {isMobile && (
          <IconButton
            color="inherit"
            edge="end"
            onClick={onMobileClose}
            aria-label="إغلاق القائمة"
          >
            <CloseIcon />
          </IconButton>
        )}
      </Toolbar>
      <Divider sx={{ bgcolor: "rgba(255,255,255,0.2)" }} />
      <List sx={{ overflowY: "auto", pb: 4 }}>
        {/* بيانات الشركه */}
        <ListItemButton onClick={() => setOpenCompanyInfo(!openCompanyInfo)}>
          <ListItemText primary="بيانات الشركه" />
          {openCompanyInfo ? <ExpandLess /> : <ExpandMore />}
        </ListItemButton>
        <Collapse in={openCompanyInfo} timeout="auto" unmountOnExit>
          {renderSubMenu(companyInfoMenu)}
        </Collapse>

        {/* ادارة المنتجات */}
        <ListItemButton onClick={() => setOpenProducts(!openProducts)}>
          <ListItemText primary="ادارة المنتجات" />
          {openProducts ? <ExpandLess /> : <ExpandMore />}
        </ListItemButton>
        <Collapse in={openProducts} timeout="auto" unmountOnExit>
          {renderSubMenu(productsMenu)}
        </Collapse>

        {/* المشتريات */}
        <ListItemButton onClick={() => setOpenPurchases(!openPurchases)}>
          <ListItemText primary="المشتريات" />
          {openPurchases ? <ExpandLess /> : <ExpandMore />}
        </ListItemButton>
        <Collapse in={openPurchases} timeout="auto" unmountOnExit>
          {renderSubMenu(purchasesMenu)}
        </Collapse>

        {/* التصنيع */}
        <ListItemButton onClick={() => setOpenManufacturing(!openManufacturing)}>
          <ListItemText primary="التصنيع" />
          {openManufacturing ? <ExpandLess /> : <ExpandMore />}
        </ListItemButton>
        <Collapse in={openManufacturing} timeout="auto" unmountOnExit>
          {renderSubMenu(manufacturingMenu)}
        </Collapse>

        {/* المبيعات */}
        <ListItemButton onClick={() => setOpenSales(!openSales)}>
          <ListItemText primary="المبيعات" />
          {openSales ? <ExpandLess /> : <ExpandMore />}
        </ListItemButton>
        <Collapse in={openSales} timeout="auto" unmountOnExit>
          {renderSubMenu(salesMenu)}
        </Collapse>

        {/* المخازن */}
        <ListItemButton onClick={() => setOpenWarehouses(!openWarehouses)}>
          <ListItemText primary="المخازن" />
          {openWarehouses ? <ExpandLess /> : <ExpandMore />}
        </ListItemButton>
        <Collapse in={openWarehouses} timeout="auto" unmountOnExit>
          {renderSubMenu(warehousesMenu)}
        </Collapse>

        {/* التقارير */}
        <ListItemButton onClick={() => setOpenReports(!openReports)}>
          <ListItemText primary="التقارير" />
          {openReports ? <ExpandLess /> : <ExpandMore />}
        </ListItemButton>
        <Collapse in={openReports} timeout="auto" unmountOnExit>
          {renderSubMenu(reportsMenu)}
        </Collapse>

        <Divider sx={{ my: 1, bgcolor: "rgba(255,255,255,0.2)" }} />

        {/* باقي الروابط */}
        {navItems.map((item) => (
          <ListItemButton
            key={item.path}
            component={Link}
            to={item.path}
            onClick={handleNavClick}
            sx={{
              bgcolor: isActive(item.path)
                ? "rgba(255,255,255,0.16)"
                : "transparent",
              "&:hover": { bgcolor: "rgba(255,255,255,0.2)" },
            }}
          >
            <ListItemText primary={item.label} />
          </ListItemButton>
        ))}

        <Divider sx={{ my: 1, bgcolor: "rgba(255,255,255,0.2)" }} />

        <ListItemButton
          onClick={() => {
            onToggleNotes?.();
            handleNavClick();
          }}
          sx={{ "&:hover": { bgcolor: "rgba(255,255,255,0.2)" } }}
        >
          <NoteIcon sx={{ ml: 1 }} />
          <ListItemText primary="الملاحظات" />
        </ListItemButton>
      </List>
    </>
  );

  const paperStyles = {
    width: drawerWidth,
    maxWidth: "82vw",
    boxSizing: "border-box",
    background: "linear-gradient(180deg, #1e1b4b 0%, #1e3a8a 100%)",
    color: "white",
    direction: "rtl",
    borderRadius: 0,
    boxShadow: "0 12px 32px rgba(15, 23, 42, 0.28)",
  };

  return (
    <>
      {isMobile ? (
        <Drawer
          variant="temporary"
          anchor="right"
          open={mobileOpen}
          onClose={onMobileClose}
          ModalProps={{ keepMounted: true }}
          sx={{
            "& .MuiDrawer-paper": paperStyles,
          }}
        >
          {drawerContent}
        </Drawer>
      ) : (
        <Drawer
          variant="permanent"
          anchor="right"
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            "& .MuiDrawer-paper": paperStyles,
          }}
        >
          {drawerContent}
        </Drawer>
      )}
    </>
  );
}

export default Sidebar;
