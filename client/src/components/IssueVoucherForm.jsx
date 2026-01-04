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
  CircularProgress
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Close as CloseIcon
} from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers';
import { useDispatch, useSelector } from 'react-redux';
import { createIssueVoucher, updateIssueVoucher } from '../features/issueVouchers/issueVouchersSlice';

// استيراد الـ actions للبيانات الثابتة
import { fetchProducts } from '../features/products/productsSlice';
import { fetchWarehouses } from '../features/warehouses/warehousesSlice';
import { fetchEmployees } from '../features/employees/employeesSlice';
import { fetchParties } from '../features/parties/partiesSlice';
import { fetchAccounts } from '../features/accounts/accountsSlice';
import { fetchDoctors } from '../features/doctors/doctorsSlice';
import inventoryTransactionBatchesApi from '../api/inventoryTransactionBatchesApi';

const IssueVoucherForm = ({ open, onClose, voucher, editMode, onSuccess }) => {
  const dispatch = useDispatch();

  // الحصول على البيانات من الـ store
  const { loading: vouchersLoading } = useSelector(state => state.issueVouchers);
  const { items: products, loading: productsLoading } = useSelector(state => state.products);
  const { items: warehouses, loading: warehousesLoading } = useSelector(state => state.warehouses);
  const { list: employees, loading: employeesLoading } = useSelector(state => state.employees);
  const { items: parties, loading: partiesLoading } = useSelector(state => state.parties);
  const { items: accounts, loading: accountsLoading } = useSelector(state => state.accounts);
  const { list: doctors, loading: doctorsLoading } = useSelector(state => state.doctors);

  const [formData, setFormData] = useState({
    voucher_no: '',
    party_id: '',
    employee_id: '',
    doctor_id: '',
    warehouse_id: '',
    account_id: '',
    issue_date: new Date(),
    note: ''
  });

  const [items, setItems] = useState([]);
  const [errors, setErrors] = useState({});
  const [currentItem, setCurrentItem] = useState({
    product_id: '',
    batch_number: '',
    expiry_date: null,
    quantity: '',
    cost_per_unit: '',
    note: ''
  });


  useEffect(() => {
    if (open) {
      // تحميل البيانات الثابتة عند فتح النموذج
      dispatch(fetchProducts());
      dispatch(fetchWarehouses());
      dispatch(fetchEmployees());
      dispatch(fetchParties());
      dispatch(fetchAccounts());
      dispatch(fetchDoctors());
    }
  }, [open, dispatch]);

  useEffect(() => {
    if (voucher && editMode) {
      setFormData({
        voucher_no: voucher.voucher_no || '',
        party_id: voucher.party_id || '',
        employee_id: voucher.employee_id || '',
        doctor_id: voucher.doctor_id || '',
        warehouse_id: voucher.warehouse_id || '',
        account_id: voucher.account_id || '',
        issue_date: voucher.issue_date ? new Date(voucher.issue_date) : new Date(),
        note: voucher.note || ''
      });
      setItems(voucher.items || []);
    } else {
      // توليد رقم سند تلقائي
      setFormData(prev => ({
        ...prev,
        voucher_no: `IV-${Date.now()}`
      }));
    }
  }, [voucher, editMode]);

  // Fetch products when warehouse changes
  useEffect(() => {
    if (formData.warehouse_id) {
      dispatch(fetchProducts({ warehouse_id: formData.warehouse_id }));
    }
  }, [dispatch, formData.warehouse_id]);

  const handleFormChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleProductChange = async (productId) => {
    const selectedProduct = products.find(p => p.id === productId);

    let cost = 0;
    try {
      const response = await inventoryTransactionBatchesApi.getLatestCost(productId);
      cost = response.data.cost || 0;
    } catch (error) {
      console.error('Error fetching cost:', error);
    }

    setCurrentItem(prev => ({
      ...prev,
      product_id: productId,
      cost_per_unit: cost,
      batch_number: '', // Reset batch when product changes
      expiry_date: null
    }));
  };

  const handleItemChange = (field, value) => {
    setCurrentItem(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const addItem = () => {
    const newErrors = {};

    if (!currentItem.product_id) newErrors.product_id = 'Product is required';
    if (!currentItem.quantity || currentItem.quantity <= 0) newErrors.quantity = 'Valid quantity is required';

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
      quantity: '',
      cost_per_unit: '',
      note: ''
    });
    setErrors({});
  };

  const removeItem = (index) => {
    setItems(prev => prev.filter((_, i) => i !== index));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.voucher_no) newErrors.voucher_no = 'Voucher number is required';
    if (!formData.warehouse_id) newErrors.warehouse_id = 'Warehouse is required';
    if (!formData.account_id) newErrors.account_id = 'Account is required';
    if (!formData.issue_date) newErrors.issue_date = 'Issue date is required';
    if (items.length === 0) newErrors.items = 'At least one item is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    const submitData = {
      ...formData,
      party_id: formData.party_id || null,
      employee_id: formData.employee_id || null,
      doctor_id: formData.doctor_id || null,
      issue_date: formData.issue_date.toISOString().split('T')[0],
      items: items.map(item => ({
        product_id: item.product_id,
        batch_number: item.batch_number,
        expiry_date: item.expiry_date ? item.expiry_date.toISOString().split('T')[0] : null,
        quantity: parseFloat(item.quantity),
        cost_per_unit: parseFloat(item.cost_per_unit || 0),
        note: item.note
      }))
    };

    try {
      if (editMode) {
        await dispatch(updateIssueVoucher({ id: voucher.id, data: submitData })).unwrap();
      } else {
        await dispatch(createIssueVoucher(submitData)).unwrap();
      }
      onSuccess();
    } catch (error) {
      console.error('Failed to save voucher:', error);
    }
  };

  const totalAmount = items.reduce((sum, item) => {
    return sum + (parseFloat(item.quantity) * parseFloat(item.cost_per_unit || 0));
  }, 0);

  // دالة لتحويل التاريخ إلى تنسيق قابل للعرض
  const formatDate = (date) => {
    if (!date) return '-';
    if (typeof date === 'string') return date;
    if (date instanceof Date) {
      return date.toLocaleDateString('en-CA'); // YYYY-MM-DD
    }
    return '-';
  };

  // دالة للتحقق من التحميل
  const isLoading = productsLoading || warehousesLoading || employeesLoading || partiesLoading || accountsLoading || doctorsLoading;

  if (isLoading) {
    return (
      <Dialog open={open} onClose={onClose}>
        <DialogContent>
          <Box display="flex" justifyContent="center" alignItems="center" minHeight={200}>
            <CircularProgress />
            <Typography sx={{ ml: 2 }}>Loading data...</Typography>
          </Box>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">
            {editMode ? 'Edit Issue Voucher' : 'Create Issue Voucher'}
          </Typography>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent>
        <Grid container spacing={3} sx={{ mt: 1 }}>
          {/* معلومات الأساسية */}
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom>Basic Information</Typography>
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Voucher Number"
              value={formData.voucher_no}
              onChange={(e) => handleFormChange('voucher_no', e.target.value)}
              error={!!errors.voucher_no}
              helperText={errors.voucher_no}
              disabled={editMode}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel>Doctor</InputLabel>
              <Select
                value={formData.doctor_id}
                label="Doctor"
                onChange={(e) => handleFormChange('doctor_id', e.target.value)}
              >
                <MenuItem value="">None</MenuItem>
                {doctors.map(doctor => (
                  <MenuItem key={doctor.id} value={doctor.id}>
                    {doctor.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel>Party</InputLabel>
              <Select
                value={formData.party_id}
                label="Party"
                onChange={(e) => handleFormChange('party_id', e.target.value)}
              >
                <MenuItem value="">None</MenuItem>
                {parties.map(party => (
                  <MenuItem key={party.id} value={party.id}>
                    {party.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel>Employee</InputLabel>
              <Select
                value={formData.employee_id}
                label="Employee"
                onChange={(e) => handleFormChange('employee_id', e.target.value)}
              >
                <MenuItem value="">None</MenuItem>
                {employees.map(emp => (
                  <MenuItem key={emp.id} value={emp.id}>
                    {emp.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} md={6}>
            <FormControl fullWidth error={!!errors.warehouse_id}>
              <InputLabel>Warehouse</InputLabel>
              <Select
                value={formData.warehouse_id}
                label="Warehouse"
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
            <FormControl fullWidth error={!!errors.account_id}>
              <InputLabel>Account</InputLabel>
              <Select
                value={formData.account_id}
                label="Account"
                onChange={(e) => handleFormChange('account_id', e.target.value)}
              >
                {accounts.map(acc => (
                  <MenuItem key={acc.id} value={acc.id}>
                    {acc.name}
                  </MenuItem>
                ))}
              </Select>
              {errors.account_id && <Typography color="error" variant="caption">{errors.account_id}</Typography>}
            </FormControl>
          </Grid>

          <Grid item xs={12} md={6}>
            <DatePicker
              label="Issue Date"
              value={formData.issue_date}
              onChange={(date) => handleFormChange('issue_date', date)}
              slotProps={{
                textField: {
                  fullWidth: true,
                  error: !!errors.issue_date,
                  helperText: errors.issue_date
                }
              }}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Note"
              multiline
              rows={2}
              value={formData.note}
              onChange={(e) => handleFormChange('note', e.target.value)}
            />
          </Grid>

          {/* إضافة الأصناف */}
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom>Items</Typography>
            {errors.items && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {errors.items}
              </Alert>
            )}
          </Grid>

          {/* نموذج إضافة صنف */}
          <Grid item xs={12}>
            <Paper sx={{ p: 2, mb: 2 }}>
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={12} md={3}>
                  <FormControl fullWidth error={!!errors.product_id}>
                    <InputLabel>Product</InputLabel>
                    <Select
                      value={currentItem.product_id}
                      label="Product"
                      onChange={(e) => handleProductChange(e.target.value)}
                    >
                      {products.map(product => {
                        const stock = product.current_inventory?.[0]?.quantity || 0;
                        return (
                          <MenuItem
                            key={product.id}
                            value={product.id}
                            disabled={!!(formData.warehouse_id && stock <= 0)}
                          >
                            {product.name} {formData.warehouse_id ? `(Stock: ${stock})` : ''}
                          </MenuItem>
                        );
                      })}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={6} md={1}>
                  <TextField
                    fullWidth
                    label="Batch"
                    value={currentItem.batch_number}
                    onChange={(e) => handleItemChange('batch_number', e.target.value)}
                  />
                </Grid>

                <Grid item xs={6} md={1}>
                  <DatePicker
                    label="Expiry"
                    value={currentItem.expiry_date}
                    onChange={(date) => handleItemChange('expiry_date', date)}
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        error: !!errors.expiry_date
                      }
                    }}
                  />
                </Grid>

                <Grid item xs={6} md={1}>
                  <TextField
                    fullWidth
                    label="Qty"
                    type="number"
                    value={currentItem.quantity}
                    onChange={(e) => handleItemChange('quantity', e.target.value)}
                    error={!!errors.quantity}
                    helperText={errors.quantity}
                  />
                </Grid>

                <Grid item xs={6} md={1}>
                  <TextField
                    fullWidth
                    label="Cost"
                    type="number"
                    value={currentItem.cost_per_unit}
                    onChange={(e) => handleItemChange('cost_per_unit', e.target.value)}
                  />
                </Grid>

                <Grid item xs={12} md={1}>
                  <Button
                    fullWidth
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={addItem}
                  >
                    Add
                  </Button>
                </Grid>
              </Grid>
            </Paper>
          </Grid>

          {/* جدول الأصناف المضافة */}
          <Grid item xs={12}>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Product</TableCell>
                    <TableCell>Batch</TableCell>
                    <TableCell>Expiry</TableCell>
                    <TableCell align="right">Quantity</TableCell>
                    <TableCell align="right">Total</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {items.map((item, index) => (
                    <TableRow key={item.id || index}>
                      <TableCell>{item.product?.name || 'N/A'}</TableCell>
                      <TableCell>{item.batch_number || '-'}</TableCell>
                      <TableCell>{formatDate(item.expiry_date)}</TableCell>
                      <TableCell align="right">{item.quantity}</TableCell>
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
                        No items added
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>

          {/* الإجمالي */}
          <Grid item xs={12}>
            <Box display="flex" justifyContent="flex-end">
              <Typography variant="h6">
                Total Amount: {totalAmount.toFixed(2)}
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} disabled={vouchersLoading}>
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={vouchersLoading}
        >
          {vouchersLoading ? 'Saving...' : (editMode ? 'Update' : 'Create')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default IssueVoucherForm;