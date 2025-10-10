import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Menu,
  MenuItem,
  Divider,
} from "@mui/material";
import { Link, useLocation } from "react-router-dom";
import { useState } from "react";

const navItems = [
  { label: "الرئيسية", path: "/" },
  { label: "لوحة التحكم", path: "/dashboard" },
  { label: "الوحدات", path: "/units" },
  { label: "المنتجات", path: "/products" },
  { label: "الدول", path: "/countries" },
  { label: "المخازن", path: "/warehouses" },
  { label: "الحسابات", path: "/accounts" },
  { label: "فئات العملاء/الموردين", path: "/party-categories" },
  { label: "العملاء الموردين", path: "/parties" },
  { label: "حركة المخازن", path: "/inventory-transactions" },
  { label: "القيود", path: "/journal-entry-lines" },
  { label: "مدفوعات", path: "/purchase-payments" },
  { label: "اوراق قبض", path: "/supplier-cheques" },
  { label: "فئات المصروفات", path: "/expense-categories" },
  { label: "اضافة الحسابات", path: "/accounting-settings" },
  { label: "كشف حساب المورد", path: "/suppliers/:supplierId/statement" },
];

const purchasesMenu = [
  { label: "أوامر الشراء", path: "/purchase-orders" },
  { label: "فواتير الشراء", path: "/purchase-invoices" },
  { divider: true },
  { label: "مدفوعات", path: "/purchase-payments" },
  { label: "أوراق قبض", path: "/supplier-cheques" },
];

function Navbar() {
  const location = useLocation();
  const [anchorEl, setAnchorEl] = useState(null);

  const handleOpen = (e) => setAnchorEl(e.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const isActive = (path) => location.pathname === path;

  return (
    <AppBar position="static" sx={{ bgcolor: "#1a237e" }}>
      <Toolbar sx={{ flexDirection: "row-reverse" }}>
        <Typography variant="h6" sx={{ flexGrow: 1, textAlign: "right" }}>
          نظام إدارة الحسابات
        </Typography>

        {/* المشتريات */}
        <Box>
          <Button
            color={
              purchasesMenu.some((item) => isActive(item.path))
                ? "secondary"
                : "inherit"
            }
            onClick={handleOpen}
            sx={{ ml: 1 }}
          >
            المشتريات
          </Button>

          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleClose}
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            transformOrigin={{ vertical: "top", horizontal: "right" }}
            PaperProps={{
              sx: {
                borderRadius: 2,
                mt: 1,
                minWidth: 200,
                bgcolor: "#fafafa",
                "& .MuiMenuItem-root": {
                  fontSize: "0.95rem",
                  px: 2,
                  py: 1,
                  transition: "all 0.2s ease-in-out",
                  "&:hover": {
                    bgcolor: "#3949ab",
                    color: "white",
                    transform: "translateX(-4px)",
                  },
                },
              },
            }}
          >
            {purchasesMenu.map((item, i) =>
              item.divider ? (
                <Divider key={i} />
              ) : (
                <MenuItem
                  key={item.path}
                  component={Link}
                  to={item.path}
                  onClick={handleClose}
                >
                  {item.label}
                </MenuItem>
              )
            )}
          </Menu>
        </Box>

        {/* باقي الروابط */}
        <Box sx={{ display: "flex", flexDirection: "row-reverse" }}>
          {navItems.map((item) => (
            <Button
              key={item.path}
              component={Link}
              to={item.path}
              color={isActive(item.path) ? "secondary" : "inherit"}
              sx={{
                ml: 1,
                fontWeight: isActive(item.path) ? "bold" : "normal",
              }}
            >
              {item.label}
            </Button>
          ))}
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;
