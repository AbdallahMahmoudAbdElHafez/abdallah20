import React, { useState, useEffect, useMemo } from 'react';
import {
    Box, Typography, Button, TextField, CircularProgress, Paper,
    Grid, Card, CardContent
} from '@mui/material';
import { Download as DownloadIcon, ArrowBack as BackIcon } from '@mui/icons-material';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useNavigate } from 'react-router-dom';
import { MaterialReactTable } from 'material-react-table';
import { defaultTableProps } from "../config/tableConfig";
import reportsApi from '../api/reportsApi';
import { exportToExcel } from '../utils/exportUtils';


const COLORS = ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40'];

const ExpensesReportPage = () => {
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
            const res = await reportsApi.getExpensesReport({ startDate, endDate });
            setData(res.data.data);
            setSummary(res.data.summary);
            setChartData(res.data.chartData);
        } catch (error) {
            console.error('Error fetching expenses report:', error);
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

    // All columns from Expense model
    const columns = useMemo(() => [
        { accessorKey: 'id', header: 'ID', size: 60, enableHiding: true },
        { accessorKey: 'expense_date', header: 'التاريخ', size: 110 },
        {
            header: 'الفئة',
            Cell: () => 'غير مصنف', // ExpenseCategory table doesn't exist
            size: 120,
            enableHiding: true
        },
        { accessorKey: 'description', header: 'الوصف', size: 200 },
        {
            accessorKey: 'amount',
            header: 'المبلغ',
            Cell: ({ cell }) => formatCurrency(cell.getValue())
        },
        {
            accessorKey: 'debit_account_id',
            header: 'حساب المدين',
            size: 100,
            enableHiding: true
        },
        {
            accessorKey: 'credit_account_id',
            header: 'حساب الدائن',
            size: 100,
            enableHiding: true
        },
        {
            accessorKey: 'city_id',
            header: 'المدينة',
            size: 100,
            enableHiding: true
        },
        {
            accessorKey: 'employee_id',
            header: 'الموظف',
            size: 100,
            enableHiding: true
        },
        {
            accessorKey: 'party_id',
            header: 'الطرف',
            size: 100,
            enableHiding: true
        },
        {
            accessorKey: 'notes',
            header: 'الملاحظات',
            enableHiding: true,
            size: 200
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
                <Typography variant="h4" sx={{ fontWeight: 'bold' }}>تقرير المصروفات التفصيلي</Typography>
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
                        <Grid item xs={12} sm={6}>
                            <Card sx={{ bgcolor: '#ffebee' }}><CardContent>
                                <Typography color="textSecondary">عدد المصروفات</Typography>
                                <Typography variant="h5">{summary.total_expenses || 0}</Typography>
                            </CardContent></Card>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Card sx={{ bgcolor: '#fff3e0' }}><CardContent>
                                <Typography color="textSecondary">المبلغ الكلي</Typography>
                                <Typography variant="h5">{formatCurrency(summary.total_amount)}</Typography>
                            </CardContent></Card>
                        </Grid>
                    </Grid>

                    <Paper sx={{ p: 3, mb: 4 }}>
                        <Typography variant="h6" gutterBottom>توزيع المصروفات حسب الفئة</Typography>
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie data={chartData} dataKey="amount" nameKey="category" cx="50%" cy="50%" outerRadius={100} label>
                                    {chartData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend />
                            </PieChart>
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
                                            `Expenses_Report_${startDate}_${endDate}`
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
                                debit_account_id: false,
                                credit_account_id: false,
                                city_id: false,
                                employee_id: false,
                                party_id: false,
                                notes: false,
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

export default ExpensesReportPage;
