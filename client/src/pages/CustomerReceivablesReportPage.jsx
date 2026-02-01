import React, { useState, useEffect, useMemo } from 'react';
import {
    Box, Typography, Button, TextField, CircularProgress, Paper,
    Grid, Card, CardContent, Avatar, FormControl, Select, MenuItem
} from '@mui/material';
import {
    Download as DownloadIcon,
    ArrowBack as BackIcon,
    AttachMoney as MoneyIcon,
    People as PeopleIcon,
    TrendingDown as ReturnIcon,
    Payment as PaymentIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { MaterialReactTable } from 'material-react-table';
import reportsApi from '../api/reportsApi';
import { defaultTableProps } from "../config/tableConfig";
import { exportToExcel } from '../utils/exportUtils';
import axiosClient from '../api/axiosClient';

const CustomerReceivablesReportPage = () => {
    const navigate = useNavigate();
    const [data, setData] = useState([]);
    const [summary, setSummary] = useState({});
    const [loading, setLoading] = useState(false);

    // Default to current month
    const date = new Date();
    const firstDay = new Date(date.getFullYear(), date.getMonth(), 1).toISOString().split('T')[0];
    const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0).toISOString().split('T')[0];

    const [startDate, setStartDate] = useState(''); // Default empty for "All Time"
    const [endDate, setEndDate] = useState('');

    const fetchReport = async () => {
        setLoading(true);
        try {
            // Using axiosClient directly if reportsApi doesn't have the method yet, 
            // or we should update reportsApi.js first. 
            // Let's assume we will update reportsApi.js or use axiosClient here.
            // Using axiosClient for simplicity as I can't see reportsApi.js right now but I know the endpoint.
            const res = await axiosClient.get('/reports/customer-receivables', {
                params: { startDate, endDate }
            });
            setData(res.data.data);
            setSummary(res.data.summary);
        } catch (error) {
            console.error('Error fetching customer receivables report:', error);
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

    const handleExport = async () => {
        try {
            const response = await axiosClient.get(`/reports/export/customer-receivables`, {
                params: { startDate, endDate },
                responseType: 'blob',
            });

            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `Customer_Receivables_${new Date().toISOString().slice(0, 10)}.xlsx`);
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (error) {
            console.error('Export failed:', error);
            alert('حدث خطأ أثناء محاولة تصدير الملف.');
        }
    };

    const columns = useMemo(() => [
        { accessorKey: 'name', header: 'العميل', size: 200 },
        { accessorKey: 'phone', header: 'رقم الهاتف', size: 120 },
        { accessorKey: 'city_name', header: 'المدينة', size: 120 },
        { accessorKey: 'employee_name', header: 'الموظف', size: 120 },
        {
            accessorKey: 'total_sales',
            header: 'إجمالي المبيعات',
            Cell: ({ cell }) => formatCurrency(cell.getValue()),
            size: 140
        },
        {
            accessorKey: 'total_payments',
            header: 'إجمالي السداد',
            Cell: ({ cell }) => <Box color="success.main">{formatCurrency(cell.getValue())}</Box>,
            size: 140
        },
        {
            accessorKey: 'total_returns',
            header: 'المرتجعات',
            Cell: ({ cell }) => <Box color="error.main">{formatCurrency(cell.getValue())}</Box>,
            size: 120
        },
        {
            accessorKey: 'net_balance',
            header: 'الرصيد الحالي',
            Cell: ({ cell }) => <Box fontWeight="bold" color="primary.main">{formatCurrency(cell.getValue())}</Box>,
            size: 140
        },
    ], []);

    const StatCard = ({ title, value, icon, color }) => (
        <Card sx={{ borderRadius: 3, boxShadow: 2 }}>
            <CardContent sx={{ display: 'flex', alignItems: 'center', p: 3 }}>
                <Avatar sx={{ bgcolor: color, width: 56, height: 56, mr: 2 }}>{icon}</Avatar>
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
            <Paper sx={{ p: 4, mb: 4, borderRadius: 4, background: 'linear-gradient(135deg, #283593 0%, #3f51b5 100%)', color: '#fff', boxShadow: 3 }}>
                <Grid container alignItems="center" spacing={2}>
                    <Grid item xs>
                        <Typography variant="h3" fontWeight="bold" gutterBottom>تقرير مستحقات العملاء</Typography>
                        <Typography variant="subtitle1" sx={{ opacity: 0.9 }}>متابعة أرصدة العملاء والمديونيات</Typography>
                    </Grid>
                    <Grid item>
                        <Button variant="contained" startIcon={<BackIcon />} onClick={() => navigate('/reports')} sx={{ bgcolor: 'rgba(255,255,255,0.2)', '&:hover': { bgcolor: 'rgba(255,255,255,0.3)' }, borderRadius: 2, px: 3 }}>رجوع</Button>
                    </Grid>
                </Grid>
                <Box sx={{ mt: 4, p: 2, bgcolor: 'rgba(255,255,255,0.1)', borderRadius: 3, display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
                    <TextField
                        size="small"
                        type="date"
                        label="من تاريخ"
                        InputLabelProps={{ shrink: true }}
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        sx={{ bgcolor: 'white', borderRadius: 1, minWidth: 150 }}
                    />
                    <TextField
                        size="small"
                        type="date"
                        label="إلى تاريخ"
                        InputLabelProps={{ shrink: true }}
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        sx={{ bgcolor: 'white', borderRadius: 1, minWidth: 150 }}
                    />
                    <Button variant="contained" onClick={fetchReport} sx={{ bgcolor: '#fff', color: '#283593', '&:hover': { bgcolor: '#f0f0f0' }, fontWeight: 'bold', px: 4 }}>تحديث</Button>
                    <Button
                        variant="contained"
                        color="success"
                        startIcon={<DownloadIcon />}
                        onClick={handleExport}
                        sx={{ ml: 'auto', fontWeight: 'bold' }}
                    >
                        تصدير Excel
                    </Button>
                </Box>
            </Paper>

            {/* KPI Cards */}
            <Grid container spacing={3} mb={4}>
                <Grid item xs={12} sm={6} md={6}>
                    <StatCard title="إجمالي المستحقات" value={formatCurrency(summary.total_receivables)} icon={<MoneyIcon />} color="#d32f2f" />
                </Grid>
                <Grid item xs={12} sm={6} md={6}>
                    <StatCard title="عدد العملاء" value={summary.total_customers || 0} icon={<PeopleIcon />} color="#1976d2" />
                </Grid>
            </Grid>

            {loading ? (
                <Box display="flex" flexDirection="column" alignItems="center" py={10}>
                    <CircularProgress size={60} thickness={4} />
                    <Typography mt={2} color="text.secondary">جاري جلب البيانات...</Typography>
                </Box>
            ) : (
                <Paper sx={{ borderRadius: 3, overflow: 'hidden', boxShadow: 2 }}>
                    <MaterialReactTable
                        columns={columns}
                        {...defaultTableProps}
                        data={data}
                        enableRowNumbers
                    />
                </Paper>
            )}
        </Box>
    );
};

export default CustomerReceivablesReportPage;
