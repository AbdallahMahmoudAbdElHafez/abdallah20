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
  MenuItem,
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
  Inventory as InventoryIcon,
  AttachMoney as MoneyIcon,
  TrendingUp as TrendingUpIcon,
  Category as CategoryIcon,
  Analytics as AnalyticsIcon,
} from "@mui/icons-material";
import { MaterialReactTable } from "material-react-table";
import { defaultTableProps } from "../config/tableConfig";
import { fetchProducts, addProduct, updateProduct, deleteProduct } from "../features/products/productsSlice";
import { fetchUnits } from "../features/units/unitsSlice";

// Form validation hook for products
const useProductFormValidation = (initialData = {}) => {
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    cost_price: "",
    unit_id: "",
    ...initialData,
  });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const validateField = useCallback((fieldName, value, allData = formData) => {
    switch (fieldName) {
      case 'name':
        if (!value || value.trim().length === 0) return "اسم المنتج مطلوب";
        if (value.trim().length < 2) return "اسم المنتج يجب أن يكون أكثر من حرف واحد";
        if (value.trim().length > 100) return "اسم المنتج يجب أن يكون أقل من 100 حرف";
        return "";

      case 'price':
        if (!value || value === "") return "السعر مطلوب";
        const price = parseFloat(value);
        if (isNaN(price) || price < 0) return "السعر يجب أن يكون رقم موجب";
        if (price > 999999) return "السعر كبير جداً";
        return "";

      case 'cost_price':
        if (!value || value === "") return "سعر التكلفة مطلوب";
        const costPrice = parseFloat(value);
        if (isNaN(costPrice) || costPrice < 0) return "سعر التكلفة يجب أن يكون رقم موجب";
        const sellPrice = parseFloat(allData.price || 0);
        if (costPrice > sellPrice && sellPrice > 0) {
          return "سعر التكلفة لا يجب أن يكون أكبر من سعر البيع";
        }
        return "";

      case 'unit_id':
        if (!value || value === "") return "الوحدة مطلوبة";
        return "";

      default:
        return "";
    }
  }, [formData]);

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
    const newData = { ...formData, [fieldName]: value };
    setFormData(newData);

    if (touched[fieldName]) {
      const error = validateField(fieldName, value, newData);
      setErrors(prev => ({ ...prev, [fieldName]: error }));

      // Re-validate cost_price if price changes
      if (fieldName === 'price' && touched.cost_price) {
        const costError = validateField('cost_price', formData.cost_price, newData);
        setErrors(prev => ({ ...prev, cost_price: costError }));
      }
    }
  }, [formData, touched, validateField]);

  const handleFieldBlur = useCallback((fieldName) => {
    setTouched(prev => ({ ...prev, [fieldName]: true }));
    const error = validateField(fieldName, formData[fieldName]);
    setErrors(prev => ({ ...prev, [fieldName]: error }));
  }, [formData, validateField]);

  const reset = useCallback((newData = {}) => {
    const resetData = {
      name: "",
      price: "",
      cost_price: "",
      unit_id: "",
      ...newData,
    };
    setFormData(resetData);
    setErrors({});
    setTouched({});
  }, []);

  const isValid = useMemo(() => {
    return validateAll() && Object.keys(touched).length > 0;
  }, [validateAll, touched]);

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

// Profit Margin Component
const ProfitMargin = ({ price, costPrice }) => {
  const profit = parseFloat(price || 0) - parseFloat(costPrice || 0);
  const margin = parseFloat(costPrice || 0) > 0 ? (profit / parseFloat(costPrice || 0)) * 100 : 0;

  const getColor = () => {
    if (margin < 10) return 'error';
    if (margin < 25) return 'warning';
    return 'success';
  };

  return (
    <Chip
      label={`${margin.toFixed(1)}%`}
      color={getColor()}
      size="small"
      icon={<TrendingUpIcon />}
    />
  );
};

