import React, { useState, useEffect, useMemo } from 'react';
import {
    Box, Typography, Button, TextField, CircularProgress, Paper,
    Grid, Card, CardContent, Avatar, Chip
} from '@mui/material';
import {
    Download as DownloadIcon,
    ArrowBack as BackIcon,
    Assignment as AssignmentIcon,
    ShoppingCart as CartIcon,
    Warning as WarningIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { MaterialReactTable } from 'material-react-table';
import reportsApi from '../api/reportsApi';
import { defaultTableProps } from "../config/tableConfig";
import { exportToExcel } from '../utils/exportUtils';

const SalesAnalysisPage = () => {
    const navigate = useNavigate();
    const [data, setData] = useState([]);
    const [summary, setSummary] = useState({});
    const [loading, setLoading] = useState(false);

    // Default to current month
    const date = new Date();
    const firstDay = new Date(date.getFullYear(), date.getMonth(), 1).toISOString().split('T')[0];
    const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0).toISOString().split('T')[0];

    const [startDate, setStartDate] = useState(firstDay);
    const [endDate, setEndDate] = useState(lastDay);

    const fetchReport = async () => {
        setLoading(true);
        try {
            const res = await reportsApi.getSalesAnalysisReport({ startDate, endDate });
            setData(res.data.data);
            setSummary(res.data.summary);
        } catch (error) {
            console.error('Error fetching sales analysis report:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReport();
    }, []);

    const handleExport = async (table) => {
        try {
            await exportToExcel(
                table.getFilteredRowModel().rows,
                table.getVisibleLeafColumns(),
                'Sales_Analysis_And_Purchasing',
                {}
            );
        } catch (error) {
            console.error('Export failed:', error);
            alert('حدث خطأ أثناء محاولة تصدير الملف.');
        }
    };

    const columns = useMemo(() => [
        { accessorKey: 'id', header: 'معرف المنتج', size: 100 },
        { accessorKey: 'name', header: 'اسم المنتج', size: 250 },
        { accessorKey: 'current_stock', header: 'المخزون الحالي', size: 130 },
        { accessorKey: 'total_sold', header: 'الكمية المباعة', size: 130 },
        { accessorKey: 'daily_avg', header: 'متوسط البيع اليومي', size: 150 },
        {
            accessorKey: 'days_to_stockout',
            header: 'أيام نفاذ المخزون',
            size: 160,
            Cell: ({ cell }) => {
                const val = cell.getValue();
                return val === 'غير محدد' ? val : `${val} يوم`;
            }
        },
        {
            accessorKey: 'suggested_qty',
            header: 'الكمية المقترحة للطلب',
            size: 150,
            Cell: ({ cell }) => <Box fontWeight="bold" color={cell.getValue() > 0 ? "error.main" : "text.primary"}>{cell.getValue()}</Box>
        },
        {
            accessorKey: 'status',
            header: 'حالة الطلب',
            size: 150,
            Cell: ({ cell }) => {
                const status = cell.getValue();
                return (
                    <Chip
                        label={status === 'Need to Order' ? 'يحتاج إلى طلب شراء' : 'المخزون كافٍ'}
                        color={status === 'Need to Order' ? 'error' : 'success'}
                        variant="outlined"
                        sx={{ fontWeight: 'bold' }}
                    />
                );
            }
        },
    ], []);

    const StatCard = ({ title, value, icon, color }) => (
        <Card sx={{ borderRadius: 3, boxShadow: '0 4px 12px rgba(0,0,0,0.05)', border: '1px solid #f0f0f0' }}>
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
            <Paper sx={{ p: 4, mb: 4, borderRadius: 4, background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)', color: '#fff', boxShadow: '0 8px 32px rgba(25,118,210,0.2)' }}>
                <Grid container alignItems="center" spacing={2}>
                    <Grid item xs>
                        <Typography variant="h3" fontWeight="bold" gutterBottom>تحليل المبيعات واقتراحات الشراء</Typography>
                        <Typography variant="subtitle1" sx={{ opacity: 0.9 }}>تحليل مستوى البيع لكل منتج ومعرفة مدى الحاجة لطلب كميات جديدة</Typography>
                    </Grid>
                    <Grid item>
                        <Button variant="contained" startIcon={<BackIcon />} onClick={() => navigate('/reports-dashboard')} sx={{ bgcolor: 'rgba(255,255,255,0.2)', '&:hover': { bgcolor: 'rgba(255,255,255,0.3)' }, borderRadius: 2, px: 3 }}>رجوع للتقارير</Button>
                    </Grid>
                </Grid>
                <Box sx={{ mt: 4, p: 2, bgcolor: 'rgba(255,255,255,0.1)', borderRadius: 3, display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
                    <TextField size="small" type="date" label="من تاريخ" InputLabelProps={{ shrink: true }} value={startDate} onChange={(e) => setStartDate(e.target.value)} sx={{ bgcolor: 'white', borderRadius: 1, minWidth: 150 }} />
                    <TextField size="small" type="date" label="إلى تاريخ" InputLabelProps={{ shrink: true }} value={endDate} onChange={(e) => setEndDate(e.target.value)} sx={{ bgcolor: 'white', borderRadius: 1, minWidth: 150 }} />
                    <Button variant="contained" onClick={fetchReport} sx={{ bgcolor: '#fff', color: '#1976d2', '&:hover': { bgcolor: '#f0f0f0' }, fontWeight: 'bold', px: 4, height: 40 }}>تحديث</Button>
                </Box>
            </Paper>

            {/* KPI Cards */}
            <Grid container spacing={3} mb={4}>
                <Grid item xs={12} sm={6}>
                    <StatCard title="إجمالي المنتجات التي تم تحليلها" value={summary.total_products || 0} icon={<AssignmentIcon />} color="#2196f3" />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <StatCard title="منتجات تحتاج إلى طلب شراء" value={summary.items_to_order || 0} icon={<WarningIcon />} color="#f44336" />
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
                        enableFilters
                        renderTopToolbarCustomActions={({ table }) => (
                            <Button variant="contained" color="success" startIcon={<DownloadIcon />} onClick={() => handleExport(table)}>تصدير إلى Excel</Button>
                        )}
                    />
                </Paper>
            )}
        </Box>
    );
};

export default SalesAnalysisPage;
