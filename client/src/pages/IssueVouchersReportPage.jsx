import React, { useState, useEffect, useMemo } from 'react';
import {
    Box, Typography, Button, TextField, CircularProgress, Paper,
    Grid, Card, CardContent, FormControl, Select, MenuItem,
    ToggleButton, ToggleButtonGroup, Avatar, IconButton, Divider
} from '@mui/material';
import {
    Download as DownloadIcon,
    ArrowBack as BackIcon,
    List as ListIcon,
    BarChart as ChartIcon,
    Receipt as VoucherIcon,
    Inventory as InventoryIcon,
    MoneyOff as CostIcon
} from '@mui/icons-material';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
    Cell
} from 'recharts';
import { useNavigate } from 'react-router-dom';
import { MaterialReactTable } from 'material-react-table';
import reportsApi from '../api/reportsApi';
import { defaultTableProps } from "../config/tableConfig";

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

const IssueVouchersReportPage = () => {
    const navigate = useNavigate();
    const [viewMode, setViewMode] = useState('list'); // 'list' | 'chart'

    const [data, setData] = useState([]);
    const [summary, setSummary] = useState({});
    const [chartData, setChartData] = useState([]);
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
            const res = await reportsApi.getIssueVouchersReport({ startDate, endDate });
            setData(res.data.data);
            setSummary(res.data.summary);
            setChartData(res.data.chartData);
        } catch (error) {
            console.error('Error fetching issue vouchers report:', error);
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

    const handleMonthChange = (e) => {
        const month = e.target.value;
        const year = new Date().getFullYear();
        if (month) {
            const start = new Date(year, month - 1, 1).toISOString().split('T')[0];
            const end = new Date(year, month, 0).toISOString().split('T')[0];
            setStartDate(start);
            setEndDate(end);
        }
    };

    const columns = useMemo(() => [
        { accessorKey: 'voucher_no', header: 'رقم الإذن', size: 100 },
        { accessorKey: 'issue_date', header: 'تاريخ الصرف', Cell: ({ cell }) => cell.getValue()?.slice(0, 10), size: 120 },
        { accessorKey: 'warehouse.name', header: 'المخزن', size: 150 },
        { accessorKey: 'status', header: 'الحالة', size: 100 },
        { accessorKey: 'items.length', header: 'عدد الأصناف', size: 100 },
        {
            accessorKey: 'total_cost',
            header: 'إجمالي التكلفة',
            Cell: ({ cell }) => <Box fontWeight="bold" color="error.main">{formatCurrency(cell.getValue())}</Box>,
            size: 130
        },
        { accessorKey: 'note', header: 'ملاحظات', size: 200 },
    ], []);

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
                        <Typography variant="h3" fontWeight="bold" gutterBottom>تقرير أذونات الصرف</Typography>
                        <Typography variant="subtitle1" sx={{ opacity: 0.9 }}>تحليل أذونات الصرف وتكلفة المخزون الصادر</Typography>
                    </Grid>
                    <Grid item>
                        <Button variant="contained" startIcon={<BackIcon />} onClick={() => navigate('/reports-dashboard')} sx={{ bgcolor: 'rgba(255,255,255,0.2)', '&:hover': { bgcolor: 'rgba(255,255,255,0.3)' }, borderRadius: 2, px: 3 }}>رجوع</Button>
                    </Grid>
                </Grid>
                <Box sx={{ mt: 4, p: 2, bgcolor: 'rgba(255,255,255,0.1)', borderRadius: 3, display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
                    <FormControl size="small" sx={{ minWidth: 150, bgcolor: 'white', borderRadius: 1 }}>
                        <Select displayEmpty onChange={handleMonthChange} defaultValue="" sx={{ borderRadius: 1 }}>
                            <MenuItem value="">شهر مخصص</MenuItem>
                            {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                                <MenuItem key={m} value={m}>{new Date(0, m - 1).toLocaleString('ar-EG', { month: 'long' })}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <TextField size="small" type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} sx={{ bgcolor: 'white', borderRadius: 1, minWidth: 150 }} />
                    <TextField size="small" type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} sx={{ bgcolor: 'white', borderRadius: 1, minWidth: 150 }} />
                    <Button variant="contained" onClick={fetchReport} sx={{ bgcolor: '#fff', color: '#1976d2', '&:hover': { bgcolor: '#f0f0f0' }, fontWeight: 'bold', px: 4 }}>تحديث</Button>
                </Box>
            </Paper>

            {/* KPI Cards */}
            <Grid container spacing={3} mb={4}>
                <Grid item xs={12} sm={4}>
                    <StatCard title="إجمالي الأذونات" value={summary.total_vouchers || 0} icon={<VoucherIcon />} color="#2196f3" />
                </Grid>
                <Grid item xs={12} sm={4}>
                    <StatCard title="عدد الأصناف المصروفة" value={summary.total_items || 0} icon={<InventoryIcon />} color="#4caf50" />
                </Grid>
                <Grid item xs={12} sm={4}>
                    <StatCard title="إجمالي التكلفة" value={formatCurrency(summary.total_cost)} icon={<CostIcon />} color="#f44336" />
                </Grid>
            </Grid>

            {/* View Mode Toggle */}
            <Box mb={4} sx={{ display: 'flex', justifyContent: 'center' }}>
                <Paper sx={{ p: 0.5, borderRadius: 3, display: 'inline-flex', bgcolor: '#e9ecef' }}>
                    <ToggleButtonGroup value={viewMode} exclusive onChange={(e, m) => m && setViewMode(m)}>
                        <ToggleButton value="list" sx={{ px: 4, borderRadius: 2.5, border: 'none', '&.Mui-selected': { bgcolor: '#fff', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' } }}> <ListIcon sx={{ mr: 1 }} /> القائمة </ToggleButton>
                        <ToggleButton value="chart" sx={{ px: 4, borderRadius: 2.5, border: 'none', '&.Mui-selected': { bgcolor: '#fff', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' } }}> <ChartIcon sx={{ mr: 1 }} /> التحليل البياني </ToggleButton>
                    </ToggleButtonGroup>
                </Paper>
            </Box>

            {loading ? (
                <Box display="flex" flexDirection="column" alignItems="center" py={10}>
                    <CircularProgress size={60} thickness={4} />
                    <Typography mt={2} color="text.secondary">جاري جلب البيانات...</Typography>
                </Box>
            ) : (
                <Box>
                    {viewMode === 'list' && (
                        <Paper sx={{ borderRadius: 3, overflow: 'hidden', boxShadow: 2 }}>
                            <MaterialReactTable
                                columns={columns}
                                {...defaultTableProps}
                                data={data}
                                enableExporting
                                renderDetailPanel={({ row }) => (
                                    <Box sx={{ p: 2, bgcolor: '#f8f9fa' }}>
                                        <Typography variant="h6" gutterBottom>تفاصيل الأصناف</Typography>
                                        <Grid container spacing={1}>
                                            {row.original.items?.map((item, index) => (
                                                <Grid item xs={12} key={index}>
                                                    <Paper sx={{ p: 1, display: 'flex', justifyContent: 'space-between' }}>
                                                        <Typography>{item.product?.name}</Typography>
                                                        <Box>
                                                            <Typography component="span" sx={{ mx: 2 }}>الكمية: {item.quantity}</Typography>
                                                            <Typography component="span" color="error">التكلفة: {formatCurrency(item.total_cost)}</Typography>
                                                        </Box>
                                                    </Paper>
                                                </Grid>
                                            ))}
                                        </Grid>
                                    </Box>
                                )}
                            />
                        </Paper>
                    )}

                    {viewMode === 'chart' && (
                        <Paper sx={{ p: 3, borderRadius: 3, boxShadow: 2 }}>
                            <Typography variant="h6" fontWeight="bold" gutterBottom><InventoryIcon sx={{ verticalAlign: 'middle', mr: 1 }} /> توزيع التكلفة حسب المخزن</Typography>
                            <ResponsiveContainer width="100%" height={400}>
                                <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                    <XAxis dataKey="name" />
                                    <YAxis tickFormatter={(val) => val >= 1000 ? `${val / 1000}k` : val} />
                                    <Tooltip formatter={(val) => formatCurrency(val)} />
                                    <Legend />
                                    <Bar dataKey="value" name="التكلفة" fill="#8884d8" barSize={50}>
                                        {chartData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </Paper>
                    )}
                </Box>
            )}
        </Box>
    );
};

export default IssueVouchersReportPage;
