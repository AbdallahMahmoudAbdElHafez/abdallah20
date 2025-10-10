import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Menu,
  MenuItem,
  Divider
} from "@mui/material";
import { Link, useLocation } from "react-router-dom";
import { useState } from "react";

function Navbar() {
  const location = useLocation();
  const [anchorEl, setAnchorEl] = useState(null);

  const handleOpen = (e) => setAnchorEl(e.currentTarget);
  const handleClose = () => setAnchorEl(null);

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
    { label: "كشف حساب المورد", path: "/suppliers/:supplierId/statement" }
  ];

  return (
    <AppBar position="static" sx={{ bgcolor: "#1a237e" }}>
      <Toolbar sx={{ flexDirection: "row-reverse" }}>
        {/* عنوان السيستم */}
        <Typography variant="h6" sx={{ flexGrow: 1, textAlign: "right" }}>
          نظام إدارة الحسابات
        </Typography>

        {/* زر المشتريات مع القائمة */}
        <Box>
          <Button
            color={
              ["/purchase-orders", "/purchase-invoices"].includes(location.pathname)
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
                    transform: "translateX(-4px)"
                  }
                }
              }
            }}
          >
            <MenuItem component={Link} to="/purchase-orders" onClick={handleClose}>
              أوامر الشراء
            </MenuItem>
            <MenuItem component={Link} to="/purchase-invoices" onClick={handleClose}>
              فواتير الشراء
            </MenuItem>
            <Divider />
            <MenuItem component={Link} to="/purchase-payments" onClick={handleClose}>
              مدفوعات
            </MenuItem>
            <MenuItem component={Link} to="/supplier-cheques" onClick={handleClose}>
              أوراق قبض
            </MenuItem>
          </Menu>
        </Box>

        {/* باقي الروابط */}
        <Box sx={{ display: "flex", flexDirection: "row-reverse" }}>
          {navItems.map((item) => (
            <Button
              key={item.path}
              component={Link}
              to={item.path}
              color={location.pathname === item.path ? "secondary" : "inherit"}
              sx={{
                ml: 1,
                fontWeight: location.pathname === item.path ? "bold" : "normal"
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
