import { BottomNavigation, BottomNavigationAction, Paper } from "@mui/material";
import {
  Dashboard as DashboardIcon,
  ReceiptLong as SalesIcon,
  AccountBalanceWallet as ExpensesIcon,
  Assessment as ReportsIcon,
  Menu as MenuIcon,
} from "@mui/icons-material";
import { useLocation, useNavigate } from "react-router-dom";

export default function MobileBottomNav({ onOpenMenu }) {
  const location = useLocation();
  const navigate = useNavigate();

  const currentValue = (() => {
    if (location.pathname === "/dashboard" || location.pathname === "/") return "/dashboard";
    if (location.pathname.startsWith("/sales")) return "/sales-invoices";
    if (location.pathname.startsWith("/expenses")) return "/expenses";
    if (location.pathname.startsWith("/reports")) return "/reports-dashboard";
    return false;
  })();

  return (
    <Paper
      elevation={8}
      sx={{
        display: { xs: "block", md: "none" },
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: (theme) => theme.zIndex.drawer + 1,
        borderTop: "1px solid rgba(226, 232, 240, 0.9)",
        borderRadius: "16px 16px 0 0",
        bgcolor: "rgba(255, 255, 255, 0.96)",
        backdropFilter: "blur(12px)",
        pb: "env(safe-area-inset-bottom)",
      }}
    >
      <BottomNavigation
        showLabels
        value={currentValue}
        onChange={(_, newValue) => {
          if (newValue === "__menu__") {
            onOpenMenu?.();
          } else {
            navigate(newValue);
          }
        }}
        sx={{
          bgcolor: "transparent",
          height: 62,
          "& .MuiBottomNavigationAction-root": {
            minWidth: 0,
            px: 0.5,
            color: "#64748b",
            "&.Mui-selected": {
              color: "#1e3a8a",
              fontWeight: 700,
            },
          },
          "& .MuiBottomNavigationAction-label": {
            fontSize: "0.7rem",
            fontFamily: "Cairo, sans-serif",
            mt: 0.25,
          },
        }}
      >
        <BottomNavigationAction label="الرئيسية" value="/dashboard" icon={<DashboardIcon fontSize="small" />} />
        <BottomNavigationAction label="المبيعات" value="/sales-invoices" icon={<SalesIcon fontSize="small" />} />
        <BottomNavigationAction label="المصروفات" value="/expenses" icon={<ExpensesIcon fontSize="small" />} />
        <BottomNavigationAction label="التقارير" value="/reports-dashboard" icon={<ReportsIcon fontSize="small" />} />
        <BottomNavigationAction label="القائمة" value="__menu__" icon={<MenuIcon fontSize="small" />} />
      </BottomNavigation>
    </Paper>
  );
}

