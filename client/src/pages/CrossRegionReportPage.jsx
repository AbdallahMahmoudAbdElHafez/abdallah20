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
    Paper,
    Autocomplete,
    Chip
} from '@mui/material';
import { MaterialReactTable } from 'material-react-table';
import { MRT_Localization_AR } from 'material-react-table/locales/ar';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import SearchIcon from '@mui/icons-material/Search';
import StoreIcon from '@mui/icons-material/Store';
import GppBadIcon from '@mui/icons-material/GppBad';
import reportsApi from '../api/reportsApi';
import warehousesApi from '../api/warehousesApi';

const formatCurrency = (amount) => {
    return new Intl.NumberFormat('ar-EG', {
        style: 'currency',
        currency: 'EGP',
        minimumFractionDigits: 2
    }).format(amount || 0);
};

const CrossRegionReportPage = () => {
    const [warehouses, setWarehouses] = useState([]);
    const [selectedWarehouse, setSelectedWarehouse] = useState(null);
    const [startDate, setStartDate] = useState(new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0]);
    const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);

    const [reportData, setReportData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Fetch All Warehouses
    useEffect(() => {
        const fetchWarehouses = async () => {
            try {
                const response = await warehousesApi.getAll();
                setWarehouses(response.data.sort((a, b) => a.name.localeCompare(b.name, 'ar')));
            } catch (err) {
                console.error('Error fetching warehouses:', err);
                setError('خطأ في تحميل قائمة المخازن');
            }
        };
        fetchWarehouses();
    }, []);

    const fetchReport = async () => {
        if (!selectedWarehouse) return;
        setLoading(true);
        setError(null);
        try {
            const response = await reportsApi.getCrossRegionReport({
                warehouseId: selectedWarehouse.id,
                startDate,
                endDate
            });
            setReportData(response.data);
        } catch (err) {
            console.error('Error fetching report:', err);
            setError('خطأ في جلب بيانات تقرير المخالفات الجغرافية');
        } finally {
            setLoading(false);
        }
    };

    const handleExport = async () => {
        if (!selectedWarehouse) return;
        try {
            const response = await reportsApi.exportReport('cross-region', {
                warehouseId: selectedWarehouse.id,
                startDate,
                endDate
            });

            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `تقرير_المخالفات_الجغرافية_${selectedWarehouse.name}_${startDate}_${endDate}.xlsx`);
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (err) {
            console.error('Error exporting report:', err);
            alert('خطأ في تصدير التقرير');
        }
    };

    // Calculate quick stats from loaded transactions
    const stats = useMemo(() => {
        if (!reportData || !reportData.transactions) {
            return { total: 0, salesCount: 0, returnsCount: 0, vouchersCount: 0, netSalesVal: 0 };
        }

        const transactions = reportData.transactions;
        let salesCount = 0;
        let returnsCount = 0;
        let vouchersCount = 0;
        let netSalesVal = 0;

        transactions.forEach(t => {
            if (t.type === 'sales_invoice') {
                salesCount++;
                netSalesVal += (t.amount || 0);
            } else if (t.type === 'sales_return') {
                returnsCount++;
                netSalesVal += (t.amount || 0); // returns are already negative
            } else if (t.type === 'issue_voucher') {
                vouchersCount++;
            }
        });

        return {
            total: transactions.length,
            salesCount,
            returnsCount,
            vouchersCount,
            netSalesVal
        };
    }, [reportData]);

    const columns = useMemo(
        () => [
            {
                accessorKey: 'typeLabel',
                header: 'نوع الحركة',
                size: 150,
                Cell: ({ cell, row }) => {
                    const type = row.original.type;
                    let color = 'primary';
                    if (type === 'sales_return') color = 'warning';
                    if (type === 'issue_voucher') color = 'secondary';
                    return <Chip label={cell.getValue()} color={color} size="small" variant="outlined" />;
                }
            },
            {
                accessorKey: 'referenceNo',
                header: 'رقم السند/المرجع',
                size: 130,
            },
            {
                accessorKey: 'date',
                header: 'التاريخ',
                size: 120,
                Cell: ({ cell }) => cell.getValue() ? cell.getValue().slice(0, 10) : ''
            },
            {
                accessorKey: 'partyName',
                header: 'العميل/الجهة المستلمة',
                size: 180,
            },
            {
                accessorKey: 'partyRegion',
                header: 'منطقة العميل',
                size: 180,
            },
            {
                accessorKey: 'warehouseName',
                header: 'المخزن المصدر',
                size: 150,
            },
            {
                accessorKey: 'warehouseRegion',
                header: 'منطقة المخزن',
                size: 180,
            },
            {
                accessorKey: 'amount',
                header: 'القيمة المالية',
                size: 140,
                Cell: ({ cell }) => {
                    const val = cell.getValue();
                    if (val === null) return <Typography color="text.secondary" variant="body2">-</Typography>;
                    const isPositive = val >= 0;
                    return (
                        <Typography color={isPositive ? 'success.main' : 'error.main'} sx={{ fontWeight: 'bold' }}>
                            {formatCurrency(val)}
                        </Typography>
                    );
                },
                muiTableBodyCellProps: { align: 'right' },
            },
            {
                accessorKey: 'notes',
                header: 'ملاحظات',
                size: 200,
            }
        ],
        [],
    );

    return (
        <Container maxWidth="xl">
            <Box sx={{ my: 4 }}>
                <Typography variant="h4" gutterBottom align="center" sx={{ fontWeight: 'bold', color: '#b71c1c', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 1 }}>
                    <GppBadIcon sx={{ fontSize: 35 }} />
                    تقرير المخالفات الجغرافية لحركة المخازن
                </Typography>

                <Typography variant="body1" align="center" color="text.secondary" sx={{ mb: 4 }}>
                    مراقبة وتتبع العمليات التي تمت مع عملاء خارج النطاق الجغرافي للمخزن المختار
                </Typography>

                <Paper sx={{ p: 3, mb: 4, borderRadius: 2 }}>
                    <Grid container spacing={3} alignItems="flex-end">
                        <Grid item xs={12} md={4}>
                            <Autocomplete
                                options={warehouses}
                                getOptionLabel={(option) => `${option.name} (${option.city?.name || 'بدون مدينة'})`}
                                value={selectedWarehouse}
                                onChange={(event, newValue) => setSelectedWarehouse(newValue)}
                                renderInput={(params) => <TextField {...params} label="اختر المخزن" size="small" required />}
                                fullWidth
                            />
                        </Grid>
                        <Grid item xs={12} md={3}>
                            <TextField
                                label="من تاريخ"
                                type="date"
                                fullWidth
                                size="small"
                                InputLabelProps={{ shrink: true }}
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                            />
                        </Grid>
                        <Grid item xs={12} md={3}>
                            <TextField
                                label="إلى تاريخ"
                                type="date"
                                fullWidth
                                size="small"
                                InputLabelProps={{ shrink: true }}
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                            />
                        </Grid>
                        <Grid item xs={12} md={2}>
                            <Button
                                fullWidth
                                variant="contained"
                                color="error"
                                startIcon={<SearchIcon />}
                                onClick={fetchReport}
                                disabled={loading || !selectedWarehouse}
                                sx={{ py: 1 }}
                            >
                                عرض التقرير
                            </Button>
                        </Grid>
                    </Grid>
                </Paper>

                {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

                {loading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', my: 10 }}>
                        <CircularProgress color="error" />
                    </Box>
                ) : reportData ? (
                    <>
                        <Grid container spacing={3} sx={{ mb: 4 }}>
                            <Grid item xs={12} sm={6} md={3}>
                                <Card sx={{ bgcolor: '#ffebee', borderLeft: '5px solid #d32f2f' }}>
                                    <CardContent>
                                        <Typography color="error.dark" gutterBottom sx={{ fontWeight: 'bold' }}>إجمالي الحركات المخالفة</Typography>
                                        <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'error.dark' }}>
                                            {stats.total}
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                            <Grid item xs={12} sm={6} md={3}>
                                <Card sx={{ bgcolor: '#e3f2fd', borderLeft: '5px solid #1976d2' }}>
                                    <CardContent>
                                        <Typography color="primary.dark" gutterBottom sx={{ fontWeight: 'bold' }}>فواتير مبيعات مخالفة</Typography>
                                        <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'primary.dark' }}>
                                            {stats.salesCount}
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                            <Grid item xs={12} sm={6} md={3}>
                                <Card sx={{ bgcolor: '#fff3e0', borderLeft: '5px solid #f57c00' }}>
                                    <CardContent>
                                        <Typography color="orange.main" gutterBottom sx={{ fontWeight: 'bold', color: '#e65100' }}>مرتجعات مخالفة</Typography>
                                        <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#e65100' }}>
                                            {stats.returnsCount}
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                            <Grid item xs={12} sm={6} md={3}>
                                <Card sx={{ bgcolor: '#ede7f6', borderLeft: '5px solid #673ab7' }}>
                                    <CardContent>
                                        <Typography color="secondary.dark" gutterBottom sx={{ fontWeight: 'bold' }}>أذونات صرف مخالفة</Typography>
                                        <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'secondary.dark' }}>
                                            {stats.vouchersCount}
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                        </Grid>

                        <MaterialReactTable
                            columns={columns}
                            data={reportData.transactions}
                            enableColumnOrdering
                            enableGlobalFilter
                            localization={MRT_Localization_AR}
                            renderTopToolbarCustomActions={() => (
                                <Stack direction="row" spacing={2} alignItems="center">
                                    <Button
                                        color="success"
                                        onClick={handleExport}
                                        startIcon={<FileDownloadIcon />}
                                        variant="contained"
                                    >
                                        تصدير إلى Excel
                                    </Button>
                                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: 'text.secondary', display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <StoreIcon />
                                        مخزن: {reportData.warehouse.name} ({reportData.warehouse.region})
                                    </Typography>
                                </Stack>
                            )}
                            initialState={{
                                pagination: { pageSize: 50, pageIndex: 0 },
                            }}
                            muiTablePaperProps={{
                                elevation: 2,
                                sx: { borderRadius: '10px' }
                            }}
                        />
                    </>
                ) : (
                    <Box sx={{ textAlign: 'center', py: 10, color: 'text.secondary' }}>
                        <StoreIcon sx={{ fontSize: 80, opacity: 0.15, mb: 2 }} />
                        <Typography variant="h6">الرجاء تحديد مخزن وفترة زمنية للبحث عن المخالفات الجغرافية وتتبع حركة المخزون</Typography>
                    </Box>
                )}
            </Box>
        </Container>
    );
};

export default CrossRegionReportPage;
