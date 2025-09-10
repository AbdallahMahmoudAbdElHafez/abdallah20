import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import { Link, useLocation } from "react-router-dom";

 function Navbar() {
  const location = useLocation();

  const navItems = [
    { label: "Home", path: "/" },
    { label: "Dashboard", path: "/dashboard" },
    { label: "Units", path: "/units" },
    { label: "Products", path: "/products" },
    { label: "Countries", path: "/countries" },
    { label:"Warehouses", path:"/warehouses"},
    { label: "Accounts", path: "/accounts" },
    { label: "Party Categories", path: "/party-categories" },
    { label: "Parties", path: "/parties" },
    { label : "Purchase Orders",path:'/purchase-orders'}
  ];

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          Products App
        </Typography>
        <Box>
          {navItems.map((item) => (
            <Button
              key={item.path}
              component={Link}
              to={item.path}
              color={location.pathname === item.path ? "secondary" : "inherit"}
              sx={{ marginLeft: 1 }}
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
