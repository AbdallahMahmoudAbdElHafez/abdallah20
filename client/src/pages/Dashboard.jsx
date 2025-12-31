import { Container, Typography, Grid, Paper, Button, Box } from "@mui/material";
import { Link } from "react-router-dom";
import { useState } from "react";
import DatabaseManagementDialog from "../components/DatabaseManagementDialog";
import { Storage, PowerSettingsNew } from "@mui/icons-material";
import systemApi from "../api/systemApi";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions
} from "@mui/material";

export default function Dashboard() {
  const [dbDialogOpen, setDbDialogOpen] = useState(false);
  const [shutdownDialogOpen, setShutdownDialogOpen] = useState(false);
  const [restartDialogOpen, setRestartDialogOpen] = useState(false);

  const handleShutdown = async () => {
    try {
      await systemApi.shutdown();
      alert('تم إرسال أمر الإغلاق. سيتم فصل الاتصال بالسيرفر الآن.');
      setShutdownDialogOpen(false);
    } catch (err) {
      console.error(err);
      const msg = err.response?.data?.message || err.message || 'خطأ غير معروف';
      alert(`فشل في إرسال أمر الإغلاق: ${msg}`);
    }
  };

  const handleRestart = async () => {
    try {
      await systemApi.restart();
      alert('جاري إعادة التشغيل... يرجى الانتظار ثوانٍ ثم تحديث الصفحة.');
      setRestartDialogOpen(false);
    } catch (err) {
      console.error(err);
      const msg = err.response?.data?.message || err.message || 'خطأ غير معروف';
      alert(`فشل في إعادة التشغيل: ${msg}`);
    }
  };

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

        {/* Card لفتح وإغلاق السيرفر */}
        <Grid item xs={12} sm={6} md={4}>
          <Paper
            elevation={3}
            sx={{
              p: 3,
              textAlign: "center",
              borderRadius: 2,
              transition: 'transform 0.2s',
              border: '1px solid #ffebee',
              '&:hover': { transform: 'scale(1.02)', bgcolor: '#fff9f9' }
            }}
          >
            <Box sx={{ color: '#d32f2f', mb: 2 }}>
              <PowerSettingsNew sx={{ fontSize: 40 }} />
            </Box>
            <Typography variant="h6" gutterBottom>التحكم في النظام</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              إعادة تشغيل أو إغلاق الخادم (السيرفر)
            </Typography>

            <Grid container spacing={1}>
              <Grid item xs={6}>
                <Button
                  variant="outlined"
                  color="primary"
                  fullWidth
                  onClick={() => setRestartDialogOpen(true)}
                  sx={{ mt: 1 }}
                >
                  إعادة تشغيل
                </Button>
              </Grid>
              <Grid item xs={6}>
                <Button
                  variant="contained"
                  color="error"
                  fullWidth
                  onClick={() => setShutdownDialogOpen(true)}
                  sx={{ mt: 1 }}
                >
                  إغلاق
                </Button>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>

      <DatabaseManagementDialog
        open={dbDialogOpen}
        onClose={() => setDbDialogOpen(false)}
      />

      {/* Shutdown Dialog */}
      <Dialog
        open={shutdownDialogOpen}
        onClose={() => setShutdownDialogOpen(false)}
        dir="rtl"
      >
        <DialogTitle sx={{ textAlign: 'right' }}>تأكيد الإغلاق</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ textAlign: 'right' }}>
            هل أنت متأكد من رغبتك في إغلاق السيرفر؟ لن تتمكن من العمل على النظام حتى يتم تشغيله مرة أخرى يدويًا.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'flex-start', px: 3, pb: 2 }}>
          <Button onClick={() => setShutdownDialogOpen(false)} color="primary">
            إلغاء
          </Button>
          <Button onClick={handleShutdown} color="error" variant="contained">
            نعم، أغلق السيرفر
          </Button>
        </DialogActions>
      </Dialog>

      {/* Restart Dialog */}
      <Dialog
        open={restartDialogOpen}
        onClose={() => setRestartDialogOpen(false)}
        dir="rtl"
      >
        <DialogTitle sx={{ textAlign: 'right' }}>تأكيد إعادة التشغيل</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ textAlign: 'right' }}>
            هل أنت متأكد من رغبتك في إعادة تشغيل السيرفر؟ سيتم فصل الاتصال لثوانٍ معدودة ثم يعود للعمل.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'flex-start', px: 3, pb: 2 }}>
          <Button onClick={() => setRestartDialogOpen(false)} color="primary">
            إلغاء
          </Button>
          <Button onClick={handleRestart} color="error" variant="contained">
            إعادة تشغيل
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
