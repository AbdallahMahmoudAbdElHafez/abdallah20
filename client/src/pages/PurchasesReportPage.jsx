import React, { useState, useEffect, useMemo } from 'react';
import {
    Box, Typography, Button, TextField, CircularProgress, Paper,
    Grid, Card, CardContent
} from '@mui/material';
import { Download as DownloadIcon, ArrowBack as BackIcon } from '@mui/icons-material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useNavigate } from 'react-router-dom';
import { MaterialReactTable } from 'material-react-table';
import { defaultTableProps } from "../config/tableConfig";
import reportsApi from '../api/reportsApi';
import { exportToExcel } from '../utils/exportUtils';


const PurchasesReportPage = () => {
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
            const res = await reportsApi.getPurchasesReport({ startDate, endDate });
            setData(res.data.data);
            setSummary(res.data.summary);
            setChartData(res.data.chartData);
        } catch (error) {
            console.error('Error fetching purchases report:', error);
            alert('خطأ في جلب التقرير');
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

    // All columns from PurchaseInvoice model
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
            accessorKey: 'supplier.name',
            header: 'المورد',
            Cell: ({ row }) => row.original.supplier?.name || '-'
        },
        {
            accessorKey: 'purchase_order_id',
            header: 'رقم طلب الشراء',
            size: 100,
            enableHiding: true
        },
        {
            accessorKey: 'payment_terms',
            header: 'شروط الدفع',
            size: 150,
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
        },
        {
            accessorKey: 'updated_at',
            header: 'تاريخ التحديث',
            size: 150,
            enableHiding: true,
            Cell: ({ cell }) => cell.getValue() ? new Date(cell.getValue()).toLocaleString('ar-EG') : '-'
        }
    ], []);

    return (
        <Box p={3}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h4" sx={{ fontWeight: 'bold' }}>تقرير المشتريات التفصيلي</Typography>
                <Button variant="outlined" startIcon={<BackIcon />} onClick={() => navigate('/reports-dashboard')}>
                    رجوع
                </Button>
            </Box>

            <Box sx={{ display: 'flex', gap: 2, mb: 3, alignItems: 'center' }}>
                <TextField label="من تاريخ" type="date" InputLabelProps={{ shrink: true }} value={startDate} onChange={(e) => setStartDate(e.target.value)} />
                <TextField label="إلى تاريخ" type="date" InputLabelProps={{ shrink: true }} value={endDate} onChange={(e) => setEndDate(e.target.value)} />
                <Button variant="contained" onClick={fetchReport}>عرض التقرير</Button>
            </Box>

            {loading ? (
                <Box display="flex" justifyContent="center" mt={5}><CircularProgress /></Box>
            ) : (
                <>
                    <Grid container spacing={2} mb={4}>
                        <Grid item xs={12} sm={6} md={3}>
                            <Card sx={{ bgcolor: '#fbe9e7' }}><CardContent>
                                <Typography color="textSecondary">عدد الفواتير</Typography>
                                <Typography variant="h5">{summary.total_invoices || 0}</Typography>
                            </CardContent></Card>
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                            <Card sx={{ bgcolor: '#fff3e0' }}><CardContent>
                                <Typography color="textSecondary">إجمالي المشتريات</Typography>
                                <Typography variant="h5">{formatCurrency(summary.total_amount)}</Typography>
                            </CardContent></Card>
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                            <Card sx={{ bgcolor: '#e8f5e9' }}><CardContent>
                                <Typography color="textSecondary">إجمالي الضرائب</Typography>
                                <Typography variant="h5">{formatCurrency(summary.total_tax)}</Typography>
                            </CardContent></Card>
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                            <Card sx={{ bgcolor: '#f3e5f5' }}><CardContent>
                                <Typography color="textSecondary">إجمالي الخصومات</Typography>
                                <Typography variant="h5">{formatCurrency(summary.total_discount)}</Typography>
                            </CardContent></Card>
                        </Grid>
                    </Grid>

                    <Paper sx={{ p: 3, mb: 4 }}>
                        <Typography variant="h6" gutterBottom>أكبر 10 موردين (حسب المبلغ)</Typography>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={chartData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="supplier" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="amount" fill="#ff9800" name="المبلغ" />
                            </BarChart>
                        </ResponsiveContainer>
                    </Paper>

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
                                            `Purchases_Report_${startDate}_${endDate}`
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
                                purchase_order_id: false,
                                payment_terms: false,
                                subtotal: false,
                                additional_discount: false,
                                vat_rate: false,
                                vat_amount: false,
                                tax_rate: false,
                                tax_amount: false,
                                net_amount: false,
                                created_at: false,
                                updated_at: false,
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

export default PurchasesReportPage;
