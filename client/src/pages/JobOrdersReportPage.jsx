import React, { useState, useEffect, useMemo } from 'react';
import {
    Box, Typography, Button, TextField, CircularProgress, Paper,
    Grid, Card, CardContent
} from '@mui/material';
import { Download as DownloadIcon, ArrowBack as BackIcon } from '@mui/icons-material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useNavigate } from 'react-router-dom';
import { MaterialReactTable } from 'material-react-table';
import reportsApi from '../api/reportsApi';
import { defaultTableProps } from "../config/tableConfig";
import { exportToExcel } from '../utils/exportUtils';

const JobOrdersReportPage = () => {
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
            const res = await reportsApi.getJobOrdersReport({ startDate, endDate });
            setData(res.data.data);
            setSummary(res.data.summary);
            setChartData(res.data.chartData);
        } catch (error) {
            console.error('Error fetching job orders report:', error);
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

    // All columns from ExternalJobOrder model
    const columns = useMemo(() => [
        { accessorKey: 'id', header: 'ID', size: 60 },
        {
            accessorKey: 'party.name',
            header: 'المورد',
            Cell: ({ row }) => row.original.party?.name || '-'
        },
        {
            accessorKey: 'product.name',
            header: 'المنتج',
            Cell: ({ row }) => row.original.product?.name || '-'
        },
        {
            accessorKey: 'process.name',
            header: 'العملية',
            Cell: ({ row }) => row.original.process?.name || '-',
            enableHiding: true
        },
        {
            accessorKey: 'warehouse.name',
            header: 'المخزن',
            Cell: ({ row }) => row.original.warehouse?.name || '-',
            enableHiding: true
        },
        { accessorKey: 'status', header: 'الحالة', size: 100 },
        { accessorKey: 'start_date', header: 'تاريخ البدء', size: 110 },
        { accessorKey: 'end_date', header: 'تاريخ الانتهاء', size: 110, enableHiding: true },
        { accessorKey: 'order_quantity', header: 'الكمية المطلوبة', size: 120 },
        {
            accessorKey: 'produced_quantity',
            header: 'الكمية المنتجة',
            Cell: ({ cell }) => cell.getValue() || 0,
            size: 120,
            enableHiding: true
        },
        {
            accessorKey: 'waste_quantity',
            header: 'الفاقد',
            Cell: ({ cell }) => cell.getValue() || 0,
            size: 100,
            enableHiding: true
        },
        {
            accessorKey: 'transport_cost',
            header: 'تكلفة النقل',
            Cell: ({ cell }) => formatCurrency(cell.getValue()),
            enableHiding: true
        },
        {
            accessorKey: 'estimated_processing_cost_per_unit',
            header: 'تكلفة التصنيع المقدرة/الوحدة',
            Cell: ({ cell }) => formatCurrency(cell.getValue()),
            size: 150,
            enableHiding: true
        },
        {
            accessorKey: 'actual_processing_cost_per_unit',
            header: 'تكلفة التصنيع الفعلية/الوحدة',
            Cell: ({ cell }) => formatCurrency(cell.getValue()),
            size: 150,
            enableHiding: true
        },
        {
            accessorKey: 'estimated_raw_material_cost_per_unit',
            header: 'تكلفة المواد المقدرة/الوحدة',
            Cell: ({ cell }) => formatCurrency(cell.getValue()),
            size: 150,
            enableHiding: true
        },
        {
            accessorKey: 'actual_raw_material_cost_per_unit',
            header: 'تكلفة المواد الفعلية/الوحدة',
            Cell: ({ cell }) => formatCurrency(cell.getValue()),
            size: 150,
            enableHiding: true
        },
        {
            accessorKey: 'total_estimated_cost',
            header: 'التكلفة الإجمالية المقدرة',
            Cell: ({ cell }) => formatCurrency(cell.getValue()),
            enableHiding: true
        },
        {
            accessorKey: 'total_actual_cost',
            header: 'التكلفة الإجمالية الفعلية',
            Cell: ({ cell }) => formatCurrency(cell.getValue()),
            enableHiding: true
        },
        {
            accessorKey: 'reference_no',
            header: 'رقم المرجع',
            size: 120,
            enableHiding: true
        }
    ], []);

    return (
        <Box p={3}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h4" sx={{ fontWeight: 'bold' }}>تقرير أوامر التشغيل</Typography>
                <Button variant="outlined" startIcon={<BackIcon />} onClick={() => navigate('/reports-dashboard')}>رجوع</Button>
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
                        <Grid item xs={12} sm={6} md={2.4}>
                            <Card sx={{ bgcolor: '#e3f2fd' }}><CardContent>
                                <Typography color="textSecondary">إجمالي الأوامر</Typography>
                                <Typography variant="h5">{summary.total_orders || 0}</Typography>
                            </CardContent></Card>
                        </Grid>
                        <Grid item xs={12} sm={6} md={2.4}>
                            <Card sx={{ bgcolor: '#e8f5e9' }}><CardContent>
                                <Typography color="textSecondary">مكتمل</Typography>
                                <Typography variant="h5">{summary.completed || 0}</Typography>
                            </CardContent></Card>
                        </Grid>
                        <Grid item xs={12} sm={6} md={2.4}>
                            <Card sx={{ bgcolor: '#fff3e0' }}><CardContent>
                                <Typography color="textSecondary">قيد التنفيذ</Typography>
                                <Typography variant="h5">{summary.in_progress || 0}</Typography>
                            </CardContent></Card>
                        </Grid>
                        <Grid item xs={12} sm={6} md={2.4}>
                            <Card sx={{ bgcolor: '#f3e5f5' }}><CardContent>
                                <Typography color="textSecondary">مخطط</Typography>
                                <Typography variant="h5">{summary.planned || 0}</Typography>
                            </CardContent></Card>
                        </Grid>
                        <Grid item xs={12} sm={6} md={2.4}>
                            <Card sx={{ bgcolor: '#ffebee' }}><CardContent>
                                <Typography color="textSecondary">إجمالي التكلفة</Typography>
                                <Typography variant="h6">{formatCurrency(summary.total_cost)}</Typography>
                            </CardContent></Card>
                        </Grid>
                    </Grid>

                    <Paper sx={{ p: 3, mb: 4 }}>
                        <Typography variant="h6" gutterBottom>توزيع الأوامر حسب الحالة</Typography>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={chartData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="status" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="count" fill="#4caf50" name="العدد" />
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
                                            `Job_Orders_Report_${startDate}_${endDate}`
                                        );
                                    }}
                                >
                                    تصدير الأعمدة الظاهرة
                                </Button>
                            </Box>
                        )}
                        initialState={{
                            columnVisibility: {
                                'process.name': false,
                                'warehouse.name': false,
                                end_date: false,
                                produced_quantity: false,
                                waste_quantity: false,
                                transport_cost: false,
                                estimated_processing_cost_per_unit: false,
                                actual_processing_cost_per_unit: false,
                                estimated_raw_material_cost_per_unit: false,
                                actual_raw_material_cost_per_unit: false,
                                total_estimated_cost: false,
                                total_actual_cost: false,
                                reference_no: false,
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

export default JobOrdersReportPage;
