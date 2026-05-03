import React, { useState, useEffect } from 'react';
import {
    Container, Typography, Box, Button, Table, TableBody, TableCell,
    TableContainer, TableHead, TableRow, Paper, IconButton, Dialog,
    DialogTitle, DialogContent, DialogActions, TextField, Switch, FormControlLabel,
    Grid, Autocomplete, TablePagination, Snackbar, Alert
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon, Add as AddIcon } from '@mui/icons-material';
import { offerKitsApi } from '../api/offerKitsApi';
import productsApi from '../api/productsApi';
import dayjs from 'dayjs';

const OfferKitsPage = () => {
    const [offerKits, setOfferKits] = useState([]);
    const [products, setProducts] = useState([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [editingKit, setEditingKit] = useState(null);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

    const enqueueSnackbar = (message, { variant }) => {
        setSnackbar({ open: true, message, severity: variant || 'success' });
    };

    const handleCloseSnackbar = () => {
        setSnackbar({ ...snackbar, open: false });
    };

    // Pagination state
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    const [formData, setFormData] = useState({
        name: '',
        description: '',
        active: true,
        start_date: '',
        end_date: '',
        items: []
    });

    useEffect(() => {
        fetchOfferKits();
        fetchProducts();
    }, []);

    const fetchOfferKits = async () => {
        try {
            const data = await offerKitsApi.getAll();
            setOfferKits(data);
        } catch (error) {
            enqueueSnackbar('Error fetching offer kits', { variant: 'error' });
        }
    };

    const fetchProducts = async () => {
        try {
            const response = await productsApi.getAll();
            setProducts(response.data || []);
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    };

    const handleOpenDialog = (kit = null) => {
        if (kit) {
            setEditingKit(kit);
            setFormData({
                name: kit.name,
                description: kit.description || '',
                active: kit.active,
                start_date: kit.start_date || '',
                end_date: kit.end_date || '',
                items: kit.items.map(item => ({
                    ...item,
                    product: item.product // Ensure product object is preserved for autocomplete
                }))
            });
        } else {
            setEditingKit(null);
            setFormData({
                name: '',
                description: '',
                active: true,
                start_date: '',
                end_date: '',
                items: []
            });
        }
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
    };

    const handleSave = async () => {
        if (!formData.name) {
            enqueueSnackbar('Name is required', { variant: 'warning' });
            return;
        }
        if (formData.items.length === 0) {
            enqueueSnackbar('At least one item is required', { variant: 'warning' });
            return;
        }

        try {
            const payload = {
                ...formData,
                items: formData.items.map(item => ({
                    product_id: item.product?.id || item.product_id,
                    quantity: Number(item.quantity),
                    special_price: Number(item.special_price)
                }))
            };

            if (editingKit) {
                await offerKitsApi.update(editingKit.id, payload);
                enqueueSnackbar('Offer kit updated successfully', { variant: 'success' });
            } else {
                await offerKitsApi.create(payload);
                enqueueSnackbar('Offer kit created successfully', { variant: 'success' });
            }
            fetchOfferKits();
            handleCloseDialog();
        } catch (error) {
            enqueueSnackbar(error.response?.data?.message || 'Error saving offer kit', { variant: 'error' });
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this offer kit?')) {
            try {
                await offerKitsApi.delete(id);
                enqueueSnackbar('Offer kit deleted successfully', { variant: 'success' });
                fetchOfferKits();
            } catch (error) {
                enqueueSnackbar('Error deleting offer kit', { variant: 'error' });
            }
        }
    };

    const handleAddItem = () => {
        setFormData({
            ...formData,
            items: [...formData.items, { product: null, quantity: 1, special_price: 0 }]
        });
    };

    const handleRemoveItem = (index) => {
        const newItems = [...formData.items];
        newItems.splice(index, 1);
        setFormData({ ...formData, items: newItems });
    };

    const handleItemChange = (index, field, value) => {
        const newItems = [...formData.items];
        newItems[index][field] = value;
        
        // Auto set special_price to original price when product is selected initially
        if (field === 'product' && value) {
             newItems[index].special_price = value.price || 0;
        }
        
        setFormData({ ...formData, items: newItems });
    };

    // Pagination handlers
    const handleChangePage = (event, newPage) => setPage(newPage);
    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const paginatedKits = offerKits.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);


    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Typography variant="h4">العروض الترويجية (Offer Kits)</Typography>
                <Button variant="contained" color="primary" startIcon={<AddIcon />} onClick={() => handleOpenDialog()}>
                    إضافة عرض جديد
                </Button>
            </Box>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>اسم العرض</TableCell>
                            <TableCell>الوصف</TableCell>
                            <TableCell>الحالة</TableCell>
                            <TableCell>المنتجات المشمولة</TableCell>
                            <TableCell>إجمالي السعر المخفض</TableCell>
                            <TableCell align="center">الإجراءات</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {paginatedKits.map((kit) => (
                            <TableRow key={kit.id}>
                                <TableCell>{kit.name}</TableCell>
                                <TableCell>{kit.description}</TableCell>
                                <TableCell>{kit.active ? 'مفعل' : 'موقف'}</TableCell>
                                <TableCell>
                                    {kit.items?.map(i => `${i.product?.name} (x${i.quantity})`).join(' + ')}
                                </TableCell>
                                <TableCell>
                                    {kit.items?.reduce((sum, item) => sum + (Number(item.special_price) * Number(item.quantity)), 0).toFixed(2)}
                                </TableCell>
                                <TableCell align="center">
                                    <IconButton color="primary" onClick={() => handleOpenDialog(kit)}>
                                        <EditIcon />
                                    </IconButton>
                                    <IconButton color="error" onClick={() => handleDelete(kit.id)}>
                                        <DeleteIcon />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                <TablePagination
                    component="div"
                    count={offerKits.length}
                    page={page}
                    onPageChange={handleChangePage}
                    rowsPerPage={rowsPerPage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                    labelRowsPerPage="الصفوف في الصفحة:"
                />
            </TableContainer>

            <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
                <DialogTitle>{editingKit ? 'تعديل العرض الترويجي' : 'إضافة عرض جديد'}</DialogTitle>
                <DialogContent>
                    <Grid container spacing={2} sx={{ mt: 1 }}>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="اسم العرض"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                required
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={formData.active}
                                        onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                                    />
                                }
                                label="مفعل"
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="الوصف"
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                multiline
                                rows={2}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                type="date"
                                label="تاريخ البداية (اختياري)"
                                InputLabelProps={{ shrink: true }}
                                value={formData.start_date ? dayjs(formData.start_date).format('YYYY-MM-DD') : ''}
                                onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                type="date"
                                label="تاريخ النهاية (اختياري)"
                                InputLabelProps={{ shrink: true }}
                                value={formData.end_date ? dayjs(formData.end_date).format('YYYY-MM-DD') : ''}
                                onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                            />
                        </Grid>
                    </Grid>

                    <Box sx={{ mt: 4 }}>
                        <Typography variant="h6" mb={2}>مكونات العرض</Typography>
                        <TableContainer component={Paper} variant="outlined">
                            <Table size="small">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>المنتج</TableCell>
                                        <TableCell width="15%">السعر الأساسي</TableCell>
                                        <TableCell width="15%">الكمية</TableCell>
                                        <TableCell width="20%">السعر الخاص للوحدة داخل العرض</TableCell>
                                        <TableCell width="10%">حذف</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {formData.items.map((item, index) => (
                                        <TableRow key={index}>
                                            <TableCell>
                                                <Autocomplete
                                                    options={products}
                                                    getOptionLabel={(option) => option.name || ''}
                                                    value={item.product || null}
                                                    onChange={(_, newValue) => handleItemChange(index, 'product', newValue)}
                                                    renderInput={(params) => <TextField {...params} variant="standard" />}
                                                    isOptionEqualToValue={(option, value) => option.id === value?.id}
                                                />
                                            </TableCell>
                                            <TableCell>
                                                {item.product ? Number(item.product.price).toFixed(2) : '-'}
                                            </TableCell>
                                            <TableCell>
                                                <TextField
                                                    type="number"
                                                    variant="standard"
                                                    value={item.quantity}
                                                    onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                                                    inputProps={{ min: 0.1, step: 0.1 }}
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <TextField
                                                    type="number"
                                                    variant="standard"
                                                    value={item.special_price}
                                                    onChange={(e) => handleItemChange(index, 'special_price', e.target.value)}
                                                    inputProps={{ min: 0, step: 0.1 }}
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <IconButton size="small" color="error" onClick={() => handleRemoveItem(index)}>
                                                    <DeleteIcon />
                                                </IconButton>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                        <Button startIcon={<AddIcon />} onClick={handleAddItem} sx={{ mt: 1 }}>
                            إضافة منتج
                        </Button>
                        <Box sx={{ mt: 2, textAlign: 'right' }}>
                            <Typography variant="subtitle1" fontWeight="bold">
                                إجمالي العرض: {formData.items.reduce((sum, item) => sum + (Number(item.special_price) * Number(item.quantity)), 0).toFixed(2)}
                            </Typography>
                        </Box>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog}>إلغاء</Button>
                    <Button onClick={handleSave} variant="contained" color="primary">
                        حفظ العرض
                    </Button>
                </DialogActions>
            </Dialog>

            <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={handleCloseSnackbar}>
                <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Container>
    );
};

export default OfferKitsPage;
