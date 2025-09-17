import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Menu,
  MenuItem
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
    { label:"حركة المخازن",path:'/inventory-transactions'},
    {label:"القيود",path:"journal-entry-lines"},
        { label:"مدفوعات",path:'/purchase-payments'},
    {label:"اوراق قبض",path:"/supplier-cheques"}


  ];

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          نظام ادارة الحسابات
        </Typography>

        <Box
          sx={{
            display: "flex",
            flexDirection: "row-reverse",
            alignItems: "center"
          }}
        >
          {/* زر المشتريات مع قائمة أنيقة */}
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
            slotProps={{
              // خصائص عنصر الـ <MenuList>
              list: {
                dir: "rtl",
        
              },
              // خصائص عنصر الـ <Paper>
              paper: {
                elevation: 4,
                sx: {
                  borderRadius: 2,
                  mt: 1,
                  minWidth: 180,
                  bgcolor: "#fafafa",
                  "& .MuiMenuItem-root": {
                    fontSize: "0.95rem",
                    px: 2,
                    py: 1,
                    transition: "all 0.2s ease-in-out",
                    "&:hover": {
                      bgcolor: "#d29819",
                      color: "white",
                      transform: "translateX(-4px)"
                    }
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
          </Menu>



          {/* باقي العناصر */}
          {navItems.map((item) => (
            <Button
              key={item.path}
              component={Link}
              to={item.path}
              color={location.pathname === item.path ? "secondary" : "inherit"}
              sx={{ ml: 1 }}
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
