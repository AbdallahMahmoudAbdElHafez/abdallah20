import React, { useState, useEffect, useMemo } from 'react';
import {
    Box, Typography, Button, TextField, CircularProgress, Paper,
    Grid, Card, CardContent, Avatar
} from '@mui/material';
import {
    Download as DownloadIcon,
    ArrowBack as BackIcon,
    Receipt as InvoiceIcon,
    TrendingUp as TrendIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { MaterialReactTable } from 'material-react-table';
import reportsApi from '../api/reportsApi';
import { defaultTableProps } from "../config/tableConfig";
import { exportToExcel } from '../utils/exportUtils';

const OpeningSalesReportPage = () => {
    const navigate = useNavigate();
    const [data, setData] = useState([]);
    const [summary, setSummary] = useState({});
    const [loading, setLoading] = useState(false);

    // Default to current year
    const date = new Date();
    const firstDay = new Date(date.getFullYear(), 0, 1).toISOString().split('T')[0];
    const lastDay = new Date(date.getFullYear(), 11, 31).toISOString().split('T')[0];

    const [startDate, setStartDate] = useState(firstDay);
    const [endDate, setEndDate] = useState(lastDay);

    const fetchReport = async () => {
        setLoading(true);
        try {
            const res = await reportsApi.getOpeningSalesReport({ startDate, endDate });
            setData(res.data.data);
            setSummary(res.data.summary);
        } catch (error) {
            console.error('Error fetching opening sales report:', error);
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

    const handleExport = async (table, fileName) => {
        try {
            await exportToExcel(
                table.getFilteredRowModel().rows,
                table.getVisibleLeafColumns(),
                fileName
            );
        } catch (error) {
            console.error('Export failed:', error);
            alert('حدث خطأ أثناء محاولة تصدير الملف.');
        }
    };

    const columns = useMemo(() => [
        { accessorKey: 'id', id: 'id', header: 'معرف', size: 80 },
        { accessorKey: 'invoice_number', id: 'invoice_number', header: 'رقم الفاتورة', size: 150 },
        { accessorKey: 'party.name', id: 'customer_name', header: 'العميل', size: 200 },
        { accessorKey: 'invoice_date', id: 'invoice_date', header: 'التاريخ', Cell: ({ cell }) => cell.getValue()?.slice(0, 10), size: 120 },
        { accessorKey: 'shipping_by', id: 'shipping_by', header: 'بواسطة', size: 100 },
        { accessorKey: 'total_amount', id: 'total_amount', header: 'المبلغ', Cell: ({ cell }) => <Box fontWeight="bold" color="primary.main">{formatCurrency(cell.getValue())}</Box>, size: 150 },
        { accessorKey: 'note', id: 'note', header: 'ملاحظات', size: 200 },
    ], []);

    const StatCard = ({ title, value, icon, color }) => (
        <Card sx={{ borderRadius: 3, boxShadow: '0 4px 12px rgba(0,0,0,0.05)', border: '1px solid #f0f0f0' }}>
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
            <Paper sx={{ p: 4, mb: 4, borderRadius: 4, background: 'linear-gradient(135deg, #4caf50 0%, #388e3c 100%)', color: '#fff', boxShadow: '0 8px 32px rgba(76,175,80,0.2)' }}>
                <Grid container alignItems="center" spacing={2}>
                    <Grid item xs>
                        <Typography variant="h3" fontWeight="bold" gutterBottom>تقرير فواتير المبيعات الافتتاحية</Typography>
                        <Typography variant="subtitle1" sx={{ opacity: 0.9 }}>عرض جميع فواتير الأرصدة الافتتاحية للعملاء</Typography>
                    </Grid>
                    <Grid item>
                        <Button variant="contained" startIcon={<BackIcon />} onClick={() => navigate('/reports-dashboard')} sx={{ bgcolor: 'rgba(255,255,255,0.2)', '&:hover': { bgcolor: 'rgba(255,255,255,0.3)' }, borderRadius: 2, px: 3 }}>رجوع</Button>
                    </Grid>
                </Grid>
                <Box sx={{ mt: 4, p: 2, bgcolor: 'rgba(255,255,255,0.1)', borderRadius: 3, display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
                    <TextField size="small" type="date" label="من تاريخ" InputLabelProps={{ shrink: true }} value={startDate} onChange={(e) => setStartDate(e.target.value)} sx={{ bgcolor: 'white', borderRadius: 1, minWidth: 150 }} />
                    <TextField size="small" type="date" label="إلى تاريخ" InputLabelProps={{ shrink: true }} value={endDate} onChange={(e) => setEndDate(e.target.value)} sx={{ bgcolor: 'white', borderRadius: 1, minWidth: 150 }} />
                    <Button variant="contained" onClick={fetchReport} sx={{ bgcolor: '#fff', color: '#388e3c', '&:hover': { bgcolor: '#f0f0f0' }, fontWeight: 'bold', px: 4 }}>تحديث</Button>
                </Box>
            </Paper>

            {/* KPI Cards */}
            <Grid container spacing={3} mb={4}>
                <Grid item xs={12} sm={6} md={4}>
                    <StatCard title="عدد الفواتير" value={summary.total_invoices || 0} icon={<InvoiceIcon />} color="#4caf50" />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                    <StatCard title="إجمالي المبالغ" value={formatCurrency(summary.total_amount)} icon={<TrendIcon />} color="#2196f3" />
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
                        enableExporting
                        renderTopToolbarCustomActions={({ table }) => (
                            <Button variant="contained" color="success" startIcon={<DownloadIcon />} onClick={() => handleExport(table, 'Opening_Sales_Report')}>تصدير إلى Excel</Button>
                        )}
                    />
                </Paper>
            )}
        </Box>
    );
};

export default OpeningSalesReportPage;
