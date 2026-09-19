import React, { useState, useEffect, useMemo } from 'react';
import {
    Container,
    Typography,
    Box,
    Card,
    CardContent,
    Grid,
    CircularProgress,
    Alert,
    TextField,
    Button,
    Stack,
    MenuItem,
    Select,
    FormControl,
    InputLabel,
    Breadcrumbs
} from '@mui/material';
import { Link } from 'react-router-dom';
import { MaterialReactTable } from 'material-react-table';
import { MRT_Localization_AR } from 'material-react-table/locales/ar';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import BusinessIcon from '@mui/icons-material/Business';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import reportsApi from '../api/reportsApi';

const formatCurrency = (amount) => {
    return new Intl.NumberFormat('ar-EG', {
        style: 'currency',
        currency: 'EGP',
        minimumFractionDigits: 2
    }).format(amount || 0);
};

const AssetsReportPage = () => {
    const todayStr = new Date().toISOString().split('T')[0];
    const currentYear = new Date().getFullYear();
    
    const [startDate, setStartDate] = useState(`${currentYear}-01-01`);
    const [endDate, setEndDate] = useState(todayStr);
    const [periodType, setPeriodType] = useState('year'); // month, quarter, year, custom
    
    const [data, setData] = useState([]);
    const [summary, setSummary] = useState({ total_fixed: 0, total_current: 0, total_assets: 0 });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const handlePeriodChange = (e) => {
        const type = e.target.value;
        setPeriodType(type);
        const today = new Date();

        if (type === 'month') {
            const y = today.getFullYear();
            const m = today.getMonth();
            const start = new Date(y, m, 1).toISOString().split('T')[0];
            const end = new Date(y, m + 1, 0).toISOString().split('T')[0];
            setStartDate(start);
            setEndDate(end);
        } else if (type === 'quarter') {
            const y = today.getFullYear();
            const q = Math.floor(today.getMonth() / 3);
            const start = new Date(y, q * 3, 1).toISOString().split('T')[0];
            const end = new Date(y, (q + 1) * 3, 0).toISOString().split('T')[0];
            setStartDate(start);
            setEndDate(end);
        } else if (type === 'year') {
            setStartDate(`${currentYear}-01-01`);
            setEndDate(todayStr);
        } else if (type === 'all') {
            setStartDate('2020-01-01');
            setEndDate(todayStr);
        }
    };

    const fetchData = async () => {
        setLoading(true);
        try {
            const response = await reportsApi.getAssetsReport({ startDate, endDate });
            setData(response.data.data);
            setSummary(response.data.summary);
            setError(null);
        } catch (err) {
            console.error('Error fetching assets report:', err);
            setError('حدث خطأ أثناء جلب تقرير الأصول. الرجاء التحقق من البيانات أو الاتصال بالمسؤول.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [startDate, endDate]);

    const handleExport = async () => {
        try {
            const response = await reportsApi.exportReport('assets', { startDate, endDate });
            const blob = new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `تقرير_الأصول_${startDate}_إلى_${endDate}.xlsx`);
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (err) {
            console.error('Error exporting report:', err);
            alert('حدث خطأ أثناء تصدير التقرير إلى ملف Excel');
        }
    };

    const columns = useMemo(
        () => [
            {
                accessorKey: 'id',
                header: 'رقم الحساب',
                size: 80,
                muiTableBodyCellProps: { align: 'center' },
            },
            {
                accessorKey: 'name',
                header: 'اسم الحساب',
                size: 200,
                Cell: ({ row, cell }) => (
                    <Typography 
                        variant="body2" 
                        sx={{ 
                            fontWeight: row.original.is_parent ? 'bold' : 'normal',
                            paddingLeft: row.original.parent_id === 1 ? '0px' : row.original.parent_id ? '16px' : '0px'
                        }}
                    >
                        {cell.getValue()}
                    </Typography>
                )
            },
            {
                accessorKey: 'parent_name',
                header: 'الحساب الرئيسي',
                size: 150,
                muiTableBodyCellProps: { align: 'center' },
            },
            {
                accessorKey: 'classification',
                header: 'تصنيف الأصل',
                size: 130,
                muiTableBodyCellProps: { align: 'center' },
                Cell: ({ cell }) => {
                    const value = cell.getValue();
                    const isFixed = value === 'أصول ثابتة';
                    const isCurrent = value === 'أصول متداولة';
                    const isTotal = value === 'إجمالي الأصول';
                    
                    return (
                        <Box
                            sx={{
                                display: 'inline-block',
                                px: 1.5,
                                py: 0.5,
                                borderRadius: '12px',
                                fontSize: '0.8rem',
                                fontWeight: 'bold',
                                backgroundColor: isFixed ? 'primary.light' : isCurrent ? 'warning.light' : isTotal ? 'info.light' : 'grey.200',
                                color: isFixed ? 'primary.contrastText' : isCurrent ? 'warning.contrastText' : isTotal ? 'info.contrastText' : 'text.primary',
                            }}
                        >
                            {value}
                        </Box>
                    );
                }
            },
            {
                accessorKey: 'opening_balance',
                header: 'رصيد أول المدة',
                size: 130,
                Cell: ({ cell, row }) => (
                    <Typography variant="body2" sx={{ fontWeight: row.original.is_parent ? 'bold' : 'normal' }}>
                        {formatCurrency(cell.getValue())}
                    </Typography>
                ),
                muiTableBodyCellProps: { align: 'right' },
            },
            {
                accessorKey: 'debit',
                header: 'مدين الفترة',
                size: 130,
                Cell: ({ cell, row }) => (
                    <Typography variant="body2" sx={{ color: 'success.main', fontWeight: row.original.is_parent ? 'bold' : 'normal' }}>
                        {cell.getValue() > 0 ? `+${formatCurrency(cell.getValue())}` : formatCurrency(cell.getValue())}
                    </Typography>
                ),
                muiTableBodyCellProps: { align: 'right' },
            },
            {
                accessorKey: 'credit',
                header: 'دائن الفترة',
                size: 130,
                Cell: ({ cell, row }) => (
                    <Typography variant="body2" sx={{ color: 'error.main', fontWeight: row.original.is_parent ? 'bold' : 'normal' }}>
                        {cell.getValue() > 0 ? `-${formatCurrency(cell.getValue())}` : formatCurrency(cell.getValue())}
                    </Typography>
                ),
                muiTableBodyCellProps: { align: 'right' },
            },
            {
                accessorKey: 'closing_balance',
                header: 'الرصيد الختامي',
                size: 130,
                Cell: ({ cell, row }) => (
                    <Typography variant="body2" sx={{ fontWeight: 'bold', color: 'primary.dark' }}>
                        {formatCurrency(cell.getValue())}
                    </Typography>
                ),
                muiTableBodyCellProps: { align: 'right' },
            },
        ],
        [],
    );

    return (
        <Container maxWidth="xl" sx={{ direction: 'rtl', mt: 4, mb: 6 }}>
            {/* Breadcrumbs */}
            <Breadcrumbs sx={{ mb: 3 }}>
                <Link to="/" style={{ textDecoration: 'none', color: '#666' }}>الرئيسية</Link>
                <Link to="/reports-dashboard" style={{ textDecoration: 'none', color: '#666' }}>لوحة التقارير</Link>
                <Typography color="text.primary" sx={{ fontWeight: 'bold' }}>تقرير الأصول</Typography>
            </Breadcrumbs>

            {/* Header section */}
            <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ mb: 4 }}>
                <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                    تقرير أرصدة وحركات الأصول
                </Typography>
                <Button
                    color="primary"
                    onClick={handleExport}
                    startIcon={<FileDownloadIcon />}
                    variant="contained"
                    sx={{ px: 3, py: 1, borderRadius: '8px', fontWeight: 'bold' }}
                >
                    تصدير إلى Excel
                </Button>
            </Box>

            {/* Date Filters Section */}
            <Card sx={{ p: 2, mb: 4, borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
                <Grid container spacing={3} alignItems="center">
                    <Grid item xs={12} md={3}>
                        <FormControl fullWidth size="small">
                            <InputLabel id="period-label">تصفية سريعة</InputLabel>
                            <Select
                                labelId="period-label"
                                value={periodType}
                                label="تصفية سريعة"
                                onChange={handlePeriodChange}
                            >
                                <MenuItem value="month">الشهر الحالي</MenuItem>
                                <MenuItem value="quarter">الربع المالي الحالي</MenuItem>
                                <MenuItem value="year">العام الحالي</MenuItem>
                                <MenuItem value="all">كل الأوقات</MenuItem>
                                <MenuItem value="custom">فترة مخصصة</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} md={3}>
                        <TextField
                            label="من تاريخ"
                            type="date"
                            fullWidth
                            size="small"
                            value={startDate}
                            disabled={periodType !== 'custom'}
                            onChange={(e) => setStartDate(e.target.value)}
                            InputLabelProps={{ shrink: true }}
                        />
                    </Grid>
                    <Grid item xs={12} md={3}>
                        <TextField
                            label="إلى تاريخ"
                            type="date"
                            fullWidth
                            size="small"
                            value={endDate}
                            disabled={periodType !== 'custom'}
                            onChange={(e) => setEndDate(e.target.value)}
                            InputLabelProps={{ shrink: true }}
                        />
                    </Grid>
                    <Grid item xs={12} md={3}>
                        <Button 
                            variant="outlined" 
                            color="secondary" 
                            fullWidth 
                            onClick={fetchData}
                            sx={{ fontWeight: 'bold', borderRadius: '8px' }}
                        >
                            تحديث التقرير
                        </Button>
                    </Grid>
                </Grid>
            </Card>

            {/* KPI Summary Cards */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={12} md={4}>
                    <Card sx={{ 
                        background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)', 
                        color: 'white', 
                        borderRadius: '12px',
                        boxShadow: '0 4px 20px rgba(30, 60, 114, 0.2)'
                    }}>
                        <CardContent sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: 3 }}>
                            <Box>
                                <Typography variant="subtitle2" sx={{ opacity: 0.8, fontWeight: 'bold' }}>
                                    إجمالي الأصول
                                </Typography>
                                <Typography variant="h4" sx={{ fontWeight: 'bold', mt: 1 }}>
                                    {formatCurrency(summary.total_assets)}
                                </Typography>
                            </Box>
                            <AccountBalanceWalletIcon sx={{ fontSize: 50, opacity: 0.3 }} />
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} md={4}>
                    <Card sx={{ 
                        background: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)', 
                        color: 'white', 
                        borderRadius: '12px',
                        boxShadow: '0 4px 20px rgba(17, 153, 142, 0.2)'
                    }}>
                        <CardContent sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: 3 }}>
                            <Box>
                                <Typography variant="subtitle2" sx={{ opacity: 0.8, fontWeight: 'bold' }}>
                                    الأصول الثابتة
                                </Typography>
                                <Typography variant="h4" sx={{ fontWeight: 'bold', mt: 1 }}>
                                    {formatCurrency(summary.total_fixed)}
                                </Typography>
                            </Box>
                            <BusinessIcon sx={{ fontSize: 50, opacity: 0.3 }} />
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} md={4}>
                    <Card sx={{ 
                        background: 'linear-gradient(135deg, #f12711 0%, #f5af19 100%)', 
                        color: 'white', 
                        borderRadius: '12px',
                        boxShadow: '0 4px 20px rgba(241, 39, 17, 0.2)'
                    }}>
                        <CardContent sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: 3 }}>
                            <Box>
                                <Typography variant="subtitle2" sx={{ opacity: 0.8, fontWeight: 'bold' }}>
                                    الأصول المتداولة
                                </Typography>
                                <Typography variant="h4" sx={{ fontWeight: 'bold', mt: 1 }}>
                                    {formatCurrency(summary.total_current)}
                                </Typography>
                            </Box>
                            <TrendingUpIcon sx={{ fontSize: 50, opacity: 0.3 }} />
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* Error Message */}
            {error && <Alert severity="error" sx={{ mb: 3, borderRadius: '8px' }}>{error}</Alert>}

            {/* Main Table Card */}
            <Card sx={{ borderRadius: '12px', boxShadow: '0 4px 25px rgba(0,0,0,0.06)' }}>
                {loading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', my: 10, flexDirection: 'column', gap: 2 }}>
                        <CircularProgress size={50} />
                        <Typography color="text.secondary">جاري تحميل بيانات الأصول وحساب الأرصدة...</Typography>
                    </Box>
                ) : (
                    <MaterialReactTable
                        columns={columns}
                        data={data}
                        enableColumnOrdering
                        enableGlobalFilter
                        localization={MRT_Localization_AR}
                        initialState={{
                            pagination: { pageSize: 50, pageIndex: 0 },
                        }}
                        muiTablePaperProps={{
                            elevation: 0,
                            sx: { borderRadius: '12px' }
                        }}
                        muiTableBodyRowProps={({ row }) => ({
                            sx: {
                                backgroundColor: row.original.is_parent ? 'rgba(0, 0, 0, 0.02)' : 'inherit',
                                borderBottom: row.original.is_parent ? '2px solid rgba(0, 0, 0, 0.08)' : '1px solid rgba(0, 0, 0, 0.04)',
                                '&:hover': {
                                    backgroundColor: 'rgba(0, 0, 0, 0.04)',
                                }
                            }
                        })}
                    />
                )}
            </Card>
        </Container>
    );
};

export default AssetsReportPage;
