import React, { useState, useEffect, useMemo } from 'react';
import {
    Box, Typography, Button, CircularProgress, Paper,
    Grid, Card, CardContent, ToggleButton, ToggleButtonGroup,
    FormControlLabel, Switch, useTheme, Chip, Avatar
} from '@mui/material';
import {
    Download as DownloadIcon,
    ArrowBack as BackIcon,
    TableChart as TableIcon,
    PivotTableChart as PivotIcon,
    TrendingUp as TrendingUpIcon,
    Inventory as InventoryIcon,
    Warning as WarningIcon,
    AttachMoney as MoneyIcon
} from '@mui/icons-material';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip,
    Legend, ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts';
import { useNavigate } from 'react-router-dom';
import { MaterialReactTable } from 'material-react-table';
import reportsApi from '../api/reportsApi';
import { defaultTableProps } from "../config/tableConfig";
import { exportToExcel } from '../utils/exportUtils';
import { alpha } from '@mui/material/styles';

const WarehouseReportPage = () => {
    const navigate = useNavigate();
    const theme = useTheme();
    const [loading, setLoading] = useState(false);
    const [summary, setSummary] = useState({});
    const [warehouseChart, setWarehouseChart] = useState([]);
    const [lowStockItems, setLowStockItems] = useState([]);
    const [detailedList, setDetailedList] = useState([]);
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

    // View State
    const [viewMode, setViewMode] = useState('pivot'); // 'list' or 'pivot' - default to pivot for "wow" factor
    const [pivotMetric, setPivotMetric] = useState('quantity'); // 'quantity' or 'total_value'
    const [showHeatmap, setShowHeatmap] = useState(true);

    const fetchReport = async () => {
        setLoading(true);
        try {
            const res = await reportsApi.getWarehouseReport({ date });
            setSummary(res.data.summary);
            setWarehouseChart(res.data.warehouseChart || []);
            setLowStockItems(res.data.lowStockItems || []);
            setDetailedList(res.data.detailedList || []);
        } catch (error) {
            console.error('Error fetching warehouse report:', error);
            // alert('خطأ في جلب تقرير المخازن'); // Suppress alert for cleaner UX
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReport();
    }, [date]);

    // --- Formatters ---
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('ar-EG', {
            style: 'currency',
            currency: 'EGP',
            maximumFractionDigits: 0
        }).format(amount || 0);
    };

    const formatNumber = (num) => {
        return new Intl.NumberFormat('ar-EG').format(num || 0);
    };

    // --- List View Columns ---
    const listColumns = useMemo(() => [
        { accessorKey: 'id', header: 'ID', size: 60 },
        { accessorKey: 'product', header: 'المنتج', size: 200 },
        { accessorKey: 'warehouse', header: 'المخزن' },
        {
            accessorKey: 'quantity',
            header: 'الكمية',
            Cell: ({ cell }) => <Box fontWeight="bold">{cell.getValue()}</Box>
        },
        {
            accessorKey: 'cost_price',
            header: 'سعر التكلفة',
            Cell: ({ cell }) => formatCurrency(cell.getValue())
        },
        {
            accessorKey: 'total_value',
            header: 'القيمة الإجمالية',
            Cell: ({ cell }) => (
                <Chip
                    label={formatCurrency(cell.getValue())}
                    color="primary"
                    variant="outlined"
                    size="small"
                />
            )
        }
    ], []);

    // --- Chart Colors ---
    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AF19FF', '#FF19A3'];

    // --- Pivot Data Logic ---
    const { pivotColumns, pivotData, maxMetricValue } = useMemo(() => {
        if (!detailedList.length) return { pivotColumns: [], pivotData: [], maxMetricValue: 0 };

        const warehouses = [...new Set(detailedList.map(item => item.warehouse || 'Unknown'))].sort();
        const products = [...new Set(detailedList.map(item => item.product))].sort();

        let maxVal = 0;

        // Generate Data Matrix first to find max value for heatmap
        const matrix = products.map(prod => {
            const row = { product: prod, total: 0 };
            warehouses.forEach(w => {
                const item = detailedList.find(i => i.product === prod && (i.warehouse || 'Unknown') === w);
                let val = 0;
                if (item) {
                    val = pivotMetric === 'quantity' ? parseFloat(item.quantity) : parseFloat(item.total_value);
                }
                row[w] = val;
                row.total += val;
                if (val > maxVal) maxVal = val;
            });
            return row;
        });

        // Helper for Heatmap Color
        const getHeatmapStyle = (value) => {
            if (!showHeatmap || !value) return {};
            const percentage = Math.min((value / maxVal) * 100, 100);
            // Use alpha for opacity based on value
            const opacity = 0.1 + (0.9 * (percentage / 100));
            return {
                backgroundColor: pivotMetric === 'quantity'
                    ? alpha(theme.palette.success.main, opacity)
                    : alpha(theme.palette.primary.main, opacity),
                color: percentage > 50 ? '#fff' : 'inherit',
                borderRadius: '4px',
                padding: '4px',
                textAlign: 'center',
                fontWeight: percentage > 50 ? 'bold' : 'normal'
            };
        };

        // Generate Columns
        const cols = [
            {
                accessorKey: 'product',
                header: 'المنتج',
                size: 200,
                enablePinning: true,
                muiTableBodyCellProps: {
                    sx: { fontWeight: 'bold', bgcolor: '#f5f5f5' }
                }
            },
            ...warehouses.map(w => ({
                accessorKey: w,
                header: w,
                size: 110,
                Cell: ({ cell }) => {
                    const val = cell.getValue();
                    return (
                        <Box sx={getHeatmapStyle(val)}>
                            {pivotMetric === 'total_value' ? formatCurrency(val) : val}
                        </Box>
                    );
                },
                aggregationFn: 'sum', // Allow MRT to sum this column if grouped? (Not strictly needed for flattened pivot but good practice)
                Footer: ({ table }) => {
                    // Calculate column total
                    const total = table.getFilteredRowModel().rows.reduce((sum, row) => sum + (row.getValue(w) || 0), 0);
                    return (
                        <Box fontWeight="bold" color="primary.main">
                            {pivotMetric === 'total_value' ? formatCurrency(total) : total}
                        </Box>
                    );
                }
            })),
            {
                accessorKey: 'total',
                header: 'الإجمالي',
                size: 120,
                Cell: ({ cell }) => (
                    <Box fontWeight="900" color="secondary.main">
                        {pivotMetric === 'total_value' ? formatCurrency(cell.getValue()) : cell.getValue()}
                    </Box>
                ),
                Footer: ({ table }) => {
                    const total = table.getFilteredRowModel().rows.reduce((sum, row) => sum + (row.getValue('total') || 0), 0);
                    return <Box fontWeight="bold" fontSize="1.1rem">{pivotMetric === 'total_value' ? formatCurrency(total) : total}</Box>;
                }
            }
        ];

        return { pivotColumns: cols, pivotData: matrix, maxMetricValue: maxVal };
    }, [detailedList, pivotMetric, showHeatmap, theme]);

    return (
        <Box p={{ xs: 2, md: 4 }} sx={{ bgcolor: '#f8f9fa', minHeight: '100vh' }}>
            {/* Header Section */}
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, justifyContent: 'space-between', alignItems: 'center', mb: 4, gap: 2 }}>
                <Box>
                    <Typography variant="h4" sx={{ fontWeight: '800', color: '#1a237e', mb: 1 }}>
                        <InventoryIcon sx={{ verticalAlign: 'middle', mr: 1, fontSize: 40 }} />
                        لوحة تحليل المخزون
                    </Typography>
                    <Typography variant="body1" color="textSecondary">
                        نظرة شاملة على توزيع الكميات والقيم عبر المخازن
                    </Typography>
                </Box>

                <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', bgcolor: '#fff', p: 1, borderRadius: 2, boxShadow: 1 }}>
                    <input
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        style={{
                            padding: '10px',
                            fontSize: '16px',
                            border: '1px solid #ddd',
                            borderRadius: '8px',
                            outline: 'none'
                        }}
                    />
                    <Button
                        variant="contained"
                        onClick={fetchReport}
                        sx={{ borderRadius: 2, height: '42px', px: 3, fontWeight: 'bold' }}
                    >
                        تحديث
                    </Button>
                    <Button
                        variant="outlined"
                        startIcon={<BackIcon />}
                        onClick={() => navigate('/reports-dashboard')}
                        sx={{ borderRadius: 2, height: '42px' }}
                    >
                        رجوع
                    </Button>
                </Box>
            </Box>

            {loading ? (
                <Box display="flex" justifyContent="center" mt={10} flexDirection="column" alignItems="center">
                    <CircularProgress size={60} thickness={4} />
                    <Typography mt={2} color="textSecondary">جاري تحليل البيانات...</Typography>
                </Box>
            ) : (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>

                    {/* KPI Cards */}
                    <Grid container spacing={3}>
                        <Grid item xs={12} md={4}>
                            <Card sx={{
                                bgcolor: '#fff',
                                boxShadow: 3,
                                borderRadius: 4,
                                overflow: 'hidden',
                                position: 'relative'
                            }}>
                                <Box sx={{
                                    position: 'absolute', right: -20, top: -20,
                                    width: 100, height: 100, borderRadius: '50%',
                                    bgcolor: alpha(theme.palette.primary.main, 0.1)
                                }} />
                                <CardContent sx={{ position: 'relative', zIndex: 1 }}>
                                    <Box display="flex" alignItems="center" mb={1}>
                                        <MoneyIcon color="primary" />
                                        <Typography variant="subtitle1" fontWeight="bold" color="textSecondary" ml={1}>
                                            إجمالي قيمة المخزون
                                        </Typography>
                                    </Box>
                                    <Typography variant="h4" fontWeight="900" color="primary.main">
                                        {formatCurrency(summary.totalStockValue)}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <Card sx={{
                                bgcolor: '#fff',
                                boxShadow: 3,
                                borderRadius: 4,
                                overflow: 'hidden',
                                position: 'relative'
                            }}>
                                <Box sx={{
                                    position: 'absolute', right: -20, top: -20,
                                    width: 100, height: 100, borderRadius: '50%',
                                    bgcolor: alpha(theme.palette.success.main, 0.1)
                                }} />
                                <CardContent>
                                    <Box display="flex" alignItems="center" mb={1}>
                                        <InventoryIcon color="success" />
                                        <Typography variant="subtitle1" fontWeight="bold" color="textSecondary" ml={1}>
                                            إجمالي عدد الأصناف
                                        </Typography>
                                    </Box>
                                    <Typography variant="h4" fontWeight="900" color="success.main">
                                        {formatNumber(summary.totalItems)}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <Card sx={{
                                bgcolor: '#fff',
                                boxShadow: 3,
                                borderRadius: 4,
                                overflow: 'hidden',
                                position: 'relative'
                            }}>
                                <Box sx={{
                                    position: 'absolute', right: -20, top: -20,
                                    width: 100, height: 100, borderRadius: '50%',
                                    bgcolor: alpha(theme.palette.error.main, 0.1)
                                }} />
                                <CardContent>
                                    <Box display="flex" alignItems="center" mb={1}>
                                        <WarningIcon color="error" />
                                        <Typography variant="subtitle1" fontWeight="bold" color="textSecondary" ml={1}>
                                            نواقص المخزون
                                        </Typography>
                                    </Box>
                                    <Typography variant="h4" fontWeight="900" color="error.main">
                                        {summary.lowStockCount} <Typography component="span" variant="body2" color="textSecondary">أصناف</Typography>
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>

                    {/* Controls & Metrics */}
                    <Box sx={{
                        p: 2,
                        bgcolor: '#fff',
                        borderRadius: 3,
                        boxShadow: 1,
                        display: 'flex',
                        flexWrap: 'wrap',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        gap: 2
                    }}>
                        <ToggleButtonGroup
                            value={viewMode}
                            exclusive
                            onChange={(e, val) => val && setViewMode(val)}
                            aria-label="view mode"
                            color="primary"
                            sx={{ boxShadow: 1 }}
                        >
                            <ToggleButton value="pivot" sx={{ px: 3 }}>
                                <PivotIcon sx={{ mr: 1 }} /> جدول محوري (Pivot)
                            </ToggleButton>
                            <ToggleButton value="list" sx={{ px: 3 }}>
                                <TableIcon sx={{ mr: 1 }} /> قائمة تفصيلية
                            </ToggleButton>
                        </ToggleButtonGroup>

                        {viewMode === 'pivot' && (
                            <Box display="flex" alignItems="center" gap={3}>
                                <FormControlLabel
                                    control={
                                        <Switch
                                            checked={showHeatmap}
                                            onChange={(e) => setShowHeatmap(e.target.checked)}
                                            color="secondary"
                                        />
                                    }
                                    label="Heatmap Visualization"
                                />
                                <Box sx={{ bgcolor: '#f0f4f8', p: 0.5, borderRadius: 2, display: 'flex' }}>
                                    <Button
                                        variant={pivotMetric === 'quantity' ? 'contained' : 'text'}
                                        color="success"
                                        onClick={() => setPivotMetric('quantity')}
                                        sx={{ borderRadius: 2 }}
                                        size="small"
                                    >
                                        تحليل الكميات
                                    </Button>
                                    <Button
                                        variant={pivotMetric === 'total_value' ? 'contained' : 'text'}
                                        color="primary"
                                        onClick={() => setPivotMetric('total_value')}
                                        sx={{ borderRadius: 2 }}
                                        size="small"
                                    >
                                        تحليل القيم
                                    </Button>
                                </Box>
                            </Box>
                        )}
                    </Box>

                    {/* Main Content Area */}
                    <Grid container spacing={3}>
                        {/* Charts Section (Adaptive) */}
                        <Grid item xs={12} lg={4}>
                            <Paper sx={{ p: 3, height: '100%', borderRadius: 3, boxShadow: 2, minHeight: 400 }}>
                                <Typography variant="h6" fontWeight="bold" gutterBottom>
                                    توزيع قيمة المخزون
                                </Typography>
                                <ResponsiveContainer width="100%" height={300}>
                                    <PieChart>
                                        <Pie
                                            data={warehouseChart}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={60}
                                            outerRadius={100}
                                            paddingAngle={5}
                                            dataKey="value"
                                        >
                                            {warehouseChart.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <RechartsTooltip formatter={(value) => formatCurrency(value)} />
                                        <Legend wrapperStyle={{ paddingTop: '20px' }} />
                                    </PieChart>
                                </ResponsiveContainer>
                            </Paper>
                        </Grid>

                        {/* Table Section */}
                        <Grid item xs={12} lg={8}>
                            <Paper sx={{ p: 2, borderRadius: 3, boxShadow: 2, overflow: 'hidden' }}>
                                <Typography variant="h6" display="flex" alignItems="center" gap={1} mb={2} fontWeight="bold">
                                    {viewMode === 'list' ? 'بيانات تفصيلية' : `تحليل ${pivotMetric === 'quantity' ? 'الكميات' : 'القيم المالية'} حسب المخزن`}
                                </Typography>
                                <MaterialReactTable
                                    columns={viewMode === 'list' ? listColumns : pivotColumns}
                                    data={viewMode === 'list' ? detailedList : pivotData}
                                    enableColumnPinning
                                    enableStickyHeader
                                    muiTableContainerProps={{ sx: { maxHeight: '600px' } }}
                                    muiTableHeadCellProps={{
                                        sx: {
                                            bgcolor: theme.palette.mode === 'dark' ? '#333' : '#f5f5f5',
                                            fontWeight: 'bold',
                                            fontSize: '14px'
                                        }
                                    }}
                                    renderTopToolbarCustomActions={({ table }) => (
                                        <Button
                                            variant="outlined"
                                            startIcon={<DownloadIcon />}
                                            onClick={() => {
                                                exportToExcel(
                                                    table.getFilteredRowModel().rows,
                                                    table.getVisibleLeafColumns(),
                                                    viewMode === 'pivot' ? `Warehouse_Pivot_${pivotMetric}` : 'Warehouse_Detailed',
                                                    {
                                                        heatmap: viewMode === 'pivot',
                                                        freezeColumns: 1
                                                    }
                                                );
                                            }}
                                        >
                                            تصدير {viewMode === 'pivot' ? 'محوري' : 'كامل'} Excel
                                        </Button>
                                    )}
                                    initialState={{
                                        columnPinning: { left: ['product'] },
                                        pagination: { pageSize: 20 },
                                        density: 'compact'
                                    }}
                                    state={{
                                        isLoading: loading
                                    }}
                                    {...defaultTableProps} // Spread at the end but override state/initialState if needed
                                    // Ensure specific props we set above aren't overridden if defaultTableProps has them
                                    enableRowNumbers={viewMode === 'list'}
                                />
                            </Paper>
                        </Grid>
                    </Grid>

                    {/* Low Stock Alert Section */}
                    {lowStockItems.length > 0 && (
                        <Paper sx={{ p: 3, borderRadius: 3, borderLeft: '6px solid #ff9800', bgcolor: '#fff3e0' }}>
                            <Typography variant="h6" color="#e65100" fontWeight="bold" gutterBottom display="flex" alignItems="center">
                                <WarningIcon sx={{ mr: 1 }} /> تنبيهات انخفاض المخزون
                            </Typography>
                            <Grid container spacing={2}>
                                {lowStockItems.slice(0, 6).map((item, idx) => (
                                    <Grid item xs={12} sm={6} md={4} key={idx}>
                                        <Box sx={{
                                            bgcolor: '#fff', p: 2, borderRadius: 2,
                                            display: 'flex', justifyContent: 'space-between', alignItems: 'center'
                                        }}>
                                            <Box>
                                                <Typography variant="subtitle2" fontWeight="bold">{item.product}</Typography>
                                                <Typography variant="caption" color="textSecondary">{item.warehouse}</Typography>
                                            </Box>
                                            <Chip label={`${item.quantity} وحدة`} color="error" size="small" />
                                        </Box>
                                    </Grid>
                                ))}
                                {lowStockItems.length > 6 && (
                                    <Grid item xs={12}>
                                        <Typography variant="caption" color="textSecondary">
                                            +{lowStockItems.length - 6} منتجات أخرى...
                                        </Typography>
                                    </Grid>
                                )}
                            </Grid>
                        </Paper>
                    )}
                </Box>
            )}
        </Box>
    );
};

export default WarehouseReportPage;
