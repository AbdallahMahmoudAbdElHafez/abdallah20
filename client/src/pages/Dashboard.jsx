import { Container, Typography, Grid, Paper, Button, Box } from "@mui/material";
import { Link } from "react-router-dom";
import { useState } from "react";
import DatabaseManagementDialog from "../components/DatabaseManagementDialog";
import { Storage } from "@mui/icons-material";

export default function Dashboard() {
  const [dbDialogOpen, setDbDialogOpen] = useState(false);

  return (
    <Container maxWidth="lg" sx={{ mt: 6 }}>
      <Typography variant="h4" gutterBottom sx={{ textAlign: 'right', mb: 4 }}>
        لوحة التحكم
      </Typography>

      <Grid container spacing={3} dir="rtl">
        {/* Card لإدارة قواعد البيانات */}
        <Grid item xs={12} sm={6} md={4}>
          <Paper
            elevation={3}
            sx={{
              p: 3,
              textAlign: "center",
              borderRadius: 2,
              transition: 'transform 0.2s',
              '&:hover': { transform: 'scale(1.02)' }
            }}
          >
            <Box sx={{ color: '#1a237e', mb: 2 }}>
              <Storage sx={{ fontSize: 40 }} />
            </Box>
            <Typography variant="h6" gutterBottom>إدارة قواعد البيانات</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              تبديل قاعدة البيانات أو عمل نسخة احتياطية
            </Typography>
            <Button
              variant="contained"
              color="primary"
              fullWidth
              onClick={() => setDbDialogOpen(true)}
              sx={{ mt: 1 }}
            >
              فتح الإعدادات
            </Button>
          </Paper>
        </Grid>

        {/* Card للوحدات */}
        <Grid item xs={12} sm={6} md={4}>
          <Paper
            elevation={3}
            sx={{
              p: 3,
              textAlign: "center",
              borderRadius: 2,
              transition: 'transform 0.2s',
              '&:hover': { transform: 'scale(1.02)' }
            }}
          >
            <Typography variant="h6" gutterBottom>الوحدات</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              إدارة وحدات القياس للمنتجات
            </Typography>
            <Button
              variant="contained"
              color="primary"
              fullWidth
              component={Link}
              to="/units"
              sx={{ mt: 1 }}
            >
              إدارة الوحدات
            </Button>
          </Paper>
        </Grid>

        {/* Card للمنتجات */}
        <Grid item xs={12} sm={6} md={4}>
          <Paper
            elevation={3}
            sx={{
              p: 3,
              textAlign: "center",
              borderRadius: 2,
              transition: 'transform 0.2s',
              '&:hover': { transform: 'scale(1.02)' }
            }}
          >
            <Typography variant="h6" gutterBottom>المنتجات</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              إدارة قائمة المنتجات والأسعار
            </Typography>
            <Button
              variant="contained"
              color="primary"
              fullWidth
              component={Link}
              to="/products"
              sx={{ mt: 1 }}
            >
              إدارة المنتجات
            </Button>
          </Paper>
        </Grid>
      </Grid>

      <DatabaseManagementDialog
        open={dbDialogOpen}
        onClose={() => setDbDialogOpen(false)}
      />
    </Container>
  );
}
