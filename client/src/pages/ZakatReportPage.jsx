import React, { useState, useEffect } from 'react';
import {
    Box, Typography, Button, TextField, CircularProgress, Paper,
    Grid, Card, CardContent, Avatar, Table, TableBody, TableCell,
    TableContainer, TableHead, TableRow, Divider
} from '@mui/material';
import {
    Download as DownloadIcon,
    ArrowBack as BackIcon,
    AccountBalanceWallet as ZakatIcon,
    TrendingUp as AssetsIcon,
    TrendingDown as LiabilitiesIcon,
    Calculate as CalcIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import reportsApi from '../api/reportsApi';
import { exportToExcel } from '../utils/exportUtils';

const ZakatReportPage = () => {
    const navigate = useNavigate();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

    const fetchReport = async () => {
        setLoading(true);
        try {
            const res = await reportsApi.getZakatReport({ date: selectedDate });
            setData(res.data);
        } catch (error) {
            console.error('Error fetching zakat report:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReport();
    }, []);

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('ar-EG', { style: 'currency', currency: 'EGP' }).format(amount || 0);
    };

    const handleExport = () => {
        if (!data) return;

        const exportData = [
            { category: 'الأصول المتداولة', amount: data.summary.current_assets },
            ...data.details.current_assets.map(item => ({ category: `  - ${item.name}`, amount: item.balance })),
            { category: 'الخصوم المتداولة', amount: -data.summary.current_liabilities },
            ...data.details.current_liabilities.map(item => ({ category: `  - ${item.name}`, amount: -item.balance })),
            { category: '', amount: '' },
            { category: 'وعاء الزكاة', amount: data.summary.zakat_base },
            { category: `نسبة الزكاة (${data.summary.zakat_rate}%)`, amount: '' },
            { category: 'الزكاة المستحقة', amount: data.summary.zakat_due }
        ];

        const columns = [
            { id: 'category', columnDef: { header: 'البند', size: 200 } },
            { id: 'amount', columnDef: { header: 'المبلغ', size: 150 } }
        ];

        exportToExcel(exportData, columns, `Zakat_Report_${selectedDate}`);
    };

    const StatCard = ({ title, value, icon, color, bg }) => (
        <Card sx={{ borderRadius: 3, boxShadow: '0 4px 12px rgba(0,0,0,0.05)', background: bg || '#fff', border: '1px solid #f0f0f0' }}>
            <CardContent sx={{ display: 'flex', alignItems: 'center', p: 3 }}>
                <Avatar sx={{ bgcolor: color, width: 56, height: 56, mr: 2, boxShadow: 2 }}>{icon}</Avatar>
                <Box>
                    <Typography color="text.secondary" variant="subtitle2" fontWeight="bold">{title}</Typography>
                    <Typography variant="h5" fontWeight="bold" sx={{ mt: 0.5 }}>{value}</Typography>
                </Box>
            </CardContent>
        </Card>
    );

    return (
        <Box p={4} sx={{ background: '#f8f9fa', minHeight: '100vh' }}>
            {/* Header */}
            <Paper sx={{ p: 4, mb: 4, borderRadius: 4, background: 'linear-gradient(135deg, #009688 0%, #00796b 100%)', color: '#fff', boxShadow: '0 8px 32px rgba(0,150,136,0.2)' }}>
                <Grid container alignItems="center" spacing={2}>
                    <Grid item xs>
                        <Typography variant="h3" fontWeight="bold" gutterBottom>تقرير الزكاة</Typography>
                        <Typography variant="subtitle1" sx={{ opacity: 0.9 }}>حساب زكاة المال على الأصول المتداولة</Typography>
                    </Grid>
                    <Grid item>
                        <Button variant="contained" startIcon={<BackIcon />} onClick={() => navigate('/reports-dashboard')} sx={{ bgcolor: 'rgba(255,255,255,0.2)', '&:hover': { bgcolor: 'rgba(255,255,255,0.3)' }, borderRadius: 2, px: 3 }}>رجوع</Button>
                    </Grid>
                </Grid>
                <Box sx={{ mt: 4, p: 2, bgcolor: 'rgba(255,255,255,0.1)', borderRadius: 3, display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
                    <TextField size="small" type="date" label="تاريخ الحساب" InputLabelProps={{ shrink: true }} value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} sx={{ bgcolor: 'white', borderRadius: 1, minWidth: 180 }} />
                    <Button variant="contained" onClick={fetchReport} sx={{ bgcolor: '#fff', color: '#00796b', '&:hover': { bgcolor: '#f0f0f0' }, fontWeight: 'bold', px: 4 }}>حساب الزكاة</Button>
                    {data && (
                        <Button variant="contained" startIcon={<DownloadIcon />} onClick={handleExport} sx={{ bgcolor: '#4caf50', '&:hover': { bgcolor: '#388e3c' }, fontWeight: 'bold', px: 4 }}>تصدير Excel</Button>
                    )}
                </Box>
            </Paper>

            {loading ? (
                <Box display="flex" flexDirection="column" alignItems="center" py={10}>
                    <CircularProgress size={60} thickness={4} />
                    <Typography mt={2} color="text.secondary">جاري حساب الزكاة...</Typography>
                </Box>
            ) : data ? (
                <>
                    {/* KPI Cards */}
                    <Grid container spacing={3} mb={4}>
                        <Grid item xs={12} sm={6} md={3}>
                            <StatCard title="الأصول المتداولة" value={formatCurrency(data.summary.current_assets)} icon={<AssetsIcon />} color="#2196f3" />
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                            <StatCard title="الخصوم المتداولة" value={formatCurrency(data.summary.current_liabilities)} icon={<LiabilitiesIcon />} color="#f44336" />
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                            <StatCard title="وعاء الزكاة" value={formatCurrency(data.summary.zakat_base)} icon={<CalcIcon />} color="#ff9800" />
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                            <StatCard title="الزكاة المستحقة (2.5%)" value={formatCurrency(data.summary.zakat_due)} icon={<ZakatIcon />} color="#009688" bg="#e0f2f1" />
                        </Grid>
                    </Grid>

                    {/* Details */}
                    <Grid container spacing={3}>
                        <Grid item xs={12} md={6}>
                            <Paper sx={{ p: 3, borderRadius: 3, boxShadow: 2 }}>
                                <Typography variant="h6" fontWeight="bold" gutterBottom color="primary">
                                    <AssetsIcon sx={{ verticalAlign: 'middle', mr: 1 }} />
                                    الأصول المتداولة
                                </Typography>
                                <Divider sx={{ my: 2 }} />
                                <TableContainer>
                                    <Table size="small">
                                        <TableHead>
                                            <TableRow>
                                                <TableCell sx={{ fontWeight: 'bold' }}>الحساب</TableCell>
                                                <TableCell align="right" sx={{ fontWeight: 'bold' }}>الرصيد</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {data.details.current_assets.map((item) => (
                                                <TableRow key={item.id}>
                                                    <TableCell>{item.name}</TableCell>
                                                    <TableCell align="right" sx={{ color: 'success.main', fontWeight: 'bold' }}>{formatCurrency(item.balance)}</TableCell>
                                                </TableRow>
                                            ))}
                                            <TableRow sx={{ bgcolor: '#e3f2fd' }}>
                                                <TableCell sx={{ fontWeight: 'bold' }}>الإجمالي</TableCell>
                                                <TableCell align="right" sx={{ fontWeight: 'bold', color: 'primary.main' }}>{formatCurrency(data.summary.current_assets)}</TableCell>
                                            </TableRow>
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </Paper>
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <Paper sx={{ p: 3, borderRadius: 3, boxShadow: 2 }}>
                                <Typography variant="h6" fontWeight="bold" gutterBottom color="error">
                                    <LiabilitiesIcon sx={{ verticalAlign: 'middle', mr: 1 }} />
                                    الخصوم المتداولة
                                </Typography>
                                <Divider sx={{ my: 2 }} />
                                <TableContainer>
                                    <Table size="small">
                                        <TableHead>
                                            <TableRow>
                                                <TableCell sx={{ fontWeight: 'bold' }}>الحساب</TableCell>
                                                <TableCell align="right" sx={{ fontWeight: 'bold' }}>الرصيد</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {data.details.current_liabilities.map((item) => (
                                                <TableRow key={item.id}>
                                                    <TableCell>{item.name}</TableCell>
                                                    <TableCell align="right" sx={{ color: 'error.main', fontWeight: 'bold' }}>{formatCurrency(item.balance)}</TableCell>
                                                </TableRow>
                                            ))}
                                            <TableRow sx={{ bgcolor: '#ffebee' }}>
                                                <TableCell sx={{ fontWeight: 'bold' }}>الإجمالي</TableCell>
                                                <TableCell align="right" sx={{ fontWeight: 'bold', color: 'error.main' }}>{formatCurrency(data.summary.current_liabilities)}</TableCell>
                                            </TableRow>
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </Paper>
                        </Grid>
                    </Grid>

                    {/* Summary */}
                    <Paper sx={{ mt: 4, p: 4, borderRadius: 3, boxShadow: 3, background: 'linear-gradient(135deg, #e0f2f1 0%, #b2dfdb 100%)' }}>
                        <Typography variant="h5" fontWeight="bold" gutterBottom textAlign="center" color="#00796b">
                            <ZakatIcon sx={{ verticalAlign: 'middle', mr: 1, fontSize: 32 }} />
                            ملخص حساب الزكاة
                        </Typography>
                        <Divider sx={{ my: 3 }} />
                        <Grid container spacing={2} justifyContent="center">
                            <Grid item xs={12} md={8}>
                                <Table>
                                    <TableBody>
                                        <TableRow>
                                            <TableCell sx={{ fontSize: 18 }}>إجمالي الأصول المتداولة</TableCell>
                                            <TableCell align="right" sx={{ fontSize: 18, fontWeight: 'bold', color: '#2196f3' }}>{formatCurrency(data.summary.current_assets)}</TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell sx={{ fontSize: 18 }}>(-) إجمالي الخصوم المتداولة</TableCell>
                                            <TableCell align="right" sx={{ fontSize: 18, fontWeight: 'bold', color: '#f44336' }}>{formatCurrency(data.summary.current_liabilities)}</TableCell>
                                        </TableRow>
                                        <TableRow sx={{ bgcolor: '#fff' }}>
                                            <TableCell sx={{ fontSize: 20, fontWeight: 'bold' }}>(=) وعاء الزكاة</TableCell>
                                            <TableCell align="right" sx={{ fontSize: 20, fontWeight: 'bold', color: '#ff9800' }}>{formatCurrency(data.summary.zakat_base)}</TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell sx={{ fontSize: 18 }}>(×) نسبة الزكاة</TableCell>
                                            <TableCell align="right" sx={{ fontSize: 18, fontWeight: 'bold' }}>{data.summary.zakat_rate}%</TableCell>
                                        </TableRow>
                                        <TableRow sx={{ bgcolor: '#009688' }}>
                                            <TableCell sx={{ fontSize: 22, fontWeight: 'bold', color: '#fff' }}>(=) الزكاة المستحقة</TableCell>
                                            <TableCell align="right" sx={{ fontSize: 22, fontWeight: 'bold', color: '#fff' }}>{formatCurrency(data.summary.zakat_due)}</TableCell>
                                        </TableRow>
                                    </TableBody>
                                </Table>
                            </Grid>
                        </Grid>
                    </Paper>
                </>
            ) : null}
        </Box>
    );
};

export default ZakatReportPage;
