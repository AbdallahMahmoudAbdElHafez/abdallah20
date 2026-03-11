import React from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Grid,
    Typography,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Chip,
    Box,
    Divider,
    IconButton
} from '@mui/material';
import {
    Close as CloseIcon,
} from '@mui/icons-material';

const IssueVoucherReturnDetails = ({ open, onClose, returnData, onStatusUpdate }) => {
    if (!returnData) return null;

    const getStatusColor = (status) => {
        const colors = {
            draft: 'default',
            approved: 'success',
            posted: 'info',
            cancelled: 'error'
        };
        return colors[status] || 'default';
    };

    const getStatusLabel = (status) => {
        const labels = {
            draft: 'مسودة',
            approved: 'معتمد',
            posted: 'مرحل',
            cancelled: 'ملغي'
        };
        return labels[status] || status;
    };

    const totalAmount = returnData.items?.reduce((sum, item) => {
        return sum + (parseFloat(item.quantity) * parseFloat(item.cost_per_unit || 0));
    }, 0) || 0;

    const handleStatusUpdate = (newStatus) => {
        const statusLabels = { approved: 'اعتماد', posted: 'ترحيل', cancelled: 'إلغاء' };
        if (window.confirm(`هل أنت متأكد من ${statusLabels[newStatus]} هذا المرتجع؟`)) {
            onStatusUpdate(returnData.id, newStatus);
            onClose();
        }
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
            <DialogTitle>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography variant="h6">
                        تفاصيل المرتجع - {returnData.return_no}
                    </Typography>
                    <IconButton onClick={onClose}>
                        <CloseIcon />
                    </IconButton>
                </Box>
            </DialogTitle>

            <DialogContent>
                <Grid container spacing={3}>
                    {/* Header Info */}
                    <Grid item xs={12}>
                        <Paper sx={{ p: 3 }}>
                            <Grid container spacing={3}>
                                <Grid item xs={12} md={6}>
                                    <Typography variant="h6" gutterBottom>معلومات المرتجع</Typography>
                                    <Grid container spacing={2}>
                                        <Grid item xs={4}>
                                            <Typography variant="body2" color="textSecondary">رقم المرتجع:</Typography>
                                        </Grid>
                                        <Grid item xs={8}>
                                            <Typography variant="body1">{returnData.return_no}</Typography>
                                        </Grid>

                                        <Grid item xs={4}>
                                            <Typography variant="body2" color="textSecondary">اذن الصرف:</Typography>
                                        </Grid>
                                        <Grid item xs={8}>
                                            <Typography variant="body1">{returnData.issue_voucher?.voucher_no || 'N/A'}</Typography>
                                        </Grid>

                                        <Grid item xs={4}>
                                            <Typography variant="body2" color="textSecondary">الحالة:</Typography>
                                        </Grid>
                                        <Grid item xs={8}>
                                            <Chip
                                                label={getStatusLabel(returnData.status)}
                                                color={getStatusColor(returnData.status)}
                                                size="small"
                                            />
                                        </Grid>

                                        <Grid item xs={4}>
                                            <Typography variant="body2" color="textSecondary">تاريخ المرتجع:</Typography>
                                        </Grid>
                                        <Grid item xs={8}>
                                            <Typography variant="body1">{returnData.return_date}</Typography>
                                        </Grid>
                                    </Grid>
                                </Grid>

                                <Grid item xs={12} md={6}>
                                    <Typography variant="h6" gutterBottom>معلومات إضافية</Typography>
                                    <Grid container spacing={2}>
                                        <Grid item xs={4}>
                                            <Typography variant="body2" color="textSecondary">المخزن:</Typography>
                                        </Grid>
                                        <Grid item xs={8}>
                                            <Typography variant="body1">{returnData.warehouse?.name || 'N/A'}</Typography>
                                        </Grid>

                                        <Grid item xs={4}>
                                            <Typography variant="body2" color="textSecondary">الموظف:</Typography>
                                        </Grid>
                                        <Grid item xs={8}>
                                            <Typography variant="body1">{returnData.employee?.name || 'N/A'}</Typography>
                                        </Grid>

                                        <Grid item xs={4}>
                                            <Typography variant="body2" color="textSecondary">الموافق:</Typography>
                                        </Grid>
                                        <Grid item xs={8}>
                                            <Typography variant="body1">{returnData.approver?.name || 'N/A'}</Typography>
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </Grid>

                            {returnData.note && (
                                <>
                                    <Divider sx={{ my: 2 }} />
                                    <Typography variant="body2" color="textSecondary">ملاحظة:</Typography>
                                    <Typography variant="body1">{returnData.note}</Typography>
                                </>
                            )}
                        </Paper>
                    </Grid>

                    {/* Items */}
                    <Grid item xs={12}>
                        <Typography variant="h6" gutterBottom>تفاصيل الأصناف</Typography>
                        <TableContainer component={Paper}>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>#</TableCell>
                                        <TableCell>المنتج</TableCell>
                                        <TableCell>رقم الدفعة</TableCell>
                                        <TableCell>تاريخ الانتهاء</TableCell>
                                        <TableCell align="right">الكمية الأصلية</TableCell>
                                        <TableCell align="right">الكمية المرتجعة</TableCell>
                                        <TableCell align="right">التكلفة/وحدة</TableCell>
                                        <TableCell align="right">الإجمالي</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {returnData.items?.map((item, index) => (
                                        <TableRow key={item.id}>
                                            <TableCell>{index + 1}</TableCell>
                                            <TableCell>{item.product?.name || 'N/A'}</TableCell>
                                            <TableCell>{item.batch_number || '-'}</TableCell>
                                            <TableCell>{item.expiry_date || '-'}</TableCell>
                                            <TableCell align="right">{item.returned_quantity || 0}</TableCell>
                                            <TableCell align="right">{item.quantity}</TableCell>
                                            <TableCell align="right">{parseFloat(item.cost_per_unit || 0).toFixed(2)}</TableCell>
                                            <TableCell align="right">
                                                {(parseFloat(item.quantity) * parseFloat(item.cost_per_unit || 0)).toFixed(2)}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                    {(!returnData.items || returnData.items.length === 0) && (
                                        <TableRow>
                                            <TableCell colSpan={8} align="center">
                                                لا توجد أصناف
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
                            <Paper sx={{ p: 2, minWidth: 200 }}>
                                <Typography variant="h6" align="right">
                                    الإجمالي: {totalAmount.toFixed(2)}
                                </Typography>
                            </Paper>
                        </Box>
                    </Grid>
                </Grid>
            </DialogContent>

            <DialogActions>
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    {returnData.status === 'draft' && (
                        <Button
                            variant="contained"
                            color="success"
                            onClick={() => handleStatusUpdate('approved')}
                        >
                            اعتماد
                        </Button>
                    )}
                    {returnData.status === 'approved' && (
                        <Button
                            variant="contained"
                            color="info"
                            onClick={() => handleStatusUpdate('posted')}
                        >
                            ترحيل
                        </Button>
                    )}
                    {(returnData.status === 'draft' || returnData.status === 'approved') && (
                        <Button
                            variant="contained"
                            color="error"
                            onClick={() => handleStatusUpdate('cancelled')}
                        >
                            إلغاء
                        </Button>
                    )}
                    <Button onClick={onClose} variant="outlined">
                        إغلاق
                    </Button>
                </Box>
            </DialogActions>
        </Dialog>
    );
};

export default IssueVoucherReturnDetails;
