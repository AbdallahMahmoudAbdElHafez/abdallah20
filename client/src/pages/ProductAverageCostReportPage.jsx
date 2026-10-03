import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
    Box, Typography, Button, CircularProgress, Paper,
    Grid, Card, CardContent, FormControlLabel, Switch,
    useTheme, Chip, TextField, MenuItem, Select, FormControl,
    InputLabel, IconButton, Tooltip, Stack, Collapse, Divider
} from '@mui/material';
import {
    Download as DownloadIcon,
    ArrowBack as BackIcon,
    TrendingUp as TrendingUpIcon,
    Inventory as InventoryIcon,
    AttachMoney as MoneyIcon,
    Calculate as CalculateIcon,
    BarChart as BarChartIcon,
    Layers as LayersIcon,
    Refresh as RefreshIcon,
    Search as SearchIcon,
    Print as PrintIcon,
    ExpandMore as ExpandMoreIcon,
    ExpandLess as ExpandLessIcon,
    SwapVert as SwapVertIcon,
    Storefront as StorefrontIcon,
    Category as CategoryIcon
} from '@mui/icons-material';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip,
    Legend, ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts';
import { useNavigate } from 'react-router-dom';
import { MaterialReactTable } from 'material-react-table';
import reportsApi from '../api/reportsApi';
import axiosClient from '../api/axiosClient';
import { defaultTableProps } from "../config/tableConfig";
import { exportToExcel } from '../utils/exportUtils';
import { alpha } from '@mui/material/styles';

