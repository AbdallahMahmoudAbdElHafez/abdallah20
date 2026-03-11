import React, { useState, useEffect } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    Grid,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Box,
    Typography,
    Alert,
    IconButton,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    CircularProgress,
    Autocomplete
} from '@mui/material';
import {
    Add as AddIcon,
    Delete as DeleteIcon,
    Close as CloseIcon
} from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers';
import { useDispatch, useSelector } from 'react-redux';
import {
    createIssueVoucherReturn,
    updateIssueVoucherReturn,
    fetchVoucherItems,
    clearVoucherItems
} from '../features/issueVoucherReturns/issueVoucherReturnsSlice';
import { fetchIssueVouchers } from '../features/issueVouchers/issueVouchersSlice';
import { fetchWarehouses } from '../features/warehouses/warehousesSlice';
import { fetchEmployees } from '../features/employees/employeesSlice';
import { fetchProducts } from '../features/products/productsSlice';

const IssueVoucherReturnForm = ({ open, onClose, returnData, editMode, onSuccess }) => {
    const dispatch = useDispatch();

    const { loading: returnsLoading, voucherItems } = useSelector(state => state.issueVoucherReturns);
    const { vouchers: issueVouchers, loading: vouchersLoading } = useSelector(state => state.issueVouchers);
    const { items: warehouses, loading: warehousesLoading } = useSelector(state => state.warehouses);
    const { list: employees, loading: employeesLoading } = useSelector(state => state.employees);
    const { items: products, loading: productsLoading } = useSelector(state => state.products);

    const [formData, setFormData] = useState({
        return_no: '',
        issue_voucher_id: '',
        warehouse_id: '',
        return_date: new Date(),
        employee_id: '',
        note: ''
    });

    const [items, setItems] = useState([]);
    const [errors, setErrors] = useState({});
    const [currentItem, setCurrentItem] = useState({
        product_id: '',
        batch_number: '',
        expiry_date: null,
        returned_quantity: 0,
        quantity: '',
        cost_per_unit: ''
    });

    useEffect(() => {
        if (open) {
            dispatch(fetchIssueVouchers());
            dispatch(fetchWarehouses());
            dispatch(fetchEmployees());
            dispatch(fetchProducts());
        }
        return () => {
            dispatch(clearVoucherItems());
        };
    }, [open, dispatch]);

    useEffect(() => {
        if (returnData && editMode) {
            setFormData({
                return_no: returnData.return_no || '',
                issue_voucher_id: returnData.issue_voucher_id || '',
                warehouse_id: returnData.warehouse_id || '',
                return_date: returnData.return_date ? new Date(returnData.return_date) : new Date(),
                employee_id: returnData.employee_id || '',
                note: returnData.note || ''
            });
            setItems(returnData.items?.map(item => ({
                ...item,
                product: item.product,
            })) || []);

            // Load voucher items for editing
            if (returnData.issue_voucher_id) {
                dispatch(fetchVoucherItems(returnData.issue_voucher_id));
            }
        } else {
            setFormData(prev => ({
                ...prev,
                return_no: `IVR-${Date.now()}`
            }));
        }
    }, [returnData, editMode, dispatch]);

    const handleFormChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: '' }));
        }
    };

    const handleVoucherChange = (voucherId) => {
        handleFormChange('issue_voucher_id', voucherId);

        if (voucherId) {
            // Auto-fill warehouse from the selected voucher
            const selectedVoucher = issueVouchers.find(v => v.id === voucherId);
            if (selectedVoucher) {
                handleFormChange('warehouse_id', selectedVoucher.warehouse_id);
            }
            // Fetch voucher items
            dispatch(fetchVoucherItems(voucherId));
            setItems([]);
        } else {
            dispatch(clearVoucherItems());
            setItems([]);
        }
    };

    const handleItemChange = (field, value) => {
        setCurrentItem(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleProductSelect = (productId) => {
        const voucherItem = voucherItems.find(vi => vi.product_id === productId);
        setCurrentItem(prev => ({
            ...prev,
            product_id: productId,
            batch_number: voucherItem?.batch_number || '',
            expiry_date: voucherItem?.expiry_date ? new Date(voucherItem.expiry_date) : null,
            cost_per_unit: voucherItem?.cost_per_unit || '',
            returned_quantity: parseFloat(voucherItem?.quantity || 0),
        }));
    };

    const addItem = () => {
        const newErrors = {};
        if (!currentItem.product_id) newErrors.product_id = 'المنتج مطلوب';
        if (!currentItem.quantity || parseFloat(currentItem.quantity) <= 0) newErrors.quantity = 'الكمية مطلوبة';

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        const selectedProduct = products.find(p => p.id === currentItem.product_id);
        const newItem = {
            id: Date.now(),
            ...currentItem,
            product: selectedProduct,
        };

        setItems(prev => [...prev, newItem]);
        setCurrentItem({
            product_id: '',
            batch_number: '',
            expiry_date: null,
            returned_quantity: 0,
            quantity: '',
            cost_per_unit: ''
        });
        setErrors({});
    };

    const removeItem = (index) => {
        setItems(prev => prev.filter((_, i) => i !== index));
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.return_no) newErrors.return_no = 'رقم المرتجع مطلوب';
        if (!formData.issue_voucher_id) newErrors.issue_voucher_id = 'اذن الصرف مطلوب';
        if (!formData.warehouse_id) newErrors.warehouse_id = 'المخزن مطلوب';
        if (!formData.return_date) newErrors.return_date = 'تاريخ المرتجع مطلوب';
        if (items.length === 0) newErrors.items = 'يجب إضافة صنف واحد على الأقل';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async () => {
        if (!validateForm()) return;

        const submitData = {
            ...formData,
            employee_id: formData.employee_id || null,
            return_date: formData.return_date instanceof Date
                ? formData.return_date.toISOString().split('T')[0]
                : formData.return_date,
            items: items.map(item => ({
                product_id: item.product_id,
                batch_number: item.batch_number || null,
                expiry_date: item.expiry_date
                    ? (typeof item.expiry_date === 'string' ? item.expiry_date : item.expiry_date.toISOString().split('T')[0])
                    : null,
                returned_quantity: parseFloat(item.returned_quantity || 0),
                quantity: parseFloat(item.quantity),
                cost_per_unit: parseFloat(item.cost_per_unit || 0),
            }))
        };

        try {
            if (editMode) {
                await dispatch(updateIssueVoucherReturn({ id: returnData.id, data: submitData })).unwrap();
            } else {
                await dispatch(createIssueVoucherReturn(submitData)).unwrap();
            }
            onSuccess();
        } catch (error) {
            console.error('Failed to save return:', error);
        }
    };

    const totalAmount = items.reduce((sum, item) => {
        return sum + (parseFloat(item.quantity || 0) * parseFloat(item.cost_per_unit || 0));
    }, 0);

    const formatDate = (date) => {
        if (!date) return '-';
        if (typeof date === 'string') return date;
        if (date instanceof Date) return date.toLocaleDateString('en-CA');
        return '-';
    };

    const isLoading = vouchersLoading || warehousesLoading || employeesLoading || productsLoading;

    if (isLoading) {
        return (
            <Dialog open={open} onClose={onClose}>
                <DialogContent>
                    <Box display="flex" justifyContent="center" alignItems="center" minHeight={200}>
                        <CircularProgress />
                        <Typography sx={{ ml: 2 }}>جاري تحميل البيانات...</Typography>
                    </Box>
                </DialogContent>
            </Dialog>
        );
    }

    // Filter available products from the voucher items
    const availableProducts = voucherItems.length > 0
        ? products.filter(p => voucherItems.some(vi => vi.product_id === p.id))
        : products;

    return (
        <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
            <DialogTitle>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography variant="h6">
                        {editMode ? 'تعديل مرتجع اذن صرف' : 'إنشاء مرتجع اذن صرف'}
                    </Typography>
                    <IconButton onClick={onClose}>
                        <CloseIcon />
                    </IconButton>
                </Box>
            </DialogTitle>

            <DialogContent>
                <Grid container spacing={3} sx={{ mt: 1 }}>
                    {/* Basic Info */}
                    <Grid item xs={12}>
                        <Typography variant="h6" gutterBottom>المعلومات الأساسية</Typography>
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <TextField
                            fullWidth
                            label="رقم المرتجع"
                            value={formData.return_no}
                            onChange={(e) => handleFormChange('return_no', e.target.value)}
                            error={!!errors.return_no}
                            helperText={errors.return_no}
                            disabled={editMode}
                        />
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <FormControl fullWidth error={!!errors.issue_voucher_id}>
                            <InputLabel>اذن الصرف</InputLabel>
                            <Select
                                value={formData.issue_voucher_id}
                                label="اذن الصرف"
                                onChange={(e) => handleVoucherChange(e.target.value)}
                            >
                                <MenuItem value="">اختر اذن صرف</MenuItem>
                                {issueVouchers
                                    .filter(v => v.status === 'posted' || v.status === 'approved')
                                    .map(v => (
                                        <MenuItem key={v.id} value={v.id}>
                                            {v.voucher_no} - {v.issue_date}
                                        </MenuItem>
                                    ))}
                            </Select>
                            {errors.issue_voucher_id && <Typography color="error" variant="caption">{errors.issue_voucher_id}</Typography>}
                        </FormControl>
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <FormControl fullWidth error={!!errors.warehouse_id}>
                            <InputLabel>المخزن</InputLabel>
                            <Select
                                value={formData.warehouse_id}
                                label="المخزن"
                                onChange={(e) => handleFormChange('warehouse_id', e.target.value)}
                            >
                                {warehouses.map(wh => (
                                    <MenuItem key={wh.id} value={wh.id}>
                                        {wh.name}
                                    </MenuItem>
                                ))}
                            </Select>
                            {errors.warehouse_id && <Typography color="error" variant="caption">{errors.warehouse_id}</Typography>}
                        </FormControl>
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <FormControl fullWidth>
                            <InputLabel>الموظف</InputLabel>
                            <Select
                                value={formData.employee_id}
                                label="الموظف"
                                onChange={(e) => handleFormChange('employee_id', e.target.value)}
                            >
                                <MenuItem value="">بدون</MenuItem>
                                {employees.map(emp => (
                                    <MenuItem key={emp.id} value={emp.id}>
                                        {emp.name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <DatePicker
                            label="تاريخ المرتجع"
                            value={formData.return_date}
                            onChange={(date) => handleFormChange('return_date', date)}
                            slotProps={{
                                textField: {
                                    fullWidth: true,
                                    error: !!errors.return_date,
                                    helperText: errors.return_date
                                }
                            }}
                        />
                    </Grid>

                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            label="ملاحظة"
                            multiline
                            rows={2}
                            value={formData.note}
                            onChange={(e) => handleFormChange('note', e.target.value)}
                        />
                    </Grid>

                    {/* Items Section */}
                    <Grid item xs={12}>
                        <Typography variant="h6" gutterBottom>الأصناف</Typography>
                        {errors.items && (
                            <Alert severity="error" sx={{ mb: 2 }}>
                                {errors.items}
                            </Alert>
                        )}
                    </Grid>

                    {/* Add Item Form */}
                    <Grid item xs={12}>
                        <Paper sx={{ p: 2, mb: 2 }}>
                            <Grid container spacing={2} alignItems="center">
                                <Grid item xs={12} md={3}>
                                    <FormControl fullWidth error={!!errors.product_id}>
                                        <InputLabel>المنتج</InputLabel>
                                        <Select
                                            value={currentItem.product_id}
                                            label="المنتج"
                                            onChange={(e) => handleProductSelect(e.target.value)}
                                        >
                                            {availableProducts.map(product => (
                                                <MenuItem key={product.id} value={product.id}>
                                                    {product.name}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </Grid>

                                <Grid item xs={6} md={2}>
                                    <TextField
                                        fullWidth
                                        label="رقم الدفعة"
                                        value={currentItem.batch_number}
                                        onChange={(e) => handleItemChange('batch_number', e.target.value)}
                                        disabled
                                    />
                                </Grid>

                                <Grid item xs={6} md={1.5}>
                                    <TextField
                                        fullWidth
                                        label="الكمية الأصلية"
                                        type="number"
                                        value={currentItem.returned_quantity}
                                        disabled
                                    />
                                </Grid>

                                <Grid item xs={6} md={1.5}>
                                    <TextField
                                        fullWidth
                                        label="الكمية المرتجعة"
                                        type="number"
                                        value={currentItem.quantity}
                                        onChange={(e) => handleItemChange('quantity', e.target.value)}
                                        error={!!errors.quantity}
                                        helperText={errors.quantity}
                                    />
                                </Grid>

                                <Grid item xs={6} md={1.5}>
                                    <TextField
                                        fullWidth
                                        label="التكلفة"
                                        type="number"
                                        value={currentItem.cost_per_unit}
                                        onChange={(e) => handleItemChange('cost_per_unit', e.target.value)}
                                    />
                                </Grid>

                                <Grid item xs={12} md={1.5}>
                                    <Button
                                        fullWidth
                                        variant="contained"
                                        startIcon={<AddIcon />}
                                        onClick={addItem}
                                    >
                                        إضافة
                                    </Button>
                                </Grid>
                            </Grid>
                        </Paper>
                    </Grid>

                    {/* Items Table */}
                    <Grid item xs={12}>
                        <TableContainer component={Paper}>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>المنتج</TableCell>
                                        <TableCell>رقم الدفعة</TableCell>
                                        <TableCell>تاريخ الانتهاء</TableCell>
                                        <TableCell align="right">الكمية الأصلية</TableCell>
                                        <TableCell align="right">الكمية المرتجعة</TableCell>
                                        <TableCell align="right">التكلفة</TableCell>
                                        <TableCell align="right">الإجمالي</TableCell>
                                        <TableCell>إجراءات</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {items.map((item, index) => (
                                        <TableRow key={item.id || index}>
                                            <TableCell>{item.product?.name || 'N/A'}</TableCell>
                                            <TableCell>{item.batch_number || '-'}</TableCell>
                                            <TableCell>{formatDate(item.expiry_date)}</TableCell>
                                            <TableCell align="right">{item.returned_quantity || 0}</TableCell>
                                            <TableCell align="right">{item.quantity}</TableCell>
                                            <TableCell align="right">{parseFloat(item.cost_per_unit || 0).toFixed(2)}</TableCell>
                                            <TableCell align="right">
                                                {((item.quantity || 0) * (item.cost_per_unit || 0)).toFixed(2)}
                                            </TableCell>
                                            <TableCell>
                                                <IconButton
                                                    size="small"
                                                    color="error"
                                                    onClick={() => removeItem(index)}
                                                >
                                                    <DeleteIcon />
                                                </IconButton>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                    {items.length === 0 && (
                                        <TableRow>
                                            <TableCell colSpan={8} align="center">
                                                لا توجد أصناف مضافة
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Grid>

                    {/* Total */}
                    <Grid item xs={12}>
                        <Box display="flex" justifyContent="flex-end">
                            <Typography variant="h6">
                                الإجمالي: {totalAmount.toFixed(2)}
                            </Typography>
                        </Box>
                    </Grid>
                </Grid>
            </DialogContent>

            <DialogActions>
                <Button onClick={onClose} disabled={returnsLoading}>
                    إلغاء
                </Button>
                <Button
                    onClick={handleSubmit}
                    variant="contained"
                    disabled={returnsLoading}
                >
                    {returnsLoading ? 'جاري الحفظ...' : (editMode ? 'تحديث' : 'إنشاء')}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default IssueVoucherReturnForm;
