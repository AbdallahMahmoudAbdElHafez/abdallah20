import {
  Drawer,
  List,
  ListItemButton,
  ListItemText,
  Collapse,
  Toolbar,
  Typography,
  Box,
  Divider,
} from "@mui/material";
import { ExpandLess, ExpandMore } from "@mui/icons-material";
import { Link, useLocation } from "react-router-dom";
import { useState } from "react";

const drawerWidth = 240;

const navItems = [
  { label: "الرئيسية", path: "/" },
  { label: "لوحة التحكم", path: "/dashboard" },
  { label: "الوحدات", path: "/units" },
 
  { label: "الدول", path: "/countries" },
  { label: "اوامر التشغيل ", path: "/external-job-orders" },

  { label: "الحسابات", path: "/accounts" },
  { label: "فئات العملاء/الموردين", path: "/party-categories" },
  { label: "العملاء الموردين", path: "/parties" },
  { label: "العمليات", path: "/processes" },
  { label: "القيود", path: "/journal-entry-lines" },
  { label: "فئات المصروفات", path: "/expense-categories" },
  { label: "اضافة الحسابات", path: "/accounting-settings" },
  { label: "مكونات التصنيع", path: "/bill-of-material" },
  { label: "كشف حساب المورد", path: "/suppliers/:supplierId/statement" },
];
const productsMenu = [
   { label: "المنتجات", path: "/products" },
  { label: "تكلفة المنتجات", path: "/product-costs" },
  

];
const companyInfoMenu = [
   { label: "الاقسام", path: "/departments" },
  { label: "المسميات الوظيفيه", path: "/job-titles" },
  { label: "الموظفين", path: "/employees" },
  

];
const purchasesMenu = [
  { label: "أوامر الشراء", path: "/purchase-orders" },
  { label: "فواتير الشراء", path: "/purchase-invoices" },
  { label: "مدفوعات", path: "/purchase-payments" },
  { label: "أوراق قبض", path: "/supplier-cheques" },
];
const warehousesMenu = [
 { label: "حركة المخازن", path: "/inventory-transactions" },
 { label: "ارصدة المخازن", path: "/current-inventory" },
  { label: "دليل المخازن", path: "/warehouses" },
  { label: "التحويل من مخزن الى مخزن", path: "/warehouse-transfers" },
  { label: "انواع سندات الصرف", path: "/issue-voucher-types" },
  { label: "اذونات الصرف", path: "/issue-vouchers" },
];
function Sidebar() {
  const location = useLocation();
  const [openPurchases, setOpenPurchases] = useState(false);
  const [openWarehouses, setOpenWarehouses] = useState(false);
    const [openCompanyInfo, setOpenCompanyInfo] = useState(false);

  const toggleCompanyInfo = () => setOpenCompanyInfo(!openCompanyInfo);
  const toggleWarehouses = () => setOpenWarehouses(!openWarehouses);

  const togglePurchases = () => setOpenPurchases(!openPurchases);
  const isActive = (path) => location.pathname === path;

  return (
    <Drawer
      variant="permanent"
      anchor="right"
      sx={{
        width: drawerWidth,
        "& .MuiDrawer-paper": {
          width: drawerWidth,
          boxSizing: "border-box",
          bgcolor: "#1a237e",
          color: "white",
          direction: "rtl",
        },
      }}
    >
      <Toolbar>
        <Typography variant="h6" sx={{ fontWeight: "bold", mx: "auto" }}>
          نظام إدارة الحسابات
        </Typography>
      </Toolbar>
      <Divider sx={{ bgcolor: "rgba(255,255,255,0.2)" }} />
      <List>
           {/* بيانات الشركه */}
        <ListItemButton onClick={toggleCompanyInfo}>
          <ListItemText primary="بيانات الشركه" />
          {openCompanyInfo ? <ExpandLess /> : <ExpandMore />}
        </ListItemButton>
        <Collapse in={openCompanyInfo} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            {companyInfoMenu.map((item) => (
              <ListItemButton
                key={item.path}
                component={Link}
                to={item.path}
                sx={{
                  pl: 4,
                  bgcolor: isActive(item.path)
                    ? "rgba(255,255,255,0.1)"
                    : "transparent",
                  "&:hover": { bgcolor: "rgba(255,255,255,0.2)" },
                }}
              >
                <ListItemText primary={item.label} />
              </ListItemButton>
            ))}
          </List>
        </Collapse>
          {/* اداراة المنتجات */}
        <ListItemButton onClick={togglePurchases}>
          <ListItemText primary="ادارة المنتجات" />
          {openPurchases ? <ExpandLess /> : <ExpandMore />}
        </ListItemButton>
        <Collapse in={openPurchases} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            {productsMenu.map((item) => (
              <ListItemButton
                key={item.path}
                component={Link}
                to={item.path}
                sx={{
                  pl: 4,
                  bgcolor: isActive(item.path)
                    ? "rgba(255,255,255,0.1)"
                    : "transparent",
                  "&:hover": { bgcolor: "rgba(255,255,255,0.2)" },
                }}
              >
                <ListItemText primary={item.label} />
              </ListItemButton>
            ))}
          </List>
        </Collapse>
        {/* المشتريات */}
        <ListItemButton onClick={togglePurchases}>
          <ListItemText primary="المشتريات" />
          {openPurchases ? <ExpandLess /> : <ExpandMore />}
        </ListItemButton>
        <Collapse in={openPurchases} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            {purchasesMenu.map((item) => (
              <ListItemButton
                key={item.path}
                component={Link}
                to={item.path}
                sx={{
                  pl: 4,
                  bgcolor: isActive(item.path)
                    ? "rgba(255,255,255,0.1)"
                    : "transparent",
                  "&:hover": { bgcolor: "rgba(255,255,255,0.2)" },
                }}
              >
                <ListItemText primary={item.label} />
              </ListItemButton>
            ))}
          </List>
        </Collapse>
  {/* المخازن */}
        <ListItemButton onClick={toggleWarehouses}>
          <ListItemText primary="المخازن" />
          {openWarehouses ? <ExpandLess /> : <ExpandMore />}
        </ListItemButton>
        <Collapse in={openWarehouses} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            {warehousesMenu.map((item) => (
              <ListItemButton
                key={item.path}
                component={Link}
                to={item.path}
                sx={{
                  pl: 4,
                  bgcolor: isActive(item.path)
                    ? "rgba(255,255,255,0.1)"
                    : "transparent",
                  "&:hover": { bgcolor: "rgba(255,255,255,0.2)" },
                }}
              >
                <ListItemText primary={item.label} />
              </ListItemButton>
            ))}
          </List>
        </Collapse>
        <Divider sx={{ my: 1, bgcolor: "rgba(255,255,255,0.2)" }} />

        {/* باقي الروابط */}
        {navItems.map((item) => (
          <ListItemButton
            key={item.path}
            component={Link}
            to={item.path}
            sx={{
              bgcolor: isActive(item.path)
                ? "rgba(255,255,255,0.1)"
                : "transparent",
              "&:hover": { bgcolor: "rgba(255,255,255,0.2)" },
            }}
          >
            <ListItemText primary={item.label} />
          </ListItemButton>
        ))}
      </List>
    </Drawer>
  );
}

export default Sidebar;
