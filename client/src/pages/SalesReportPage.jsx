import React, { useState, useEffect, useMemo } from 'react';
import {
    Box, Typography, Button, TextField, CircularProgress, Paper,
    Grid, Card, CardContent
} from '@mui/material';
import { Download as DownloadIcon, ArrowBack as BackIcon } from '@mui/icons-material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useNavigate } from 'react-router-dom';
import { MaterialReactTable } from 'material-react-table';
import reportsApi from '../api/reportsApi';
import { defaultTableProps } from "../config/tableConfig";
import { exportToExcel } from '../utils/exportUtils';

const SalesReportPage = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState([]);
    const [summary, setSummary] = useState({});
    const [chartData, setChartData] = useState([]);
    const [startDate, setStartDate] = useState(
        new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0]
    );
    const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);

    const fetchReport = async () => {
        setLoading(true);
        try {
            const res = await reportsApi.getSalesReport({ startDate, endDate });
            setData(res.data.data);
            setSummary(res.data.summary);
            setChartData(res.data.chartData);
        } catch (error) {
            console.error('Error fetching sales report:', error);
            alert('خطأ في جلب التقرير');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReport();
    }, []);

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('ar-EG', {
            style: 'currency',
            currency: 'EGP'
        }).format(amount || 0);
    };

    // All columns from SalesInvoice model
    const columns = useMemo(() => [
        { accessorKey: 'id', header: 'ID', size: 60, enableHiding: true },
        { accessorKey: 'invoice_number', header: 'رقم الفاتورة', size: 120 },
        { accessorKey: 'invoice_type', header: 'نوع الفاتورة', size: 100, enableHiding: true },
        {
            accessorKey: 'status',
            header: 'الحالة',
            size: 100,
            enableHiding: true
        },
        { accessorKey: 'invoice_date', header: 'التاريخ', size: 110 },
        { accessorKey: 'due_date', header: 'تاريخ الاستحقاق', size: 120, enableHiding: true },
        {
            accessorKey: 'party.name',
            header: 'العميل',
            Cell: ({ row }) => row.original.party?.name || '-'
        },
        {
            accessorKey: 'sales_order_id',
            header: 'رقم طلب البيع',
            size: 100,
            enableHiding: true
        },
        {
            accessorKey: 'warehouse.name',
            header: 'المخزن',
            Cell: ({ row }) => row.original.warehouse?.name || '-',
            enableHiding: true
        },
        {
            accessorKey: 'employee.name',
            header: 'الموظف',
            Cell: ({ row }) => row.original.employee?.name || '-',
            enableHiding: true
        },
        {
            accessorKey: 'subtotal',
            header: 'المجموع الفرعي',
            Cell: ({ cell }) => formatCurrency(cell.getValue()),
            enableHiding: true
        },
        {
            accessorKey: 'additional_discount',
            header: 'خصم إضافي',
            Cell: ({ cell }) => formatCurrency(cell.getValue()),
            enableHiding: true
        },
        {
            accessorKey: 'vat_rate',
            header: 'نسبة VAT %',
            Cell: ({ cell }) => `${cell.getValue() || 0}%`,
            enableHiding: true
        },
        {
            accessorKey: 'vat_amount',
            header: 'قيمة VAT',
            Cell: ({ cell }) => formatCurrency(cell.getValue()),
            enableHiding: true
        },
        {
            accessorKey: 'tax_rate',
            header: 'نسبة الضريبة %',
            Cell: ({ cell }) => `${cell.getValue() || 0}%`,
            enableHiding: true
        },
        {
            accessorKey: 'tax_amount',
            header: 'قيمة الضريبة',
            Cell: ({ cell }) => formatCurrency(cell.getValue()),
            enableHiding: true
        },
        {
            accessorKey: 'shipping_amount',
            header: 'تكلفة الشحن',
            Cell: ({ cell }) => formatCurrency(cell.getValue()),
            enableHiding: true
        },
        {
            accessorKey: 'total_amount',
            header: 'الإجمالي',
            Cell: ({ cell }) => formatCurrency(cell.getValue())
        },
        {
            id: 'net_amount',
            header: 'الصافي',
            Cell: ({ row }) => formatCurrency(
                parseFloat(row.original.total_amount || 0) - parseFloat(row.original.additional_discount || 0)
            ),
            enableHiding: true
        },
        {
            accessorKey: 'created_at',
            header: 'تاريخ الإنشاء',
            size: 150,
            enableHiding: true,
            Cell: ({ cell }) => cell.getValue() ? new Date(cell.getValue()).toLocaleString('ar-EG') : '-'
        }
    ], []);

    return (
        <Box p={3}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                    تقرير المبيعات التفصيلي
                </Typography>
                <Button
                    variant="outlined"
                    startIcon={<BackIcon />}
                    onClick={() => navigate('/reports-dashboard')}
                >
                    رجوع
                </Button>
            </Box>

            {/* Filters */}
            <Box sx={{ display: 'flex', gap: 2, mb: 3, alignItems: 'center' }}>
                <TextField
                    label="من تاريخ"
                    type="date"
                    InputLabelProps={{ shrink: true }}
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                />
                <TextField
                    label="إلى تاريخ"
                    type="date"
                    InputLabelProps={{ shrink: true }}
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                />
                <Button variant="contained" onClick={fetchReport}>
                    عرض التقرير
                </Button>
            </Box>

            {loading ? (
                <Box display="flex" justifyContent="center" mt={5}>
                    <CircularProgress />
                </Box>
            ) : (
                <>
                    {/* Summary Cards */}
                    <Grid container spacing={2} mb={4}>
                        <Grid item xs={12} sm={6} md={3}>
                            <Card sx={{ bgcolor: '#e3f2fd' }}>
                                <CardContent>
                                    <Typography color="textSecondary">عدد الفواتير</Typography>
                                    <Typography variant="h5">{summary.total_invoices || 0}</Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                            <Card sx={{ bgcolor: '#e8f5e9' }}>
                                <CardContent>
                                    <Typography color="textSecondary">إجمالي المبيعات</Typography>
                                    <Typography variant="h5">{formatCurrency(summary.total_amount)}</Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                            <Card sx={{ bgcolor: '#fff3e0' }}>
                                <CardContent>
                                    <Typography color="textSecondary">إجمالي الضرائب</Typography>
                                    <Typography variant="h5">{formatCurrency(summary.total_tax)}</Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                            <Card sx={{ bgcolor: '#fce4ec' }}>
                                <CardContent>
                                    <Typography color="textSecondary">إجمالي الخصومات</Typography>
                                    <Typography variant="h5">{formatCurrency(summary.total_discount)}</Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>

                    {/* Chart */}
                    <Paper sx={{ p: 3, mb: 4 }}>
                        <Typography variant="h6" gutterBottom>
                            المبيعات حسب الشهر
                        </Typography>
                        <ResponsiveContainer width="100%" height={300}>
                            <LineChart data={chartData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="month" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Line type="monotone" dataKey="amount" stroke="#2196f3" strokeWidth={2} name="المبيعات" />
                            </LineChart>
                        </ResponsiveContainer>
                    </Paper>

                    {/* Table with All Columns */}
                    <MaterialReactTable
                        columns={columns}
                        {...defaultTableProps}
                        data={data}
                        enableColumnVisibility={true}
                        enableHiding={true}
                        enableColumnActions={true}
                        enableExporting={true}
                        muiToolbarAlertBannerProps={false}
                        renderTopToolbarCustomActions={({ table }) => (
                            <Box sx={{ display: 'flex', gap: 1 }}>
                                <Button
                                    variant="contained"
                                    color="success"
                                    startIcon={<DownloadIcon />}
                                    onClick={() => {
                                        exportToExcel(
                                            table.getFilteredRowModel().rows,
                                            table.getVisibleLeafColumns(),
                                            `Sales_Report_${startDate}_${endDate}`
                                        );
                                    }}
                                >
                                    تصدير الأعمدة الظاهرة
                                </Button>
                            </Box>
                        )}
                        initialState={{
                            columnVisibility: {
                                id: false,
                                invoice_type: false,
                                status: false,
                                due_date: false,
                                sales_order_id: false,
                                'warehouse.name': false,
                                'employee.name': false,
                                subtotal: false,
                                additional_discount: false,
                                vat_rate: false,
                                vat_amount: false,
                                tax_rate: false,
                                tax_amount: false,
                                shipping_amount: false,
                                net_amount: false,
                                created_at: false,
                            }
                        }}
                        muiTableHeadCellProps={{
                            sx: { bgcolor: '#f5f5f5' }
                        }}
                    />
                </>
            )}
        </Box>
    );
};

export default SalesReportPage;
