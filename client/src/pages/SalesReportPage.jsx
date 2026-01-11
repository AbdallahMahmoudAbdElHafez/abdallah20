import React, { useState, useEffect, useMemo } from 'react';
import {
    Box, Typography, Button, TextField, CircularProgress, Paper,
    Grid, Card, CardContent, FormControl, InputLabel, Select, MenuItem,
    ToggleButton, ToggleButtonGroup, Avatar, IconButton, Divider, Tooltip as MuiTooltip
} from '@mui/material';
import {
    Download as DownloadIcon,
    ArrowBack as BackIcon,
    TableChart as TableIcon,
    PivotTableChart as PivotIcon,
    ViewList as ListIcon,
    TrendingUp as TrendIcon,
    PointOfSale as SaleIcon,
    Receipt as InvoiceIcon,
    AccountBalance as BankIcon,
    Map as MapIcon,
    Inventory as ProductIcon
} from '@mui/icons-material';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
    PieChart, Pie, Cell, BarChart, Bar
} from 'recharts';
import { useNavigate } from 'react-router-dom';
import { MaterialReactTable } from 'material-react-table';
import reportsApi from '../api/reportsApi';
import { defaultTableProps } from "../config/tableConfig";
import { exportToExcel } from '../utils/exportUtils';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

const SalesReportPage = () => {
    const navigate = useNavigate();
    const [salesByProduct, setSalesByProduct] = useState([]);
    const [salesByEmployeeProduct, setSalesByEmployeeProduct] = useState([]); // [NEW]
    const [salesByRegion, setSalesByRegion] = useState([]);
    const [viewMode, setViewMode] = useState('list'); // 'list' | 'product_pivot' | 'invoice_pivot' | 'employee_product'

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
            const res = await reportsApi.getSalesReport({ startDate, endDate });
            setData(res.data.data);
            setSummary(res.data.summary);
            setChartData(res.data.chartData);
            setSalesByProduct(res.data.salesByProduct || []);
            setSalesByEmployeeProduct(res.data.salesByEmployeeProduct || []); // [NEW]
            setSalesByRegion(res.data.salesByRegion || []);
        } catch (error) {
            console.error('Error fetching sales report:', error);
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

    const handleExport = async (table, fileName, options = {}) => {
        try {
            await exportToExcel(
                table.getFilteredRowModel().rows,
                table.getVisibleLeafColumns(),
                fileName,
                options
            );
        } catch (error) {
            console.error('Export failed:', error);
            alert('حدث خطأ أثناء محاولة تصدير الملف. يرجى مراجعة البيانات والمحاولة مرة أخرى.');
        }
    };

    // --- 1. Standard List Columns ---
    const columns = useMemo(() => [
        { accessorKey: 'id', id: 'id', header: 'معرف الفاتورة', size: 100 },
        { accessorKey: 'invoice_number', id: 'invoice_number', header: 'رقم الفاتورة', size: 150 },
        { accessorKey: 'invoice_type', id: 'invoice_type', header: 'النوع', size: 100, Cell: ({ cell }) => cell.getValue() === 'cash' ? 'نقدي' : 'آجل' },
        { accessorKey: 'party.name', id: 'customer_name', header: 'العميل', size: 180 },
        { accessorKey: 'invoice_date', id: 'invoice_date', header: 'تاريخ الإصدار', Cell: ({ cell }) => cell.getValue()?.slice(0, 10), size: 120 },
        { accessorKey: 'status', id: 'status', header: 'الحالة', size: 100 },
        { accessorKey: 'total_amount', id: 'total_amount', header: 'الإجمالي', Cell: ({ cell }) => <Box fontWeight="bold" color="primary.main">{formatCurrency(cell.getValue())}</Box>, size: 130 },
    ], []);

    // --- 2. Product Analysis Columns ---
    const productPivotColumns = useMemo(() => [
        { accessorKey: 'product', id: 'product', header: 'المنتج', size: 200 },
        { accessorKey: 'quantity', id: 'quantity', header: 'الكمية المباعة', size: 130 },
        { accessorKey: 'bonus', id: 'bonus', header: 'البونص', size: 100 },
        { accessorKey: 'revenue', id: 'revenue', header: 'إجمالي المبيعات', Cell: ({ cell }) => formatCurrency(cell.getValue()), size: 150 },
        { accessorKey: 'profit', id: 'profit', header: 'الربح المتوقع', Cell: ({ cell }) => <Box color={cell.getValue() >= 0 ? 'success.main' : 'error.main'} fontWeight="bold">{formatCurrency(cell.getValue())}</Box>, size: 150 },
        { accessorKey: 'margin', id: 'margin', header: 'هامش الربح', Cell: ({ cell }) => `${parseFloat(cell.getValue()).toFixed(2)}%`, size: 100 },
    ], []);

    // --- 2.1 Salesman Analysis Columns ---
    const employeeProductColumns = useMemo(() => [
        { accessorKey: 'employee', id: 'employee', header: 'اسم الموظف', size: 200 },
        { accessorKey: 'product', id: 'product', header: 'المنتج', size: 200 },
        { accessorKey: 'quantity', id: 'quantity', header: 'الكمية المباعة', size: 130 },
        { accessorKey: 'revenue', id: 'revenue', header: 'قيمة المبيعات', Cell: ({ cell }) => formatCurrency(cell.getValue()), size: 150 },
    ], []);

    // --- 3. Matrix Pivot Logic ---
    const { detailedPivotColumns, detailedPivotData } = useMemo(() => {
        if (!data || data.length === 0) return { detailedPivotColumns: [], detailedPivotData: [] };

        const allProducts = new Set();
        data.forEach(inv => inv.items?.forEach(it => allProducts.add(it.product?.name || 'Unknown')));
        const sortedProducts = Array.from(allProducts).sort();

        const cols = [
            { accessorKey: 'invoice_number', id: 'invoice_number', header: 'رقم الفاتورة', size: 120, enablePinning: true },
            { accessorKey: 'date', id: 'date', header: 'التاريخ', size: 100, enablePinning: true, Cell: ({ cell }) => cell.getValue() },
            { accessorKey: 'customer_name', id: 'customer_name', header: 'العميل', size: 180, enablePinning: true },
            { accessorKey: 'governate', id: 'governate', header: 'المحافظة', size: 120 },
            { accessorKey: 'city', id: 'city', header: 'المنطقة', size: 120 },
        ];

        sortedProducts.forEach(prod => {
            cols.push({
                id: `${prod}_group`,
                header: prod,
                columns: [
                    { accessorKey: `${prod}_qty`, id: `${prod}_qty`, header: 'الكمية', size: 80 },
                    { accessorKey: `${prod}_bonus`, id: `${prod}_bonus`, header: 'بونص', size: 80 },
                    { accessorKey: `${prod}_disc_pct`, id: `${prod}_disc_pct`, header: 'الخصم %', size: 85, Cell: ({ cell }) => `${cell.getValue()?.toFixed(1) || 0}%` },
                    { accessorKey: `${prod}_val`, id: `${prod}_val`, header: 'القيمة', size: 100, Cell: ({ cell }) => formatCurrency(cell.getValue()) }
                ]
            });
        });

        cols.push({
            accessorKey: 'total_invoice', id: 'total_invoice', header: 'الإجمالي', size: 130,
            Cell: ({ cell }) => <Box fontWeight="bold">{formatCurrency(cell.getValue())}</Box>,
            enablePinning: true
        });

        const rows = data.map(invoice => {
            const row = {
                invoice_number: invoice.invoice_number,
                date: invoice.invoice_date?.slice(0, 10), // Corrected to invoice_date
                customer_name: invoice.party?.name || '-',
                governate: invoice.party?.city?.governate?.name || '-',
                city: invoice.party?.city?.name || '-',
                total_invoice: parseFloat(invoice.total_amount || 0)
            };

            const prodAggregation = {};
            sortedProducts.forEach(p => {
                row[`${p}_qty`] = 0;
                row[`${p}_bonus`] = 0;
                row[`${p}_val`] = 0;
                row[`${p}_disc_pct`] = 0;
                prodAggregation[p] = { baseTotal: 0, discTotal: 0 };
            });

            invoice.items?.forEach(item => {
                const p = item.product?.name || 'Unknown';
                const qty = parseFloat(item.quantity || 0);
                const price = parseFloat(item.price || 0);
                const disc = parseFloat(item.discount || 0);
                const tax = parseFloat(item.tax_amount || 0);
                const vat = parseFloat(item.vat_amount || 0);
                const base = qty * price;
                row[`${p}_qty`] += qty;
                row[`${p}_bonus`] += parseFloat(item.bonus || 0);
                row[`${p}_val`] += base - disc + tax + vat;
                if (prodAggregation[p]) {
                    prodAggregation[p].baseTotal += base;
                    prodAggregation[p].discTotal += disc;
                }
            });

            sortedProducts.forEach(p => {
                const agg = prodAggregation[p];
                if (agg && agg.baseTotal > 0) {
                    row[`${p}_disc_pct`] = (agg.discTotal / agg.baseTotal) * 100;
                }
            });
            return row;
        });

        return { detailedPivotColumns: cols, detailedPivotData: rows };
    }, [data]);

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
                        <Typography variant="h3" fontWeight="bold" gutterBottom>تقرير المبيعات</Typography>
                        <Typography variant="subtitle1" sx={{ opacity: 0.9 }}>تحليل شامل للمبيعات والمنتجات والمناطق</Typography>
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
                <Grid item xs={12} sm={6} md={2.4}>
                    <StatCard title="إجمالي المبيعات" value={formatCurrency(summary.total_amount)} icon={<SaleIcon />} color="#2196f3" />
                </Grid>
                <Grid item xs={12} sm={6} md={2.4}>
                    <StatCard title="عدد الفواتير" value={summary.total_invoices || 0} icon={<InvoiceIcon />} color="#4caf50" />
                </Grid>
                <Grid item xs={12} sm={6} md={2.4}>
                    <StatCard title="ض.ق.م (14%)" value={formatCurrency(summary.total_vat)} icon={<BankIcon />} color="#9c27b0" />
                </Grid>
                <Grid item xs={12} sm={6} md={2.4}>
                    <StatCard title="ضرائب أخرى" value={formatCurrency(summary.total_tax - summary.total_vat)} icon={<BankIcon />} color="#ff9800" />
                </Grid>
                <Grid item xs={12} sm={6} md={2.4}>
                    <StatCard title="إجمالي الخصم" value={formatCurrency(summary.total_discount)} icon={<TrendIcon />} color="#f44336" />
                </Grid>
            </Grid>

            {/* View Mode Toggle */}
            <Box mb={4} sx={{ display: 'flex', justifyContent: 'center' }}>
                <Paper sx={{ p: 0.5, borderRadius: 3, display: 'inline-flex', bgcolor: '#e9ecef' }}>
                    <ToggleButtonGroup value={viewMode} exclusive onChange={(e, m) => m && setViewMode(m)}>
                        <ToggleButton value="list" sx={{ px: 4, borderRadius: 2.5, border: 'none', '&.Mui-selected': { bgcolor: '#fff', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' } }}> <ListIcon sx={{ mr: 1 }} /> القائمة </ToggleButton>
                        <ToggleButton value="product_pivot" sx={{ px: 4, borderRadius: 2.5, border: 'none', '&.Mui-selected': { bgcolor: '#fff', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' } }}> <PivotIcon sx={{ mr: 1 }} /> تحليل المنتجات </ToggleButton>
                        <ToggleButton value="employee_product" sx={{ px: 4, borderRadius: 2.5, border: 'none', '&.Mui-selected': { bgcolor: '#fff', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' } }}> <TrendIcon sx={{ mr: 1 }} /> تحليل المناديب </ToggleButton>
                        <ToggleButton value="invoice_pivot" sx={{ px: 4, borderRadius: 2.5, border: 'none', '&.Mui-selected': { bgcolor: '#fff', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' } }}> <TableIcon sx={{ mr: 1 }} /> مصفوفة الفواتير </ToggleButton>
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
                        <Grid container spacing={3}>
                            <Grid item xs={12} lg={8}>
                                <Paper sx={{ borderRadius: 3, overflow: 'hidden', boxShadow: 2 }}>
                                    <MaterialReactTable
                                        columns={columns}
                                        {...defaultTableProps}
                                        data={data}
                                        enableExporting
                                        renderTopToolbarCustomActions={({ table }) => (
                                            <Button variant="contained" color="success" startIcon={<DownloadIcon />} onClick={() => handleExport(table, 'Sales_Report')}>تصدير</Button>
                                        )}
                                    />
                                </Paper>
                            </Grid>
                            <Grid item xs={12} lg={4}>
                                <Stack spacing={3}>
                                    <Paper sx={{ p: 3, borderRadius: 3, boxShadow: 2 }}>
                                        <Typography variant="h6" fontWeight="bold" gutterBottom><TrendIcon sx={{ verticalAlign: 'middle', mr: 1 }} /> اتجاه المبيعات</Typography>
                                        <ResponsiveContainer width="100%" height={250}>
                                            <LineChart data={chartData}>
                                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                                <XAxis dataKey="month" hide />
                                                <YAxis hide />
                                                <Tooltip />
                                                <Line type="monotone" dataKey="amount" stroke="#1976d2" strokeWidth={3} dot={{ r: 6 }} />
                                            </LineChart>
                                        </ResponsiveContainer>
                                    </Paper>
                                    <Paper sx={{ p: 3, borderRadius: 3, boxShadow: 2 }}>
                                        <Typography variant="h6" fontWeight="bold" gutterBottom><MapIcon sx={{ verticalAlign: 'middle', mr: 1 }} /> المبيعات حسب المنطقة</Typography>
                                        <ResponsiveContainer width="100%" height={250}>
                                            <PieChart>
                                                <Pie data={salesByRegion} dataKey="revenue" nameKey="region" innerRadius={60} outerRadius={80} paddingAngle={5}>
                                                    {salesByRegion.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                                                </Pie>
                                                <Tooltip formatter={(val) => formatCurrency(val)} />
                                            </PieChart>
                                        </ResponsiveContainer>
                                    </Paper>
                                </Stack>
                            </Grid>
                        </Grid>
                    )}

                    {viewMode === 'product_pivot' && (
                        <Paper sx={{ borderRadius: 3, boxShadow: 2, overflow: 'hidden' }}>
                            <MaterialReactTable
                                columns={productPivotColumns}
                                {...defaultTableProps}
                                data={salesByProduct}
                                enableExporting
                                renderTopToolbarCustomActions={({ table }) => (
                                    <Button variant="contained" color="success" startIcon={<DownloadIcon />}
                                        onClick={() => handleExport(table, 'Product_Performance', { heatmap: true })}>
                                        تصدير مع التحليل
                                    </Button>
                                )}
                            />
                        </Paper>
                    )}

                    {viewMode === 'employee_product' && (
                        <Paper sx={{ borderRadius: 3, boxShadow: 2, overflow: 'hidden' }}>
                            <MaterialReactTable
                                columns={employeeProductColumns}
                                {...defaultTableProps}
                                data={salesByEmployeeProduct}
                                enableExporting
                                renderTopToolbarCustomActions={({ table }) => (
                                    <Button variant="contained" color="success" startIcon={<DownloadIcon />}
                                        onClick={() => handleExport(table, 'Salesman_Product_Performance')}>
                                        تصدير التقرير
                                    </Button>
                                )}
                            />
                        </Paper>
                    )}

                    {viewMode === 'invoice_pivot' && (
                        <Paper sx={{ borderRadius: 3, boxShadow: 2, overflowX: 'auto', p: 1 }}>
                            <MaterialReactTable
                                columns={detailedPivotColumns}
                                {...defaultTableProps}
                                data={detailedPivotData}
                                enableColumnPinning
                                enableExporting
                                initialState={{ columnPinning: { left: ['invoice_number', 'date', 'customer_name'] } }}
                                renderTopToolbarCustomActions={({ table }) => (
                                    <Button variant="contained" color="success" startIcon={<DownloadIcon />}
                                        onClick={() => handleExport(table, 'Sales_Matrix', { heatmap: true, freezeColumns: 3 })}>
                                        تصدير المبيعات التفصيلية
                                    </Button>
                                )}
                            />
                        </Paper>
                    )}
                </Box>
            )}
        </Box>
    );
};

const Stack = ({ children, spacing }) => <Box sx={{ display: 'flex', flexDirection: 'column', gap: spacing }}>{children}</Box>;
export default SalesReportPage;
