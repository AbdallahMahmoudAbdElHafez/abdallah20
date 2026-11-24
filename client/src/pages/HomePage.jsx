import { Container, Typography, Button, Box, Paper, Stack } from "@mui/material";
import { Link } from "react-router-dom";

export default function HomePage() {
  return (
    <Container maxWidth="md" sx={{ py: { xs: 3, sm: 6 } }}>
      <Paper
        elevation={2}
        sx={{
          p: { xs: 2.5, sm: 4 },
          textAlign: "center",
          borderRadius: 3,
        }}
      >
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          نظام إدارة الحسابات والمخازن
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          أهلاً بك في النظام. يمكنك استخدام القائمة الجانبية أو الأزرار بالأسفل للوصول السريع.
        </Typography>

        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={2}
          justifyContent="center"
        >
          <Button variant="contained" component={Link} to="/dashboard">
            لوحة التحكم
          </Button>
          <Button variant="outlined" component={Link} to="/sales-invoices">
            فواتير البيع
          </Button>
          <Button variant="outlined" component={Link} to="/reports-dashboard">
            التقارير
          </Button>
        </Stack>
      </Paper>
    </Container>
  );
}
