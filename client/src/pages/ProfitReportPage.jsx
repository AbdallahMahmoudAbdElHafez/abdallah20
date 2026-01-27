import React, { useState, useEffect } from 'react';
import {
    Box, Typography, Button, TextField, CircularProgress, Paper,
    Grid, Card, CardContent, Avatar, Table, TableBody, TableCell,
    TableContainer, TableHead, TableRow, Divider
} from '@mui/material';
import {
    Download as DownloadIcon,
    ArrowBack as BackIcon,
    TrendingUp as RevenueIcon,
    TrendingDown as ExpenseIcon,
    AccountBalance as ProfitIcon,
    Calculate as CalcIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import reportsApi from '../api/reportsApi';
import { exportToExcel } from '../utils/exportUtils';

const ProfitReportPage = () => {
    const navigate = useNavigate();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [startDate, setStartDate] = useState(new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0]);
    const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);

    const fetchReport = async () => {
        setLoading(true);
        try {
            const res = await reportsApi.getProfitReport({ startDate, endDate });
            setData(res.data);
        } catch (error) {
            console.error('Error fetching profit report:', error);
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
            { category: 'الإيرادات', amount: data.summary.total_revenue },
            ...data.details.revenue.map(item => ({ category: `  - ${item.name}`, amount: item.balance })),
            { category: 'المصروفات المباشرة', amount: data.summary.total_direct_expenses },
            ...data.details.direct_expenses.map(item => ({ category: `  - ${item.name}`, amount: item.balance })),
            { category: 'مجمل الربح', amount: data.summary.gross_profit },
            { category: 'المصروفات غير المباشرة', amount: data.summary.total_indirect_expenses },
            ...data.details.indirect_expenses.map(item => ({ category: `  - ${item.name}`, amount: item.balance })),
            { category: 'صافي الربح', amount: data.summary.net_profit }
        ];

        const columns = [
            { id: 'category', columnDef: { header: 'البند', size: 200 } },
            { id: 'amount', columnDef: { header: 'المبلغ', size: 150 } }
        ];

        exportToExcel(exportData, columns, `Profit_Report_${startDate}_${endDate}`);
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
            <Paper sx={{ p: 4, mb: 4, borderRadius: 4, background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)', color: '#fff', boxShadow: '0 8px 32px rgba(25,118,210,0.2)' }}>
                <Grid container alignItems="center" spacing={2}>
                    <Grid item xs>
                        <Typography variant="h3" fontWeight="bold" gutterBottom>تقرير الأرباح والخسائر</Typography>
                        <Typography variant="subtitle1" sx={{ opacity: 0.9 }}>تحليل الإيرادات والمصروفات وصافي الربح</Typography>
                    </Grid>
                    <Grid item>
                        <Button variant="contained" startIcon={<BackIcon />} onClick={() => navigate('/reports-dashboard')} sx={{ bgcolor: 'rgba(255,255,255,0.2)', '&:hover': { bgcolor: 'rgba(255,255,255,0.3)' }, borderRadius: 2, px: 3 }}>رجوع</Button>
                    </Grid>
                </Grid>
                <Box sx={{ mt: 4, p: 2, bgcolor: 'rgba(255,255,255,0.1)', borderRadius: 3, display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
                    <TextField size="small" type="date" label="من تاريخ" InputLabelProps={{ shrink: true }} value={startDate} onChange={(e) => setStartDate(e.target.value)} sx={{ bgcolor: 'white', borderRadius: 1, minWidth: 180 }} />
                    <TextField size="small" type="date" label="إلى تاريخ" InputLabelProps={{ shrink: true }} value={endDate} onChange={(e) => setEndDate(e.target.value)} sx={{ bgcolor: 'white', borderRadius: 1, minWidth: 180 }} />
                    <Button variant="contained" onClick={fetchReport} sx={{ bgcolor: '#fff', color: '#1565c0', '&:hover': { bgcolor: '#f0f0f0' }, fontWeight: 'bold', px: 4 }}>تحديث</Button>
                    {data && (
                        <Button variant="contained" startIcon={<DownloadIcon />} onClick={handleExport} sx={{ bgcolor: '#4caf50', '&:hover': { bgcolor: '#388e3c' }, fontWeight: 'bold', px: 4 }}>تصدير Excel</Button>
                    )}
                </Box>
            </Paper>

            {loading ? (
                <Box display="flex" flexDirection="column" alignItems="center" py={10}>
                    <CircularProgress size={60} thickness={4} />
                    <Typography mt={2} color="text.secondary">جاري تحميل البيانات...</Typography>
                </Box>
            ) : data ? (
                <>
                    {/* KPI Cards */}
                    <Grid container spacing={3} mb={4}>
                        <Grid item xs={12} sm={6} md={3}>
                            <StatCard title="إجمالي الإيرادات" value={formatCurrency(data.summary.total_revenue)} icon={<RevenueIcon />} color="#4caf50" />
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                            <StatCard title="مجمل الربح" value={formatCurrency(data.summary.gross_profit)} icon={<CalcIcon />} color="#2196f3" />
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                            <StatCard title="إجمالي المصروفات" value={formatCurrency(data.summary.total_direct_expenses + data.summary.total_indirect_expenses)} icon={<ExpenseIcon />} color="#f44336" />
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                            <StatCard title="صافي الربح" value={formatCurrency(data.summary.net_profit)} icon={<ProfitIcon />} color="#009688" bg="#e0f2f1" />
                        </Grid>
                    </Grid>

                    {/* Details */}
                    <Grid container spacing={3}>
                        <Grid item xs={12} md={4}>
                            <Paper sx={{ p: 3, borderRadius: 3, boxShadow: 2 }}>
                                <Typography variant="h6" fontWeight="bold" gutterBottom color="success.main">
                                    <RevenueIcon sx={{ verticalAlign: 'middle', mr: 1 }} />
                                    الإيرادات
                                </Typography>
                                <Divider sx={{ my: 2 }} />
                                <TableContainer>
                                    <Table size="small">
                                        <TableHead>
                                            <TableRow>
                                                <TableCell sx={{ fontWeight: 'bold' }}>الحساب</TableCell>
                                                <TableCell align="right" sx={{ fontWeight: 'bold' }}>المبلغ</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {data.details.revenue.map((item) => (
                                                <TableRow key={item.id}>
                                                    <TableCell>{item.name}</TableCell>
                                                    <TableCell align="right" sx={{ color: 'success.main', fontWeight: 'bold' }}>{formatCurrency(item.balance)}</TableCell>
                                                </TableRow>
                                            ))}
                                            <TableRow sx={{ bgcolor: '#e8f5e9' }}>
                                                <TableCell sx={{ fontWeight: 'bold' }}>الإجمالي</TableCell>
                                                <TableCell align="right" sx={{ fontWeight: 'bold', color: 'success.main' }}>{formatCurrency(data.summary.total_revenue)}</TableCell>
                                            </TableRow>
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </Paper>
                        </Grid>

                        <Grid item xs={12} md={4}>
                            <Paper sx={{ p: 3, borderRadius: 3, boxShadow: 2 }}>
                                <Typography variant="h6" fontWeight="bold" gutterBottom color="error.main">
                                    <ExpenseIcon sx={{ verticalAlign: 'middle', mr: 1 }} />
                                    مصروفات مباشرة
                                </Typography>
                                <Divider sx={{ my: 2 }} />
                                <TableContainer>
                                    <Table size="small">
                                        <TableHead>
                                            <TableRow>
                                                <TableCell sx={{ fontWeight: 'bold' }}>الحساب</TableCell>
                                                <TableCell align="right" sx={{ fontWeight: 'bold' }}>المبلغ</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {data.details.direct_expenses.map((item) => (
                                                <TableRow key={item.id}>
                                                    <TableCell>{item.name}</TableCell>
                                                    <TableCell align="right" sx={{ color: 'error.main', fontWeight: 'bold' }}>{formatCurrency(item.balance)}</TableCell>
                                                </TableRow>
                                            ))}
                                            <TableRow sx={{ bgcolor: '#ffebee' }}>
                                                <TableCell sx={{ fontWeight: 'bold' }}>الإجمالي</TableCell>
                                                <TableCell align="right" sx={{ fontWeight: 'bold', color: 'error.main' }}>{formatCurrency(data.summary.total_direct_expenses)}</TableCell>
                                            </TableRow>
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </Paper>
                        </Grid>

                        <Grid item xs={12} md={4}>
                            <Paper sx={{ p: 3, borderRadius: 3, boxShadow: 2 }}>
                                <Typography variant="h6" fontWeight="bold" gutterBottom color="warning.main">
                                    <ExpenseIcon sx={{ verticalAlign: 'middle', mr: 1 }} />
                                    مصروفات غير مباشرة
                                </Typography>
                                <Divider sx={{ my: 2 }} />
                                <TableContainer>
                                    <Table size="small">
                                        <TableHead>
                                            <TableRow>
                                                <TableCell sx={{ fontWeight: 'bold' }}>الحساب</TableCell>
                                                <TableCell align="right" sx={{ fontWeight: 'bold' }}>المبلغ</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {data.details.indirect_expenses.map((item) => (
                                                <TableRow key={item.id}>
                                                    <TableCell>{item.name}</TableCell>
                                                    <TableCell align="right" sx={{ color: 'warning.main', fontWeight: 'bold' }}>{formatCurrency(item.balance)}</TableCell>
                                                </TableRow>
                                            ))}
                                            <TableRow sx={{ bgcolor: '#fff3e0' }}>
                                                <TableCell sx={{ fontWeight: 'bold' }}>الإجمالي</TableCell>
                                                <TableCell align="right" sx={{ fontWeight: 'bold', color: 'warning.main' }}>{formatCurrency(data.summary.total_indirect_expenses)}</TableCell>
                                            </TableRow>
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </Paper>
                        </Grid>
                    </Grid>

                    {/* Summary */}
                    <Paper sx={{ mt: 4, p: 4, borderRadius: 3, boxShadow: 3, background: 'linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)' }}>
                        <Typography variant="h5" fontWeight="bold" gutterBottom textAlign="center" color="#1565c0">
                            <ProfitIcon sx={{ verticalAlign: 'middle', mr: 1, fontSize: 32 }} />
                            ملخص الأرباح والخسائر
                        </Typography>
                        <Divider sx={{ my: 3 }} />
                        <Grid container spacing={2} justifyContent="center">
                            <Grid item xs={12} md={8}>
                                <Table>
                                    <TableBody>
                                        <TableRow>
                                            <TableCell sx={{ fontSize: 18 }}>إجمالي الإيرادات</TableCell>
                                            <TableCell align="right" sx={{ fontSize: 18, fontWeight: 'bold', color: '#4caf50' }}>{formatCurrency(data.summary.total_revenue)}</TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell sx={{ fontSize: 18 }}>(-) إجمالي المصروفات المباشرة</TableCell>
                                            <TableCell align="right" sx={{ fontSize: 18, fontWeight: 'bold', color: '#f44336' }}>{formatCurrency(data.summary.total_direct_expenses)}</TableCell>
                                        </TableRow>
                                        <TableRow sx={{ bgcolor: '#fff' }}>
                                            <TableCell sx={{ fontSize: 20, fontWeight: 'bold' }}>(=) مجمل الربح</TableCell>
                                            <TableCell align="right" sx={{ fontSize: 20, fontWeight: 'bold', color: '#2196f3' }}>{formatCurrency(data.summary.gross_profit)}</TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell sx={{ fontSize: 18 }}>(-) إجمالي المصروفات غير المباشرة</TableCell>
                                            <TableCell align="right" sx={{ fontSize: 18, fontWeight: 'bold', color: '#ff9800' }}>{formatCurrency(data.summary.total_indirect_expenses)}</TableCell>
                                        </TableRow>
                                        <TableRow sx={{ bgcolor: '#009688' }}>
                                            <TableCell sx={{ fontSize: 22, fontWeight: 'bold', color: '#fff' }}>(=) صافي الربح</TableCell>
                                            <TableCell align="right" sx={{ fontSize: 22, fontWeight: 'bold', color: '#fff' }}>{formatCurrency(data.summary.net_profit)}</TableCell>
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

export default ProfitReportPage;
