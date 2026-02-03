import React, { useState, useEffect, useMemo } from 'react';
import {
    Box, Typography, Button, TextField, CircularProgress, Paper,
    Grid, Card, CardContent
} from '@mui/material';
import { Download as DownloadIcon, ArrowBack as BackIcon, Article as ArticleIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { MaterialReactTable } from 'material-react-table';
import { defaultTableProps } from "../config/tableConfig";
import reportsApi from '../api/reportsApi';
import { exportToExcel } from '../utils/exportUtils';

const JournalExpensesReportPage = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState([]);
    const [summary, setSummary] = useState({});
    const [startDate, setStartDate] = useState(
        new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0]
    );
    const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);

    const fetchReport = async () => {
        setLoading(true);
        try {
            const res = await reportsApi.getJournalExpensesReport({ startDate, endDate });
            setData(res.data.data);
            setSummary(res.data.summary);
        } catch (error) {
            console.error('Error fetching journal expenses report:', error);
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

    const handleExport = async (table) => {
        try {
            await exportToExcel(
                table.getFilteredRowModel().rows,
                table.getVisibleLeafColumns(),
                'Journal_Expenses_Report'
            );
        } catch (error) {
            console.error('Export failed:', error);
            alert('حدث خطأ أثناء محاولة تصدير الملف.');
        }
    };

    const columns = useMemo(() => [
        { accessorKey: 'id', id: 'id', header: 'رقم القيد', size: 80 },
        { accessorKey: 'entry_date', id: 'entry_date', header: 'التاريخ', size: 110, Cell: ({ cell }) => cell.getValue() ? new Date(cell.getValue()).toLocaleDateString('ar-EG') : '-' },
        { accessorKey: 'description', id: 'description', header: 'الوصف', size: 250 },
        { accessorKey: 'debit_account', id: 'debit_account', header: 'حساب المصروف (مدين)', size: 180 },
        { accessorKey: 'credit_account', id: 'credit_account', header: 'طريقة الدفع (دائن)', size: 180 },
        {
            accessorKey: 'amount',
            id: 'amount',
            header: 'المبلغ',
            Cell: ({ cell }) => formatCurrency(cell.getValue())
        }
    ], []);

    return (
        <Box p={3}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Box>
                    <Typography variant="h4" sx={{ fontWeight: 'bold' }}>سجل مصروفات (قيود يومية)</Typography>
                    <Typography variant="body2" color="textSecondary">عرض مالي دقيق من واقع القيود المحاسبية</Typography>
                </Box>
                <Button variant="outlined" startIcon={<BackIcon />} onClick={() => navigate('/reports-dashboard')}>رجوع</Button>
            </Box>

            <Box sx={{ display: 'flex', gap: 2, mb: 3, alignItems: 'center' }}>
                <TextField label="من تاريخ القيد" type="date" InputLabelProps={{ shrink: true }} value={startDate} onChange={(e) => setStartDate(e.target.value)} />
                <TextField label="إلى تاريخ القيد" type="date" InputLabelProps={{ shrink: true }} value={endDate} onChange={(e) => setEndDate(e.target.value)} />
                <Button variant="contained" onClick={fetchReport}>عرض التقرير</Button>
            </Box>

            {loading ? (
                <Box display="flex" justifyContent="center" mt={5}><CircularProgress /></Box>
            ) : (
                <>
                    <Grid container spacing={2} mb={4}>
                        <Grid item xs={12} sm={6}>
                            <Card sx={{ bgcolor: '#ffebee' }}><CardContent>
                                <Typography color="textSecondary">عدد القيود</Typography>
                                <Typography variant="h5">{summary.total_entries || 0}</Typography>
                            </CardContent></Card>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Card sx={{ bgcolor: '#fff3e0' }}><CardContent>
                                <Typography color="textSecondary">إجمالي المصروفات</Typography>
                                <Typography variant="h5">{formatCurrency(summary.total_amount)}</Typography>
                            </CardContent></Card>
                        </Grid>
                    </Grid>

                    <MaterialReactTable
                        columns={columns}
                        {...defaultTableProps}
                        data={data}
                        enableColumnVisibility={true}
                        enableExporting={true}
                        initialState={{
                            sorting: [{ id: 'entry_date', desc: true }]
                        }}
                        renderTopToolbarCustomActions={({ table }) => (
                            <Button
                                variant="contained"
                                color="success"
                                startIcon={<DownloadIcon />}
                                onClick={() => handleExport(table)}
                                disabled={data.length === 0}
                            >
                                تصدير إلى Excel
                            </Button>
                        )}
                        muiToolbarAlertBannerProps={false}
                        muiTableHeadCellProps={{
                            sx: { bgcolor: '#f5f5f5' }
                        }}
                    />
                </>
            )}
        </Box>
    );
};

export default JournalExpensesReportPage;
