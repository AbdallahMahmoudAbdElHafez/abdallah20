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
  useTheme,
  alpha,
} from "@mui/material";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Close as CloseIcon,
  Category as CategoryIcon,
  Search as SearchIcon,
} from "@mui/icons-material";
import { MaterialReactTable } from "material-react-table";
import { fetchUnits, addUnit, updateUnit, deleteUnit } from "../features/units/unitsSlice";

// Custom hook for form validation
const useFormValidation = (initialValue = "") => {
  const [value, setValue] = useState(initialValue);
  const [error, setError] = useState("");
  const [touched, setTouched] = useState(false);

  const validate = useCallback((val) => {
    if (!val || val.trim().length === 0) {
      return "اسم الوحدة مطلوب";
    }
    if (val.trim().length < 2) {
      return "اسم الوحدة يجب أن يكون أكثر من حرف واحد";
    }
    if (val.trim().length > 50) {
      return "اسم الوحدة يجب أن يكون أقل من 50 حرف";
    }
    return "";
  }, []);

  const handleChange = useCallback((newValue) => {
    setValue(newValue);
    if (touched) {
      setError(validate(newValue));
    }
  }, [touched, validate]);

  const handleBlur = useCallback(() => {
    setTouched(true);
    setError(validate(value));
  }, [value, validate]);

  const reset = useCallback((newValue = "") => {
    setValue(newValue);
    setError("");
    setTouched(false);
  }, []);

  const isValid = useMemo(() => {
    return validate(value) === "";
  }, [value, validate]);

  return {
    value,
    error,
    touched,
    isValid,
    handleChange,
    handleBlur,
    reset,
  };
};

// Custom hook for snackbar management
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
      PaperProps={{
        sx: { borderRadius: 2 }
      }}
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

