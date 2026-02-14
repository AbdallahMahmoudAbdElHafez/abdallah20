import React, { forwardRef } from 'react';
import {
    Box, Typography, Table, TableBody, TableCell,
    TableContainer, TableHead, TableRow, Paper,
    Divider, Grid
} from '@mui/material';

const PrintVoucher = forwardRef(({ voucher }, ref) => {
    if (!voucher) return null;

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('ar-EG', { style: 'currency', currency: 'EGP' }).format(amount || 0);
    };

    return (
        <Box
            ref={ref}
            sx={{
                p: 4,
                bgcolor: 'white',
                color: 'black',
                direction: 'rtl',
                fontFamily: 'Roboto, Arial, sans-serif',
                '@media print': {
                    p: 2,
                    '.no-print': { display: 'none' }
                }
            }}
        >
            {/* Header */}
            <Box sx={{ borderBottom: '3px solid #1a237e', pb: 2, mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                    <Typography variant="h4" fontWeight="bold" color="#1a237e">نوريفينا - NURIVINA</Typography>
                    <Typography variant="subtitle1" color="text.secondary">للمستلزمات الطبية ومستحضرات التجميل</Typography>
                </Box>
                <Box sx={{ textAlign: 'center', border: '2px solid #1a237e', p: 1, px: 3, borderRadius: 2 }}>
                    <Typography variant="h5" fontWeight="bold" color="#1a237e">إذن صرف مخزني</Typography>
                    <Typography variant="h6">#{voucher.voucher_no}</Typography>
                </Box>
            </Box>

            {/* Voucher Info */}
            <Grid container spacing={2} sx={{ mb: 4, p: 2, bgcolor: '#f5f5f5', borderRadius: 2 }}>
                <Grid item xs={6}>
                    <Box sx={{ display: 'flex', mb: 1 }}>
                        <Typography fontWeight="bold" sx={{ minWidth: 100 }}>تاريخ الصرف:</Typography>
                        <Typography>{voucher.issue_date}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', mb: 1 }}>
                        <Typography fontWeight="bold" sx={{ minWidth: 100 }}>المستلم:</Typography>
                        <Typography>{voucher.responsible_employee?.name || 'غير محدد'}</Typography>
                    </Box>
                </Grid>
                <Grid item xs={6}>
                    <Box sx={{ display: 'flex', mb: 1 }}>
                        <Typography fontWeight="bold" sx={{ minWidth: 100 }}>المخزن:</Typography>
                        <Typography>{voucher.warehouse?.name || 'غير محدد'}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', mb: 1 }}>
                        <Typography fontWeight="bold" sx={{ minWidth: 100 }}>الحالة:</Typography>
                        <Typography>{voucher.status === 'approved' ? 'معتمد' : voucher.status === 'posted' ? 'مرحل' : 'مسودة'}</Typography>
                    </Box>
                </Grid>
            </Grid>

            {/* Items Table */}
            <TableContainer component={Box} sx={{ mb: 6 }}>
                <Table size="small" sx={{ border: '1px solid #e0e0e0' }}>
                    <TableHead sx={{ bgcolor: '#1a237e' }}>
                        <TableRow>
                            <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>#</TableCell>
                            <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>اسم المنتج</TableCell>
                            <TableCell sx={{ color: 'white', fontWeight: 'bold' }} align="center">الكمية</TableCell>
                            <TableCell sx={{ color: 'white', fontWeight: 'bold' }} align="center">الوحدة</TableCell>
                            <TableCell sx={{ color: 'white', fontWeight: 'bold' }} align="right">سعر الوحدة</TableCell>
                            <TableCell sx={{ color: 'white', fontWeight: 'bold' }} align="right">الإجمالي</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {voucher.items?.map((item, index) => (
                            <TableRow key={item.id} sx={{ '&:nth-of-type(odd)': { bgcolor: '#fafafa' } }}>
                                <TableCell>{index + 1}</TableCell>
                                <TableCell sx={{ fontWeight: '500' }}>{item.product?.name}</TableCell>
                                <TableCell align="center">{item.quantity}</TableCell>
                                <TableCell align="center">{item.product?.unit?.name || '—'}</TableCell>
                                <TableCell align="right">{formatCurrency(item.cost_per_unit || item.product?.cost_price)}</TableCell>
                                <TableCell align="right" sx={{ fontWeight: 'bold' }}>{formatCurrency(item.total_cost)}</TableCell>
                            </TableRow>
                        ))}
                        <TableRow sx={{ bgcolor: '#eee' }}>
                            <TableCell colSpan={5} align="left" sx={{ fontWeight: 'bold', py: 2 }}>إجمالي القيمة</TableCell>
                            <TableCell align="right" sx={{ fontWeight: 'bold', color: '#d32f2f', py: 2 }}>
                                {formatCurrency(voucher.total_cost || voucher.items?.reduce((sum, i) => sum + i.total_cost, 0))}
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Note Section */}
            {voucher.note && (
                <Box sx={{ mb: 6, p: 2, border: '1px solid #e0e0e0', borderRadius: 2 }}>
                    <Typography fontWeight="bold" gutterBottom>ملاحظات:</Typography>
                    <Typography variant="body2">{voucher.note}</Typography>
                </Box>
            )}

            {/* Signature Section */}
            <Grid container spacing={4} sx={{ mt: 'auto', pt: 4 }}>
                <Grid item xs={4} sx={{ textAlign: 'center' }}>
                    <Divider sx={{ mb: 1, borderColor: '#1a237e' }} />
                    <Typography fontWeight="bold">أمين المخزن</Typography>
                </Grid>
                <Grid item xs={4} sx={{ textAlign: 'center' }}>
                    <Divider sx={{ mb: 1, borderColor: '#1a237e' }} />
                    <Typography fontWeight="bold">توقيع المستلم</Typography>
                </Grid>
                <Grid item xs={4} sx={{ textAlign: 'center' }}>
                    <Divider sx={{ mb: 1, borderColor: '#1a237e' }} />
                    <Typography fontWeight="bold">يعتمد،،</Typography>
                </Grid>
            </Grid>

            {/* Footer */}
            <Box sx={{ mt: 8, pt: 2, borderTop: '1px solid #eee', textAlign: 'center' }}>
                <Typography variant="caption" color="text.secondary">
                    تمت الطباعة بواسطة النظام في {new Date().toLocaleString('ar-EG')}
                </Typography>
            </Box>
        </Box>
    );
});

export default PrintVoucher;