const ProductAverageCostReportPage = () => {
    const navigate = useNavigate();
    const theme = useTheme();
    const tableRef = useRef(null);

    // State
    const [loading, setLoading] = useState(false);
    const [warehouses, setWarehouses] = useState([]);
    const [selectedWarehouse, setSelectedWarehouse] = useState('all');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [onlyInStock, setOnlyInStock] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [showCharts, setShowCharts] = useState(true);

    // Data State
    const [summary, setSummary] = useState({});
    const [items, setItems] = useState([]);
    const [charts, setCharts] = useState({
        topValueProducts: [],
        costComparisonChart: [],
        warehouseDistribution: []
    });

    // Fetch Warehouses list
    useEffect(() => {
        const fetchWarehouses = async () => {
            try {
                const res = await axiosClient.get('/warehouses');
                setWarehouses(res.data || []);
            } catch (err) {
                console.error('Failed to fetch warehouses:', err);
            }
        };
        fetchWarehouses();
    }, []);

    // Fetch Report Data
    const fetchReport = async () => {
        setLoading(true);
        try {
            const params = {};
            if (selectedWarehouse && selectedWarehouse !== 'all') params.warehouseId = selectedWarehouse;
            if (startDate) params.startDate = startDate;
            if (endDate) params.endDate = endDate;
            if (onlyInStock) params.onlyInStock = true;
            if (searchQuery) params.search = searchQuery;

            const res = await reportsApi.getProductAverageCostReport(params);
            setSummary(res.data.summary || {});
            setItems(res.data.items || []);
            setCharts(res.data.charts || {
                topValueProducts: [],
                costComparisonChart: [],
                warehouseDistribution: []
            });
        } catch (error) {
            console.error('Error fetching product average cost report:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReport();
    }, [selectedWarehouse, onlyInStock]);

    // Formatters
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('ar-EG', {
            style: 'currency',
            currency: 'EGP',
            maximumFractionDigits: 2,
            minimumFractionDigits: 2
        }).format(amount || 0);
    };

    const formatNumber = (num) => {
        return new Intl.NumberFormat('ar-EG').format(num || 0);
    };

    // Chart Palette
    const CHART_COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#06b6d4', '#64748b'];

    // Table Columns Definition
    const columns = useMemo(() => [
        {
            accessorKey: 'product_id',
            header: '#',
            size: 60,
            enableSorting: true
        },
        {
            accessorKey: 'product_name',
            header: 'اسم الصنف / المنتج',
            size: 240,
            Cell: ({ row }) => (
                <Box>
                    <Typography variant="body2" fontWeight="700" color="primary.dark">
                        {row.original.product_name}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                        الوحدة: {row.original.unit_name} | عدد التشغيلات: {row.original.batches?.length || 0}
                    </Typography>
                </Box>
            )
        },
        {
            accessorKey: 'current_quantity',
            header: 'الرصيد الحالي',
            size: 110,
            Cell: ({ cell }) => {
                const val = cell.getValue();
                return (
                    <Chip
                        label={formatNumber(val)}
                        size="small"
                        color={val > 0 ? "success" : "default"}
                        variant={val > 0 ? "filled" : "outlined"}
                        sx={{ fontWeight: 'bold' }}
                    />
                );
            },
            Footer: () => (
                <Typography variant="subtitle2" fontWeight="bold">
                    {formatNumber(summary.total_stock_quantity)}
                </Typography>
            )
        },
        {
            accessorKey: 'current_avg_unit_cost',
            header: 'متوسط تكلفة الوحدة (المخزون)',
            size: 150,
            Cell: ({ cell, row }) => {
                const val = cell.getValue();
                const variance = row.original.cost_variance;
                return (
                    <Box>
                        <Typography variant="body2" fontWeight="800" color="secondary.main">
                            {formatCurrency(val)}
                        </Typography>
                        {variance !== 0 && (
                            <Typography
                                variant="caption"
                                sx={{
                                    color: variance > 0 ? 'error.main' : 'success.main',
                                    fontWeight: 'bold',
                                    display: 'block'
                                }}
                            >
                                {variance > 0 ? `+${variance.toFixed(2)}` : variance.toFixed(2)} عن البطاقة
                            </Typography>
                        )}
                    </Box>
                );
            },
            Footer: () => (
                <Box>
                    <Typography variant="caption" color="text.secondary" display="block">
                        المتوسط العام
                    </Typography>
                    <Typography variant="subtitle2" fontWeight="bold" color="secondary.main">
                        {formatCurrency(summary.overall_weighted_avg_cost)}
                    </Typography>
                </Box>
            )
        },
        {
            accessorKey: 'current_stock_value',
            header: 'إجمالي قيمة المخزون',
            size: 150,
            Cell: ({ cell }) => (
                <Typography variant="body2" fontWeight="bold" color="primary.main">
                    {formatCurrency(cell.getValue())}
                </Typography>
            ),
            Footer: () => (
                <Typography variant="subtitle2" fontWeight="900" color="primary.main">
                    {formatCurrency(summary.total_stock_value)}
                </Typography>
            )
        },
        {
            accessorKey: 'inflow_avg_unit_cost',
            header: 'متوسط تكلفة الوارد',
            size: 130,
            Cell: ({ cell, row }) => (
                <Box>
                    <Typography variant="body2" fontWeight="600">
                        {formatCurrency(cell.getValue())}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                        وارد: {formatNumber(row.original.total_inflow_quantity)}
                    </Typography>
                </Box>
            ),
            Footer: () => (
                <Typography variant="caption" fontWeight="bold">
                    وارد عام: {formatCurrency(summary.overall_inflow_avg_cost)}
                </Typography>
            )
        },
        {
            accessorKey: 'last_inflow_cost',
            header: 'آخر تكلفة واردة',
            size: 110,
            Cell: ({ cell }) => (
                <Typography variant="body2">
                    {formatCurrency(cell.getValue())}
                </Typography>
            )
        },
        {
            accessorKey: 'min_inflow_cost',
            header: 'أدنى / أعلى توريد',
            size: 130,
            Cell: ({ row }) => (
                <Box>
                    <Typography variant="caption" color="success.dark" display="block" fontWeight="bold">
                        أدنى: {formatCurrency(row.original.min_inflow_cost)}
                    </Typography>
                    <Typography variant="caption" color="error.dark" display="block" fontWeight="bold">
                        أعلى: {formatCurrency(row.original.max_inflow_cost)}
                    </Typography>
                </Box>
            )
        },
        {
            accessorKey: 'catalog_cost_price',
            header: 'تكلفة كارت الصنف',
            size: 120,
            Cell: ({ cell }) => (
                <Typography variant="body2" color="text.secondary">
                    {formatCurrency(cell.getValue())}
                </Typography>
            )
        },
        {
            accessorKey: 'selling_price',
            header: 'سعر البيع',
            size: 110,
            Cell: ({ cell }) => (
                <Typography variant="body2" fontWeight="600">
                    {formatCurrency(cell.getValue())}
                </Typography>
            )
        },
        {
            accessorKey: 'profit_margin_pct',
            header: 'هامش الربح',
            size: 110,
            Cell: ({ cell }) => {
                const val = cell.getValue();
                const color = val >= 30 ? 'success.main' : val > 0 ? 'warning.main' : 'error.main';
                return (
                    <Chip
                        label={`${val}%`}
                        size="small"
                        sx={{
                            bgcolor: alpha(val > 0 ? theme.palette.success.main : theme.palette.error.main, 0.1),
                            color: color,
                            fontWeight: 'bold',
                            border: '1px solid',
                            borderColor: color
                        }}
                    />
                );
            }
        }
    ], [summary, theme]);

    // Handle Excel Export
    const handleExport = (table) => {
        const visibleColumns = table.getVisibleLeafColumns();
        exportToExcel(items, visibleColumns, 'تقرير_متوسط_تكلفة_الوحدة_للمنتجات', {
            freezeColumns: 2
        });
    };

    return (
        <Box p={{ xs: 2, md: 4 }} sx={{ bgcolor: '#f4f6f8', minHeight: '100vh' }}>
            {/* Page Header */}
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: { xs: 'column', md: 'row' },
                    justifyContent: 'space-between',
                    alignItems: { xs: 'flex-start', md: 'center' },
                    mb: 3,
                    gap: 2
                }}
            >
                <Box>
                    <Box display="flex" alignItems="center" gap={1.5} mb={0.5}>
                        <CalculateIcon sx={{ fontSize: 36, color: 'primary.main' }} />
                        <Typography variant="h4" fontWeight="800" color="#1e293b">
                            تقرير متوسط تكلفة الوحدة لكل منتج
                        </Typography>
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                        تحليل دقيق لمتوسط التكلفة المرجح للمخزون والواردات مستنداً إلى حركات وتشغيلات المخزون (Batches)
                    </Typography>
                </Box>

                <Stack direction="row" spacing={1.5} alignItems="center" flexWrap="wrap">
                    <Button
                        variant="outlined"
                        startIcon={showCharts ? <ExpandLessIcon /> : <BarChartIcon />}
                        onClick={() => setShowCharts(!showCharts)}
                        sx={{ borderRadius: 2, height: 42 }}
                    >
                        {showCharts ? 'إخفاء الرسوم البيانية' : 'عرض الرسوم البيانية'}
                    </Button>
                    <Button
                        variant="contained"
                        color="success"
                        startIcon={<DownloadIcon />}
                        onClick={() => {
                            if (tableRef.current) {
                                handleExport(tableRef.current);
                            }
                        }}
                        sx={{ borderRadius: 2, height: 42, fontWeight: 'bold' }}
                    >
                        تصدير Excel
                    </Button>
                    <Button
                        variant="outlined"
                        startIcon={<BackIcon />}
                        onClick={() => navigate('/reports-dashboard')}
                        sx={{ borderRadius: 2, height: 42 }}
                    >
                        رجوع للتقارير
                    </Button>
                </Stack>
            </Box>

            {/* Filter Card */}
            <Paper
                elevation={0}
                sx={{
                    p: 2.5,
                    mb: 3,
                    borderRadius: 3,
                    border: '1px solid #e2e8f0',
                    bgcolor: '#ffffff'
                }}
            >
                <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12} sm={6} md={3}>
                        <FormControl fullWidth size="small">
                            <InputLabel id="warehouse-select-label">المخزن</InputLabel>
                            <Select
                                labelId="warehouse-select-label"
                                value={selectedWarehouse}
                                label="المخزن"
                                onChange={(e) => setSelectedWarehouse(e.target.value)}
                            >
                                <MenuItem value="all">كل المخازن (إجمالي)</MenuItem>
                                {warehouses.map((w) => (
                                    <MenuItem key={w.id} value={w.id}>
                                        {w.name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>

                    <Grid item xs={12} sm={6} md={2.5}>
                        <TextField
                            fullWidth
                            size="small"
                            type="date"
                            label="وارد من تاريخ"
                            InputLabelProps={{ shrink: true }}
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                        />
                    </Grid>

                    <Grid item xs={12} sm={6} md={2.5}>
                        <TextField
                            fullWidth
                            size="small"
                            type="date"
                            label="وارد إلى تاريخ"
                            InputLabelProps={{ shrink: true }}
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                        />
                    </Grid>

                    <Grid item xs={12} sm={6} md={2}>
                        <FormControlLabel
                            control={
                                <Switch
                                    checked={onlyInStock}
                                    onChange={(e) => setOnlyInStock(e.target.checked)}
                                    color="primary"
                                />
                            }
                            label="الأصناف المتوفرة فقط"
                        />
                    </Grid>

                    <Grid item xs={12} sm={12} md={2}>
                        <Button
                            fullWidth
                            variant="contained"
                            startIcon={<RefreshIcon />}
                            onClick={fetchReport}
                            disabled={loading}
                            sx={{ borderRadius: 2, height: 40, fontWeight: 'bold' }}
                        >
                            تطبيق الفلاتر
                        </Button>
                    </Grid>
                </Grid>
            </Paper>

            {loading ? (
                <Box display="flex" justifyContent="center" alignItems="center" py={10} flexDirection="column">
                    <CircularProgress size={50} thickness={4} />
                    <Typography mt={2} color="text.secondary" fontWeight="600">
                        جاري حساب متوسطات التكلفة وتحليل الباتشات...
                    </Typography>
                </Box>
            ) : (
                <>
                    {/* KPI Cards */}
                    <Grid container spacing={2.5} mb={3}>
                        <Grid item xs={12} sm={6} md={3}>
                            <Card
                                sx={{
                                    borderRadius: 3,
                                    border: '1px solid #e2e8f0',
                                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.05)',
                                    bgcolor: '#ffffff',
                                    position: 'relative',
                                    overflow: 'hidden'
                                }}
                            >
                                <Box
                                    sx={{
                                        position: 'absolute',
                                        right: -10,
                                        top: -10,
                                        width: 80,
                                        height: 80,
                                        borderRadius: '50%',
                                        bgcolor: alpha(theme.palette.primary.main, 0.08)
                                    }}
                                />
                                <CardContent sx={{ p: 2.5 }}>
                                    <Box display="flex" alignItems="center" gap={1} mb={1}>
                                        <MoneyIcon color="primary" />
                                        <Typography variant="body2" color="text.secondary" fontWeight="600">
                                            إجمالي قيمة المخزون الحالي
                                        </Typography>
                                    </Box>
                                    <Typography variant="h5" fontWeight="900" color="primary.main">
                                        {formatCurrency(summary.total_stock_value)}
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary">
                                        محسوبة بالتكلفة الفعلية لكل باتش
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>

                        <Grid item xs={12} sm={6} md={3}>
                            <Card
                                sx={{
                                    borderRadius: 3,
                                    border: '1px solid #e2e8f0',
                                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.05)',
                                    bgcolor: '#ffffff',
                                    position: 'relative',
                                    overflow: 'hidden'
                                }}
                            >
                                <Box
                                    sx={{
                                        position: 'absolute',
                                        right: -10,
                                        top: -10,
                                        width: 80,
                                        height: 80,
                                        borderRadius: '50%',
                                        bgcolor: alpha(theme.palette.success.main, 0.08)
                                    }}
                                />
                                <CardContent sx={{ p: 2.5 }}>
                                    <Box display="flex" alignItems="center" gap={1} mb={1}>
                                        <InventoryIcon color="success" />
                                        <Typography variant="body2" color="text.secondary" fontWeight="600">
                                            إجمالي كمية المخزون المتاح
                                        </Typography>
                                    </Box>
                                    <Typography variant="h5" fontWeight="900" color="success.dark">
                                        {formatNumber(summary.total_stock_quantity)}
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary">
                                        {summary.in_stock_products_count} صنف متوفر من أصل {summary.total_products_count}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>

                        <Grid item xs={12} sm={6} md={3}>
                            <Card
                                sx={{
                                    borderRadius: 3,
                                    border: '1px solid #e2e8f0',
                                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.05)',
                                    bgcolor: '#ffffff',
                                    position: 'relative',
                                    overflow: 'hidden'
                                }}
                            >
                                <Box
                                    sx={{
                                        position: 'absolute',
                                        right: -10,
                                        top: -10,
                                        width: 80,
                                        height: 80,
                                        borderRadius: '50%',
                                        bgcolor: alpha(theme.palette.secondary.main, 0.08)
                                    }}
                                />
                                <CardContent sx={{ p: 2.5 }}>
                                    <Box display="flex" alignItems="center" gap={1} mb={1}>
                                        <CalculateIcon color="secondary" />
                                        <Typography variant="body2" color="text.secondary" fontWeight="600">
                                            المتوسط العام المرجح للوحدة
                                        </Typography>
                                    </Box>
                                    <Typography variant="h5" fontWeight="900" color="secondary.main">
                                        {formatCurrency(summary.overall_weighted_avg_cost)}
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary">
                                        (إجمالي القيمة ÷ إجمالي الكمية)
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>

                        <Grid item xs={12} sm={6} md={3}>
                            <Card
                                sx={{
                                    borderRadius: 3,
                                    border: '1px solid #e2e8f0',
                                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.05)',
                                    bgcolor: '#ffffff',
                                    position: 'relative',
                                    overflow: 'hidden'
                                }}
                            >
                                <Box
                                    sx={{
                                        position: 'absolute',
                                        right: -10,
                                        top: -10,
                                        width: 80,
                                        height: 80,
                                        borderRadius: '50%',
                                        bgcolor: alpha('#f59e0b', 0.08)
                                    }}
                                />
                                <CardContent sx={{ p: 2.5 }}>
                                    <Box display="flex" alignItems="center" gap={1} mb={1}>
                                        <TrendingUpIcon sx={{ color: '#f59e0b' }} />
                                        <Typography variant="body2" color="text.secondary" fontWeight="600">
                                            إجمالي قيمة الواردات
                                        </Typography>
                                    </Box>
                                    <Typography variant="h5" fontWeight="900" sx={{ color: '#d97706' }}>
                                        {formatCurrency(summary.total_inflow_value)}
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary">
                                        متوسط تكلفة الوارد: {formatCurrency(summary.overall_inflow_avg_cost)}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>

                    {/* Charts Section */}
                    <Collapse in={showCharts}>
                        <Grid container spacing={2.5} mb={3}>
                            {/* Top Stock Value Products */}
                            <Grid item xs={12} md={7}>
                                <Paper
                                    elevation={0}
                                    sx={{
                                        p: 3,
                                        borderRadius: 3,
                                        border: '1px solid #e2e8f0',
                                        height: 380
                                    }}
                                >
                                    <Typography variant="subtitle1" fontWeight="bold" mb={2}>
                                        أعلى الأصناف من حيث إجمالي قيمة المخزون
                                    </Typography>
                                    <ResponsiveContainer width="100%" height={300}>
                                        <BarChart data={charts.topValueProducts} layout="vertical" margin={{ left: 10, right: 30, top: 10, bottom: 10 }}>
                                            <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                                            <XAxis type="number" tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
                                            <YAxis dataKey="name" type="category" width={140} tick={{ fontSize: 11 }} />
                                            <RechartsTooltip
                                                formatter={(value) => [formatCurrency(value), 'قيمة المخزون']}
                                                labelFormatter={(label) => `المنتج: ${label}`}
                                            />
                                            <Bar dataKey="value" fill="#3b82f6" radius={[0, 6, 6, 0]} name="القيمة الإجمالية" />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </Paper>
                            </Grid>

                            {/* Cost vs Selling Price Comparison */}
                            <Grid item xs={12} md={5}>
                                <Paper
                                    elevation={0}
                                    sx={{
                                        p: 3,
                                        borderRadius: 3,
                                        border: '1px solid #e2e8f0',
                                        height: 380
                                    }}
                                >
                                    <Typography variant="subtitle1" fontWeight="bold" mb={2}>
                                        مقارنة التكاليف وسعر البيع لأهم الأصناف
                                    </Typography>
                                    <ResponsiveContainer width="100%" height={300}>
                                        <BarChart data={charts.costComparisonChart} margin={{ top: 10, right: 10, left: 0, bottom: 40 }}>
                                            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                                            <XAxis dataKey="name" angle={-30} textAnchor="end" interval={0} tick={{ fontSize: 10 }} />
                                            <YAxis />
                                            <RechartsTooltip formatter={(value) => formatCurrency(value)} />
                                            <Legend verticalAlign="top" height={36} />
                                            <Bar dataKey="avgCost" name="متوسط التكلفة" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                                            <Bar dataKey="catalogCost" name="تكلفة البطاقة" fill="#94a3b8" radius={[4, 4, 0, 0]} />
                                            <Bar dataKey="sellingPrice" name="سعر البيع" fill="#10b981" radius={[4, 4, 0, 0]} />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </Paper>
                            </Grid>
                        </Grid>
                    </Collapse>

                    {/* Main Table */}
                    <Paper
                        elevation={0}
                        sx={{
                            p: 2,
                            borderRadius: 3,
                            border: '1px solid #e2e8f0',
                            bgcolor: '#ffffff'
                        }}
                    >
                        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2} px={1}>
                            <Typography variant="h6" fontWeight="bold">
                                جدول متوسط التكلفة وتفاصيل الأصناف
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                اضغط على السهم بجانب أي صنف لاستعراض تشغيلاته (Batches) والمخازن المتوفر بها
                            </Typography>
                        </Box>

                        <MaterialReactTable
                            {...defaultTableProps}
                            tableInstanceRef={tableRef}
                            columns={columns}
                            data={items}
                            enableRowSelection={false}
                            enableExpanding={true}
                            enableBottomToolbar={true}
                            enableTableHead={true}
                            muiTablePaperProps={{
                                elevation: 0,
                                sx: { border: 'none' }
                            }}
                            renderDetailPanel={({ row }) => {
                                const batches = row.original.batches || [];
                                if (batches.length === 0) {
                                    return (
                                        <Box p={3} bgcolor="#f8fafc" textAlign="center">
                                            <Typography variant="body2" color="text.secondary">
                                                لا توجد تشغيلات (Batches) متوفرة في المخازن حالياً لهذا الصنف.
                                            </Typography>
                                        </Box>
                                    );
                                }

                                return (
                                    <Box p={2.5} bgcolor="#f8fafc" borderRadius={2} m={1} border="1px solid #e2e8f0">
                                        <Box display="flex" alignItems="center" gap={1} mb={1.5}>
                                            <LayersIcon color="primary" fontSize="small" />
                                            <Typography variant="subtitle2" fontWeight="bold" color="primary.main">
                                                تفاصيل تشغيلات ومخازن: {row.original.product_name}
                                            </Typography>
                                        </Box>

                                        <Box sx={{ overflowX: 'auto' }}>
                                            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                                                <thead>
                                                    <tr style={{ backgroundColor: '#e2e8f0', color: '#334155', textAlign: 'right' }}>
                                                        <th style={{ padding: '8px 12px', borderRadius: '4px 0 0 4px' }}>المخزن</th>
                                                        <th style={{ padding: '8px 12px' }}>رقم التشغيلة (Batch No)</th>
                                                        <th style={{ padding: '8px 12px' }}>تاريخ الصلاحية</th>
                                                        <th style={{ padding: '8px 12px' }}>الكمية المتاحة</th>
                                                        <th style={{ padding: '8px 12px' }}>تكلفة الوحدة للتشغيلة</th>
                                                        <th style={{ padding: '8px 12px', borderRadius: '0 4px 4px 0' }}>إجمالي قيمة التشغيلة</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {batches.map((b, idx) => (
                                                        <tr
                                                            key={idx}
                                                            style={{
                                                                borderBottom: '1px solid #edf2f7',
                                                                backgroundColor: idx % 2 === 0 ? '#ffffff' : '#f8fafc'
                                                            }}
                                                        >
                                                            <td style={{ padding: '8px 12px', fontWeight: 'bold' }}>{b.warehouse_name}</td>
                                                            <td style={{ padding: '8px 12px' }}>
                                                                <Chip label={b.batch_number} size="small" variant="outlined" />
                                                            </td>
                                                            <td style={{ padding: '8px 12px' }}>
                                                                {b.expiry_date ? new Date(b.expiry_date).toLocaleDateString('ar-EG') : 'غير محدد'}
                                                            </td>
                                                            <td style={{ padding: '8px 12px', fontWeight: 'bold' }}>{formatNumber(b.quantity)}</td>
                                                            <td style={{ padding: '8px 12px', color: '#8b5cf6', fontWeight: 'bold' }}>
                                                                {formatCurrency(b.unit_cost)}
                                                            </td>
                                                            <td style={{ padding: '8px 12px', color: '#1e40af', fontWeight: '900' }}>
                                                                {formatCurrency(b.total_value)}
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </Box>
                                    </Box>
                                );
                            }}
                        />
                    </Paper>
                </>
            )}
        </Box>
    );
};

export default ProductAverageCostReportPage;
