import React, { useEffect, useMemo, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Snackbar,
  Alert,
  Typography,
  IconButton,
  Tooltip,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Stack,
  Grid,
  useTheme,
  alpha,
  InputAdornment,
} from "@mui/material";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Close as CloseIcon,
  Business as BusinessIcon,
  TrendingUp as TrendingUpIcon,
  CalendarToday as CalendarIcon,
} from "@mui/icons-material";
import { MaterialReactTable } from "material-react-table";
import { defaultTableProps } from "../config/tableConfig";
import {
  fetchDepartments,
  addDepartment,
  updateDepartment,
  deleteDepartment,
} from "../features/departments/departmentsSlice";

// Form validation hook for departments
const useDepartmentFormValidation = (initialData = {}) => {
  const [formData, setFormData] = useState({
    name: "",
    ...initialData,
  });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const validateField = useCallback((fieldName, value) => {
    switch (fieldName) {
      case 'name':
        if (!value || value.trim().length === 0) return "اسم القسم مطلوب";
        if (value.trim().length < 2) return "اسم القسم يجب أن يكون أكثر من حرف واحد";
        if (value.trim().length > 100) return "اسم القسم يجب أن يكون أقل من 100 حرف";
        return "";
      default:
        return "";
    }
  }, []);

  const validateAll = useCallback(() => {
    const newErrors = {};
    Object.keys(formData).forEach(key => {
      const error = validateField(key, formData[key]);
      if (error) newErrors[key] = error;
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData, validateField]);

  const handleFieldChange = useCallback((fieldName, value) => {
    setFormData(prev => ({ ...prev, [fieldName]: value }));

    if (touched[fieldName]) {
      const error = validateField(fieldName, value);
      setErrors(prev => ({ ...prev, [fieldName]: error }));
    }
  }, [touched, validateField]);

  const handleFieldBlur = useCallback((fieldName) => {
    setTouched(prev => ({ ...prev, [fieldName]: true }));
    const error = validateField(fieldName, formData[fieldName]);
    setErrors(prev => ({ ...prev, [fieldName]: error }));
  }, [formData, validateField]);

  const reset = useCallback((newData = {}) => {
    const resetData = {
      name: "",
      ...newData,
    };
    setFormData(resetData);
    setErrors({});
    setTouched({});
  }, []);

  const isValid = useMemo(() => {
    return Object.keys(formData).every(key => {
      const error = validateField(key, formData[key]);
      return !error;
    }) && formData.name.trim().length > 0;
  }, [formData, validateField]);

  return {
    formData,
    errors,
    touched,
    isValid,
    handleFieldChange,
    handleFieldBlur,
    reset,
    validateAll,
  };
};

// Snackbar hook
const useSnackbar = () => {
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const showSnackbar = useCallback((message, severity = "success") => {
    setSnackbar({ open: true, message, severity });
  }, []);

  const hideSnackbar = useCallback(() => {
    setSnackbar(prev => ({ ...prev, open: false }));
  }, []);

  return { snackbar, showSnackbar, hideSnackbar };
};

// Confirmation Dialog Component
const ConfirmationDialog = ({ open, onClose, onConfirm, title, message, loading }) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xs"
      fullWidth
      PaperProps={{ sx: { borderRadius: 2 } }}
    >
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1, pb: 1 }}>
        <DeleteIcon color="error" />
        {title}
      </DialogTitle>
      <DialogContent>
        <Typography>{message}</Typography>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose} disabled={loading}>
          إلغاء
        </Button>
        <Button
          onClick={onConfirm}
          color="error"
          variant="contained"
          disabled={loading}
          startIcon={loading ? <CircularProgress size={16} /> : <DeleteIcon />}
        >
          {loading ? "جاري الحذف..." : "حذف"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

// Main Departments Page Component
export default function DepartmentsPage() {
  const theme = useTheme();
  const dispatch = useDispatch();
  const { list: departments, loading, error } = useSelector((state) => state.departments);

  // Form management
  const departmentForm = useDepartmentFormValidation();
  const [openDialog, setOpenDialog] = useState(false);
  const [editRow, setEditRow] = useState(null);
  const [saving, setSaving] = useState(false);

  // Confirmation dialog
  const [confirmDialog, setConfirmDialog] = useState({
    open: false,
    departmentId: null,
    departmentName: "",
  });
  const [deleting, setDeleting] = useState(false);

  // Snackbar
  const { snackbar, showSnackbar, hideSnackbar } = useSnackbar();

  // Load data
  useEffect(() => {
    dispatch(fetchDepartments());
  }, [dispatch]);

  // Handle Redux errors
  useEffect(() => {
    if (error) {
      showSnackbar(error, "error");
    }
  }, [error, showSnackbar]);

  const handleOpenDialog = useCallback((row = null) => {
    if (row) {
      setEditRow(row);
      departmentForm.reset({
        name: row.name || "",
      });
    } else {
      setEditRow(null);
      departmentForm.reset();
    }
    setOpenDialog(true);
  }, [departmentForm]);

  const handleCloseDialog = useCallback(() => {
    setOpenDialog(false);
    setEditRow(null);
    departmentForm.reset();
    setSaving(false);
  }, [departmentForm]);

  const handleSave = useCallback(async () => {
    if (!departmentForm.validateAll()) {
      // Mark all fields as touched to show errors
      Object.keys(departmentForm.formData).forEach(key => {
        departmentForm.handleFieldBlur(key);
      });
      return;
    }

    // Check for duplicates
    const isDuplicate = departments.some(dept =>
      dept.name.toLowerCase().trim() === departmentForm.formData.name.toLowerCase().trim() &&
      (!editRow || dept.id !== editRow.id)
    );

    if (isDuplicate) {
      showSnackbar("اسم القسم موجود بالفعل", "error");
      return;
    }

    setSaving(true);
    try {
      const payload = {
        name: departmentForm.formData.name.trim(),
      };

      if (editRow) {
        await dispatch(updateDepartment({ id: editRow.id, data: payload })).unwrap();
        showSnackbar("تم تحديث القسم بنجاح", "success");
      } else {
        await dispatch(addDepartment(payload)).unwrap();
        showSnackbar("تم إضافة القسم بنجاح", "success");
      }
      handleCloseDialog();
    } catch (err) {
      showSnackbar(err.message || "حدث خطأ أثناء الحفظ", "error");
    } finally {
      setSaving(false);
    }
  }, [departmentForm, departments, editRow, dispatch, showSnackbar, handleCloseDialog]);

  const handleDeleteClick = useCallback((department) => {
    setConfirmDialog({
      open: true,
      departmentId: department.id,
      departmentName: department.name,
    });
  }, []);

  const handleConfirmDelete = useCallback(async () => {
    setDeleting(true);
    try {
      await dispatch(deleteDepartment(confirmDialog.departmentId)).unwrap();
      showSnackbar("تم حذف القسم بنجاح", "info");
      setConfirmDialog({ open: false, departmentId: null, departmentName: "" });
    } catch (err) {
      showSnackbar(err.message || "حدث خطأ أثناء الحذف", "error");
    } finally {
      setDeleting(false);
    }
  }, [dispatch, confirmDialog.departmentId, showSnackbar]);

  // Calculate statistics
  const stats = useMemo(() => {
    const totalDepartments = departments.length;
    const recentlyAdded = departments.filter(dept => {
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return new Date(dept.created_at) > weekAgo;
    }).length;

    return {
      total: totalDepartments,
      recentlyAdded,
    };
  }, [departments]);

  // Table columns
  const columns = useMemo(() => [
    {
      accessorKey: "id",
      header: "الرقم التسلسلي",
      size: 100,
      Cell: ({ cell }) => (
        <Chip
          label={`#${cell.getValue()}`}
          size="small"
          color="primary"
          variant="outlined"
        />
      ),
    },
    {
      accessorKey: "name",
      header: "اسم القسم",
      Cell: ({ cell }) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <BusinessIcon fontSize="small" color="black" />
          <Typography variant="body2" fontWeight="medium">
            {cell.getValue()}
          </Typography>
        </Box>
      ),
    },
  ], []);

  return (
    <Box sx={{ p: 3, maxWidth: 1400, mx: 'auto' }}>
      {/* Header */}
      <Card
        sx={{
          mb: 3,
          background: theme.mixins.gradientHeader,
          color: 'black',
        }}
      >
        <CardContent>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Box>
              <Typography variant="h4" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <BusinessIcon fontSize="large" />
                إدارة الأقسام
              </Typography>
              <Typography variant="body1" sx={{ opacity: 0.9 }}>
                إدارة أقسام الشركة وتنظيم الهيكل الإداري
              </Typography>
            </Box>
            <Box textAlign="center">
              <Typography variant="h3" fontWeight="bold">
                {stats.total}
              </Typography>
              <Typography variant="caption">
                إجمالي الأقسام
              </Typography>
            </Box>
          </Stack>
        </CardContent>
      </Card>

      {/* Statistics */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={4}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <BusinessIcon color="primary" sx={{ fontSize: 40, mb: 1 }} />
              <Typography variant="h5" color="primary.main" fontWeight="bold">
                {stats.total}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                إجمالي الأقسام
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <CalendarIcon color="success" sx={{ fontSize: 40, mb: 1 }} />
              <Typography variant="h5" color="success.main" fontWeight="bold">
                {stats.recentlyAdded}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                مضاف حديثاً
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <TrendingUpIcon color="info" sx={{ fontSize: 40, mb: 1 }} />
              <Typography variant="h5" color="info.main" fontWeight="bold">
                {departments.length > 0 ? "نشط" : "جديد"}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                حالة النظام
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Add Button */}
      <Box sx={{ mb: 3 }}>
        <Button
          variant="contained"
          size="large"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
          sx={{ borderRadius: 2 }}
        >
          إضافة قسم جديد
        </Button>
      </Box>

      {/* Table */}
      <Card>
        <MaterialReactTable
          {...defaultTableProps}
          columns={columns}
          data={departments}
          state={{ isLoading: loading }}
          enablePagination
          enableSorting
          enableGlobalFilter
          enableRowActions
          positionActionsColumn="last"
          renderRowActions={({ row }) => (
            <Stack direction="row" spacing={1}>
              <Tooltip title="تعديل">
                <IconButton
                  size="small"
                  onClick={() => handleOpenDialog(row.original)}
                  sx={{
                    color: 'primary.main',
                    '&:hover': { backgroundColor: alpha(theme.palette.primary.main, 0.1) },
                  }}
                >
                  <EditIcon fontSize="small" />
                </IconButton>
              </Tooltip>
              <Tooltip title="حذف">
                <IconButton
                  size="small"
                  onClick={() => handleDeleteClick(row.original)}
                  sx={{
                    color: 'error.main',
                    '&:hover': { backgroundColor: alpha(theme.palette.error.main, 0.1) },
                  }}
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </Stack>
          )}
          muiTableContainerProps={{ sx: { maxHeight: 600 } }}
          muiTopToolbarProps={{
            sx: {
              backgroundColor: 'grey.50',
              '& .MuiTextField-root .MuiInputBase-root': { backgroundColor: 'white' },
            },
          }}
          muiTableHeadCellProps={{
            sx: { backgroundColor: 'primary.main', color: 'black', fontWeight: 'bold' },
          }}
          initialState={{
            pagination: { pageSize: 10 },
            sorting: [{ id: 'id', desc: true }],
          }}
          localization={{
            noRecordsToDisplay: 'لا توجد أقسام للعرض',
            search: 'البحث...',
          }}
        />
      </Card>

      {/* Add/Edit Dialog */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { borderRadius: 2 } }}
      >
        <DialogTitle sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          ...theme.mixins.gradientHeader,
          color: 'white',
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <BusinessIcon />
            {editRow ? "تحديث القسم" : "إضافة قسم جديد"}
          </Box>
          <IconButton onClick={handleCloseDialog} sx={{ color: 'white' }}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ p: 3 }}>
          <Box sx={{ mt: 2 }}>
            <TextField
              fullWidth
              autoFocus
              label="اسم القسم"
              value={departmentForm.formData.name}
              onChange={(e) => departmentForm.handleFieldChange('name', e.target.value)}
              onBlur={() => departmentForm.handleFieldBlur('name')}
              error={departmentForm.touched.name && !!departmentForm.errors.name}
              helperText={departmentForm.touched.name && departmentForm.errors.name}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <BusinessIcon color="action" />
                  </InputAdornment>
                ),
              }}
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2, gap: 1 }}>
          <Button
            onClick={handleCloseDialog}
            disabled={saving}
            variant="outlined"
          >
            إلغاء
          </Button>
          <Button
            onClick={handleSave}
            variant="contained"
            disabled={saving || !departmentForm.isValid}
            startIcon={saving ? <CircularProgress size={16} /> : <AddIcon />}
          >
            {saving ? "جاري الحفظ..." : (editRow ? "تحديث" : "إضافة")}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Confirmation Dialog */}
      <ConfirmationDialog
        open={confirmDialog.open}
        onClose={() => setConfirmDialog({ open: false, departmentId: null, departmentName: "" })}
        onConfirm={handleConfirmDelete}
        title="تأكيد الحذف"
        message={`هل أنت متأكد من حذف القسم "${confirmDialog.departmentName}"؟ لا يمكن التراجع عن هذا الإجراء.`}
        loading={deleting}
      />

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={hideSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={hideSnackbar}
          severity={snackbar.severity}
          variant="filled"
          sx={{ borderRadius: 2 }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
