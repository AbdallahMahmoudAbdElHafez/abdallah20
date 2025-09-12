import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  direction: "rtl", // أو "ltr" لو حابب
  palette: {
    mode: "light",
    primary: {
      main: "#d29819", // لون رئيسي
    },
    secondary: {
      main: "#9c27b0",
    },
    background: {
      default: "#e1f08eff",
      paper: "#ffffff",
    },
  },
  typography: {
    fontFamily: "'Cairo', sans-serif",
  },
  components: {
    // لتعديل خلايا الجدول كلها
    MuiTableCell: {
      styleOverrides: {
        root: {
          textAlign: "center", // يوسّط النص في كل الخلايا
          borderBottom: "1px solid rgba(224,224,224,1)",
        },
      },
    },
    // لو حابب تتحكم في رأس الجدول
    MuiTableHead: {
      styleOverrides: {
        root: {
          "& .MuiTableCell-root": {
            fontWeight: 600,
            textAlign: "center",
            
          },
        },
      },
    },
    MuiTableContainer: {
      styleOverrides: {
        root: {
          maxHeight: 500,
          width: "50%", // عرض الجدول
          margin: "0 auto", // يوسّط الجدول أفقياً في الصفحة
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: "12px",
        },
      },
    },
  },
});

export default theme;
