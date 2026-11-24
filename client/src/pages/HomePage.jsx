import { Container, Typography, Box, Paper, Grid, Card, CardActionArea, CardContent, Avatar } from "@mui/material";
import {
  Dashboard as DashboardIcon,
  ReceiptLong as SalesIcon,
  AccountBalanceWallet as ExpensesIcon,
  Assessment as ReportsIcon,
  Inventory2 as InventoryIcon,
  People as PartiesIcon,
} from "@mui/icons-material";
import { Link } from "react-router-dom";

const quickLinks = [
  { title: "فواتير البيع", desc: "إدارة ومتابعة المبيعات", to: "/sales-invoices", icon: <SalesIcon />, gradient: "linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)" },
  { title: "المصروفات", desc: "تسجيل ومراجعة المصروفات", to: "/expenses", icon: <ExpensesIcon />, gradient: "linear-gradient(135deg, #e11d48 0%, #be123c 100%)" },
  { title: "التقارير", desc: "التحليل المالي والتقارير", to: "/reports-dashboard", icon: <ReportsIcon />, gradient: "linear-gradient(135deg, #7c3aed 0%, #5b21b6 100%)" },
  { title: "أرصدة المخازن", desc: "متابعة المخزون الحالي", to: "/current-inventory", icon: <InventoryIcon />, gradient: "linear-gradient(135deg, #059669 0%, #047857 100%)" },
  { title: "العملاء والموردين", desc: "كشوفات وبيانات الأطراف", to: "/parties", icon: <PartiesIcon />, gradient: "linear-gradient(135deg, #d97706 0%, #b45309 100%)" },
  { title: "لوحة التحكم", desc: "الإعدادات والنسخ الاحتياطي", to: "/dashboard", icon: <DashboardIcon />, gradient: "linear-gradient(135deg, #0284c7 0%, #0369a1 100%)" },
];

export default function HomePage() {
  return (
    <Container maxWidth="lg" sx={{ py: { xs: 2, sm: 4 } }}>
      <Paper
        elevation={0}
        sx={{
          p: { xs: 2.5, sm: 4 },
          mb: 3,
          borderRadius: 4,
          color: "#fff",
          background: "linear-gradient(135deg, #1e1b4b 0%, #1d4ed8 100%)",
          boxShadow: "0 12px 32px rgba(30, 27, 75, 0.2)",
        }}
      >
        <Typography variant="h4" fontWeight={800} gutterBottom>
          أهلاً بك في نظام إدارة الحسابات
        </Typography>
        <Typography variant="body1" sx={{ opacity: 0.9 }}>
          وصول سريع للفواتير، المخازن، المصروفات، والتقارير المالية من أي جهاز.
        </Typography>
      </Paper>

      <Grid container spacing={2}>
        {quickLinks.map((item) => (
          <Grid item xs={6} sm={4} key={item.to}>
            <Card
              elevation={0}
              sx={{
                height: "100%",
                borderRadius: 3,
                border: "1px solid #e2e8f0",
                transition: "transform 0.2s, box-shadow 0.2s",
                "&:hover": { transform: "translateY(-3px)", boxShadow: "0 10px 24px rgba(15, 23, 42, 0.08)" },
              }}
            >
              <CardActionArea component={Link} to={item.to} sx={{ height: "100%", p: { xs: 1.5, sm: 2.5 } }}>
                <CardContent sx={{ p: 0, textAlign: "center" }}>
                  <Avatar
                    sx={{
                      mx: "auto",
                      mb: 1.5,
                      width: { xs: 46, sm: 54 },
                      height: { xs: 46, sm: 54 },
                      background: item.gradient,
                      boxShadow: "0 6px 14px rgba(15, 23, 42, 0.15)",
                    }}
                  >
                    {item.icon}
                  </Avatar>
                  <Typography variant="subtitle1" fontWeight={700} sx={{ fontSize: { xs: "0.92rem", sm: "1.05rem" } }}>
                    {item.title}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" sx={{ display: { xs: "none", sm: "block" }, mt: 0.5 }}>
                    {item.desc}
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}