// Main Products Page Component
export default function ProductsPage() {
  const theme = useTheme();
  const dispatch = useDispatch();
  const { items: products, loading, error } = useSelector((state) => state.products);
  const { items: units } = useSelector((state) => state.units);

  // Form management
  const productForm = useProductFormValidation();
  const [openDialog, setOpenDialog] = useState(false);
  const [editRow, setEditRow] = useState(null);
  const [saving, setSaving] = useState(false);

  // Confirmation dialog
  const [confirmDialog, setConfirmDialog] = useState({
    open: false,
    productId: null,
    productName: "",
  });
  const [deleting, setDeleting] = useState(false);

  // Snackbar
  const { snackbar, showSnackbar, hideSnackbar } = useSnackbar();

  // Load data
  useEffect(() => {
    dispatch(fetchProducts());
    dispatch(fetchUnits());
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
      productForm.reset({
        name: row.name || "",
        price: row.price || "",
        cost_price: row.cost_price || "",
        unit_id: row.unit_id || "",
      });
    } else {
      setEditRow(null);
      productForm.reset();
    }
    setOpenDialog(true);
  }, [productForm]);

  const handleCloseDialog = useCallback(() => {
    setOpenDialog(false);
    setEditRow(null);
    productForm.reset();
    setSaving(false);
  }, [productForm]);

  const handleSave = useCallback(async () => {
    if (!productForm.validateAll()) {
      // Mark all fields as touched to show errors
      Object.keys(productForm.formData).forEach(key => {
        productForm.handleFieldBlur(key);
      });
      return;
    }

    // Check for duplicates
    const isDuplicate = products.some(product =>
      product.name.toLowerCase().trim() === productForm.formData.name.toLowerCase().trim() &&
      (!editRow || product.id !== editRow.id)
    );

    if (isDuplicate) {
      showSnackbar("اسم المنتج موجود بالفعل", "error");
      return;
    }

    setSaving(true);
    try {
      const payload = {
        ...productForm.formData,
        name: productForm.formData.name.trim(),
        price: parseFloat(productForm.formData.price),
        cost_price: parseFloat(productForm.formData.cost_price),
      };

      if (editRow) {
        await dispatch(updateProduct({ id: editRow.id, data: payload })).unwrap();
        showSnackbar("تم تحديث المنتج بنجاح", "success");
      } else {
        await dispatch(addProduct(payload)).unwrap();
        showSnackbar("تم إضافة المنتج بنجاح", "success");
      }
      handleCloseDialog();
    } catch (err) {
      showSnackbar(err.message || "حدث خطأ أثناء الحفظ", "error");
    } finally {
      setSaving(false);
    }
  }, [productForm, products, editRow, dispatch, showSnackbar, handleCloseDialog]);

  const handleDeleteClick = useCallback((product) => {
    setConfirmDialog({
      open: true,
      productId: product.id,
      productName: product.name,
    });
  }, []);

  const handleConfirmDelete = useCallback(async () => {
    setDeleting(true);
    try {
      await dispatch(deleteProduct(confirmDialog.productId)).unwrap();
      showSnackbar("تم حذف المنتج بنجاح", "info");
      setConfirmDialog({ open: false, productId: null, productName: "" });
    } catch (err) {
      showSnackbar(err.message || "حدث خطأ أثناء الحذف", "error");
    } finally {
      setDeleting(false);
    }
  }, [dispatch, confirmDialog.productId, showSnackbar]);

  // Calculate statistics
  const stats = useMemo(() => {
    const totalProducts = products.length;
    const averagePrice = products.length > 0
      ? products.reduce((sum, p) => sum + parseFloat(p.price || 0), 0) / products.length
      : 0;
    const averageCostPrice = products.length > 0
      ? products.reduce((sum, p) => sum + parseFloat(p.cost_price || 0), 0) / products.length
      : 0;
    const averageMargin = averageCostPrice > 0
      ? ((averagePrice - averageCostPrice) / averageCostPrice) * 100
      : 0;
    const recentlyAdded = products.filter(product => {
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return new Date(product.created_at) > weekAgo;
    }).length;

    return {
      total: totalProducts,
      averagePrice: averagePrice.toFixed(2),
      averageMargin: averageMargin.toFixed(1),
      recentlyAdded,
    };
  }, [products]);

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
      header: "اسم المنتج",
      Cell: ({ cell }) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <InventoryIcon fontSize="small" color="action" />
          <Typography variant="body2" fontWeight="medium">
            {cell.getValue()}
          </Typography>
        </Box>
      ),
    },
    {
      accessorKey: "price",
      header: "سعر البيع",
      Cell: ({ cell }) => (
        <Typography variant="body2" fontWeight="bold" color="success.main">
          {parseFloat(cell.getValue() || 0).toLocaleString('ar-EG', {
            style: 'currency',
            currency: 'EGP',
            minimumFractionDigits: 2,
          })}
        </Typography>
      ),
    },
    {
      accessorKey: "cost_price",
      header: "سعر التكلفة",
      Cell: ({ cell }) => (
        <Typography variant="body2" color="text.secondary">
          {parseFloat(cell.getValue() || 0).toLocaleString('ar-EG', {
            style: 'currency',
            currency: 'EGP',
            minimumFractionDigits: 2,
          })}
        </Typography>
      ),
    },
    {
      accessorKey: "profit_margin",
      header: "هامش الربح",
      Cell: ({ row }) => (
        <ProfitMargin
          price={row.original.price}
          costPrice={row.original.cost_price}
        />
      ),
    },
    {
      accessorKey: "unit",
      header: "الوحدة",
      Cell: ({ row }) => {
        const unit = row.original.unit;
        return unit ? (
          <Chip
            label={unit.name}
            size="small"
            variant="outlined"
            icon={<CategoryIcon />}
          />
        ) : (
          <Typography variant="body2" color="text.disabled">
            غير محدد
          </Typography>
        );
      },
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
                <InventoryIcon fontSize="large" />
                إدارة المنتجات
              </Typography>
              <Typography variant="body1" sx={{ opacity: 0.9 }}>
                إدارة المنتجات والأسعار وتتبع هوامش الربح
              </Typography>
            </Box>
            <Box textAlign="center">
              <Typography variant="h3" fontWeight="bold">
                {stats.total}
              </Typography>
              <Typography variant="caption">
                إجمالي المنتجات
              </Typography>
            </Box>
          </Stack>
        </CardContent>
      </Card>

      {/* Statistics */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <InventoryIcon color="primary" sx={{ fontSize: 40, mb: 1 }} />
              <Typography variant="h5" color="primary.main" fontWeight="bold">
                {stats.total}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                إجمالي المنتجات
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <MoneyIcon color="success" sx={{ fontSize: 40, mb: 1 }} />
              <Typography variant="h5" color="success.main" fontWeight="bold">
                {stats.averagePrice} ج.م
              </Typography>
              <Typography variant="body2" color="text.secondary">
                متوسط السعر
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <TrendingUpIcon color="info" sx={{ fontSize: 40, mb: 1 }} />
              <Typography variant="h5" color="info.main" fontWeight="bold">
                {stats.averageMargin}%
              </Typography>
              <Typography variant="body2" color="text.secondary">
                متوسط هامش الربح
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <AnalyticsIcon color="warning" sx={{ fontSize: 40, mb: 1 }} />
              <Typography variant="h5" color="warning.main" fontWeight="bold">
                {stats.recentlyAdded}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                مضاف حديثاً
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
          إضافة منتج جديد
        </Button>
      </Box>

      {/* Table */}
      <Card>
        <MaterialReactTable
          {...defaultTableProps}
          columns={columns}
          data={products}
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

          localization={{
            noRecordsToDisplay: 'لا توجد منتجات للعرض',
            search: 'البحث...',
          }}
        />
      </Card>

      {/* Add/Edit Dialog */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="md"
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
            <InventoryIcon />
            {editRow ? "تحديث المنتج" : "إضافة منتج جديد"}
          </Box>
          <IconButton onClick={handleCloseDialog} sx={{ color: 'white' }}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ p: 3 }}>
          <Grid container spacing={2} sx={{ mt: 0.5 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="اسم المنتج"
                value={productForm.formData.name}
                onChange={(e) => productForm.handleFieldChange('name', e.target.value)}
                onBlur={() => productForm.handleFieldBlur('name')}
                error={productForm.touched.name && !!productForm.errors.name}
                helperText={productForm.touched.name && productForm.errors.name}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <InventoryIcon color="action" />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="سعر البيع"
                type="number"
                value={productForm.formData.price}
                onChange={(e) => productForm.handleFieldChange('price', e.target.value)}
                onBlur={() => productForm.handleFieldBlur('price')}
                error={productForm.touched.price && !!productForm.errors.price}
                helperText={productForm.touched.price && productForm.errors.price}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <MoneyIcon color="success" />
                    </InputAdornment>
                  ),
                  endAdornment: <InputAdornment position="end">ج.م</InputAdornment>,
                }}
                inputProps={{ min: 0, step: 0.01 }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="سعر التكلفة"
                type="number"
                value={productForm.formData.cost_price}
                onChange={(e) => productForm.handleFieldChange('cost_price', e.target.value)}
                onBlur={() => productForm.handleFieldBlur('cost_price')}
                error={productForm.touched.cost_price && !!productForm.errors.cost_price}
                helperText={productForm.touched.cost_price && productForm.errors.cost_price}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <MoneyIcon color="action" />
                    </InputAdornment>
                  ),
                  endAdornment: <InputAdornment position="end">ج.م</InputAdornment>,
                }}
                inputProps={{ min: 0, step: 0.01 }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                select
                label="الوحدة"
                value={productForm.formData.unit_id}
                onChange={(e) => productForm.handleFieldChange('unit_id', e.target.value)}
                onBlur={() => productForm.handleFieldBlur('unit_id')}
                error={productForm.touched.unit_id && !!productForm.errors.unit_id}
                helperText={productForm.touched.unit_id && productForm.errors.unit_id}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <CategoryIcon color="action" />
                    </InputAdornment>
                  ),
                }}
              >
                <MenuItem value="">اختر الوحدة</MenuItem>
                {units.map(unit => (
                  <MenuItem key={unit.id} value={unit.id}>
                    {unit.name}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            {/* Profit Margin Preview */}
            {productForm.formData.price && productForm.formData.cost_price && (
              <Grid item xs={12}>
                <Box sx={{
                  p: 2,
                  backgroundColor: 'grey.50',
                  borderRadius: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}>
                  <Typography variant="subtitle2">
                    هامش الربح المتوقع:
                  </Typography>
                  <ProfitMargin
                    price={productForm.formData.price}
                    costPrice={productForm.formData.cost_price}
                  />
                </Box>
              </Grid>
            )}
          </Grid>
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
            disabled={saving || !productForm.isValid}
            startIcon={saving ? <CircularProgress size={16} /> : <AddIcon />}
          >
            {saving ? "جاري الحفظ..." : (editRow ? "تحديث" : "إضافة")}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Confirmation Dialog */}
      <ConfirmationDialog
        open={confirmDialog.open}
        onClose={() => setConfirmDialog({ open: false, productId: null, productName: "" })}
        onConfirm={handleConfirmDelete}
        title="تأكيد الحذف"
        message={`هل أنت متأكد من حذف المنتج "${confirmDialog.productName}"؟ لا يمكن التراجع عن هذا الإجراء.`}
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