// Main Units Page Component
export default function UnitsPage() {
  const theme = useTheme();
  const dispatch = useDispatch();
  const { items, loading, error } = useSelector((state) => state.units);

  // Form state management
  const nameField = useFormValidation("");
  const [openDialog, setOpenDialog] = useState(false);
  const [editRow, setEditRow] = useState(null);
  const [saving, setSaving] = useState(false);
  
  // Confirmation dialog state
  const [confirmDialog, setConfirmDialog] = useState({
    open: false,
    unitId: null,
    unitName: "",
  });
  const [deleting, setDeleting] = useState(false);

  // Snackbar management
  const { snackbar, showSnackbar, hideSnackbar } = useSnackbar();

  // Load units on component mount
  useEffect(() => {
    dispatch(fetchUnits());
  }, [dispatch]);

  // Show error snackbar when Redux error occurs
  useEffect(() => {
    if (error) {
      showSnackbar(error, "error");
    }
  }, [error, showSnackbar]);

  const handleOpenDialog = useCallback((row = null) => {
    if (row) {
      setEditRow(row);
      nameField.reset(row.name);
    } else {
      setEditRow(null);
      nameField.reset("");
    }
    setOpenDialog(true);
  }, [nameField]);

  const handleCloseDialog = useCallback(() => {
    setOpenDialog(false);
    setEditRow(null);
    nameField.reset("");
    setSaving(false);
  }, [nameField]);

  const handleSave = useCallback(async () => {
    // Validate form
    nameField.handleBlur();
    if (!nameField.isValid) {
      return;
    }

    // Check for duplicate names (excluding current unit when editing)
    const isDuplicate = items.some(unit => 
      unit.name.toLowerCase().trim() === nameField.value.toLowerCase().trim() &&
      (!editRow || unit.id !== editRow.id)
    );

    if (isDuplicate) {
      showSnackbar("اسم الوحدة موجود بالفعل", "error");
      return;
    }

    setSaving(true);
    try {
      if (editRow) {
        await dispatch(updateUnit({ 
          id: editRow.id, 
          data: { name: nameField.value.trim() } 
        })).unwrap();
        showSnackbar("تم تحديث الوحدة بنجاح", "success");
      } else {
        await dispatch(addUnit({ name: nameField.value.trim() })).unwrap();
        showSnackbar("تم إضافة الوحدة بنجاح", "success");
      }
      handleCloseDialog();
    } catch (err) {
      showSnackbar(err.message || "حدث خطأ أثناء الحفظ", "error");
    } finally {
      setSaving(false);
    }
  }, [nameField, items, editRow, dispatch, showSnackbar, handleCloseDialog]);

  const handleDeleteClick = useCallback((unit) => {
    setConfirmDialog({
      open: true,
      unitId: unit.id,
      unitName: unit.name,
    });
  }, []);

  const handleConfirmDelete = useCallback(async () => {
    setDeleting(true);
    try {
      await dispatch(deleteUnit(confirmDialog.unitId)).unwrap();
      showSnackbar("تم حذف الوحدة بنجاح", "info");
      setConfirmDialog({ open: false, unitId: null, unitName: "" });
    } catch (err) {
      showSnackbar(err.message || "حدث خطأ أثناء الحذف", "error");
    } finally {
      setDeleting(false);
    }
  }, [dispatch, confirmDialog.unitId, showSnackbar]);

  const handleCancelDelete = useCallback(() => {
    setConfirmDialog({ open: false, unitId: null, unitName: "" });
  }, []);

  // Memoized columns configuration
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
      header: "اسم الوحدة",
      Cell: ({ cell }) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <CategoryIcon fontSize="small" color="action" />
          <Typography variant="body2" fontWeight="medium">
            {cell.getValue()}
          </Typography>
        </Box>
      ),
    },
   
  ], []);

  // Calculate statistics
  const stats = useMemo(() => ({
    total: items.length,
    recentlyAdded: items.filter(unit => {
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return new Date(unit.created_at) > weekAgo;
    }).length,
  }), [items]);

  return (
    <Box sx={{ p: 3, maxWidth: 1200, mx: 'auto' }}>
      {/* Header Section */}
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
                <CategoryIcon fontSize="large" />
                إدارة الوحدات
              </Typography>
              <Typography variant="body1" sx={{ opacity: 0.9 }}>
                إدارة وحدات القياس المستخدمة في النظام
              </Typography>
            </Box>
            <Box textAlign="center">
              <Typography variant="h3" fontWeight="bold">
                {stats.total}
              </Typography>
              <Typography variant="caption">
                إجمالي الوحدات
              </Typography>
            </Box>
          </Stack>
        </CardContent>
      </Card>

      {/* Statistics Cards */}
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mb: 3 }}>
        <Card sx={{ flex: 1 }}>
          <CardContent sx={{ textAlign: 'center' }}>
            <Typography variant="h5" color="primary.main" fontWeight="bold">
              {stats.total}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              إجمالي الوحدات
            </Typography>
          </CardContent>
        </Card>
        <Card sx={{ flex: 1 }}>
          <CardContent sx={{ textAlign: 'center' }}>
            <Typography variant="h5" color="success.main" fontWeight="bold">
              {stats.recentlyAdded}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              مضاف حديثاً (آخر أسبوع)
            </Typography>
          </CardContent>
        </Card>
      </Stack>

      {/* Action Button */}
      <Box sx={{ mb: 3 }}>
        <Button
          variant="contained"
          size="large"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
          sx={{ borderRadius: 2 }}
        >
          إضافة وحدة جديدة
        </Button>
      </Box>

      {/* Data Table */}
      <Card>
        <MaterialReactTable
          columns={columns}
          data={items}
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
                    '&:hover': {
                      backgroundColor: alpha(theme.palette.primary.main, 0.1),
                    },
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
                    '&:hover': {
                      backgroundColor: alpha(theme.palette.error.main, 0.1),
                    },
                  }}
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </Stack>
          )}
          muiTableContainerProps={{
            sx: { maxHeight: 600 },
          }}
          muiTopToolbarProps={{
            sx: { 
              backgroundColor: 'grey.50',
              '& .MuiTextField-root': {
                '& .MuiInputBase-root': {
                  backgroundColor: 'white',
                },
              },
            },
          }}
          muiTableHeadCellProps={{
            sx: {
              backgroundColor: 'primary.main',
              color: 'black',
              fontWeight: 'bold',
            },
          }}
          muiTableBodyRowProps={({ row }) => ({
            sx: {
              '&:hover': {
                backgroundColor: 'action.hover',
              },
            },
          })}
          initialState={{
            pagination: { pageSize: 10 },
            sorting: [{ id: 'id', desc: true }],
          }}
          localization={{
            noRecordsToDisplay: 'لا توجد وحدات للعرض',
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
        PaperProps={{
          sx: { borderRadius: 2 }
        }}
      >
        <DialogTitle sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          ...theme.mixins.gradientHeader,
          color: 'white',
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <CategoryIcon />
            {editRow ? "تحديث الوحدة" : "إضافة وحدة جديدة"}
          </Box>
          <IconButton onClick={handleCloseDialog} sx={{ color: 'white' }}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ p: 3 }}>
          <Box sx={{ mt: 1 }}>
            <TextField
              fullWidth
              label="اسم الوحدة"
              value={nameField.value}
              onChange={(e) => nameField.handleChange(e.target.value)}
              onBlur={nameField.handleBlur}
              error={nameField.touched && !!nameField.error}
              helperText={nameField.touched && nameField.error}
              placeholder="مثال: كيلوجرام، متر، قطعة..."
              InputProps={{
                startAdornment: <CategoryIcon sx={{ mr: 1, color: 'action.active' }} />,
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                },
              }}
            />
            <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
              * يجب أن يكون اسم الوحدة بين 2-50 حرف
            </Typography>
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
            disabled={saving || !nameField.isValid}
            startIcon={saving ? <CircularProgress size={16} /> : <AddIcon />}
          >
            {saving ? "جاري الحفظ..." : (editRow ? "تحديث" : "إضافة")}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Confirmation Dialog */}
      <ConfirmationDialog
        open={confirmDialog.open}
        onClose={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        title="تأكيد الحذف"
        message={`هل أنت متأكد من حذف الوحدة "${confirmDialog.unitName}"؟ لا يمكن التراجع عن هذا الإجراء.`}
        loading={deleting}
      />

      {/* Snackbar for notifications */}
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