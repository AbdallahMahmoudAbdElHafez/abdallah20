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
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Paper,
    Autocomplete
} from '@mui/material';
import { MaterialReactTable } from 'material-react-table';
import { MRT_Localization_AR } from 'material-react-table/locales/ar';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import SearchIcon from '@mui/icons-material/Search';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import reportsApi from '../api/reportsApi';
import accountsApi from '../api/accountsApi';

const formatCurrency = (amount) => {
    return new Intl.NumberFormat('ar-EG', {
        style: 'currency',
        currency: 'EGP',
        minimumFractionDigits: 2
    }).format(amount || 0);
};

const GeneralLedgerReport = () => {
    const [accounts, setAccounts] = useState([]);
    const [selectedAccount, setSelectedAccount] = useState(null);
    const [startDate, setStartDate] = useState(new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0]);
    const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);

    const [reportData, setReportData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Fetch All Accounts
    useEffect(() => {
        const fetchAccounts = async () => {
            try {
                const response = await accountsApi.getAll();
                // Filter specifically for leaf accounts or just show all
                setAccounts(response.data.sort((a, b) => a.name.localeCompare(b.name, 'ar')));
            } catch (err) {
                console.error('Error fetching accounts:', err);
                setError('خطأ في تحميل شجرة الحسابات');
            }
        };
        fetchAccounts();
    }, []);

    const fetchReport = async () => {
        if (!selectedAccount) return;
        setLoading(true);
        setError(null);
        try {
            const response = await reportsApi.getGeneralLedgerReport({
                accountId: selectedAccount.id,
                startDate,
                endDate
            });
            setReportData(response.data);
        } catch (err) {
            console.error('Error fetching general ledger:', err);
            setError('خطأ في جلب بيانات كشف الحساب');
        } finally {
            setLoading(false);
        }
    };

    const handleExport = async () => {
        if (!selectedAccount) return;
        try {
            const response = await reportsApi.exportReport('general-ledger', {
                accountId: selectedAccount.id,
                startDate,
                endDate
            });

            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `كشف_حساب_${selectedAccount.name}_${startDate}_${endDate}.xlsx`);
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (err) {
            console.error('Error exporting report:', err);
            alert('خطأ في تصدير التقرير');
        }
    };

    const columns = useMemo(
        () => [
            {
                accessorKey: 'date',
                header: 'التاريخ',
                size: 100,
            },
            {
                accessorKey: 'description',
                header: 'البيان',
                size: 250,
            },
            {
                accessorKey: 'reference_no',
                header: 'رقم المرجع',
                size: 100,
            },
            {
                accessorKey: 'contra_account',
                header: 'الحساب المقابل',
                size: 180,
            },
            {
                accessorKey: 'debit',
                header: 'مدين',
                Cell: ({ cell }) => (
                    <Typography color="success.main" sx={{ fontWeight: cell.getValue() > 0 ? 'bold' : 'normal' }}>
                        {cell.getValue() > 0 ? formatCurrency(cell.getValue()) : '-'}
                    </Typography>
                ),
                muiTableBodyCellProps: { align: 'right' },
            },
            {
                accessorKey: 'credit',
                header: 'دائن',
                Cell: ({ cell }) => (
                    <Typography color="error.main" sx={{ fontWeight: cell.getValue() > 0 ? 'bold' : 'normal' }}>
                        {cell.getValue() > 0 ? formatCurrency(cell.getValue()) : '-'}
                    </Typography>
                ),
                muiTableBodyCellProps: { align: 'right' },
            },
            {
                accessorKey: 'balance',
                header: 'الرصيد',
                Cell: ({ cell }) => (
                    <Typography sx={{ fontWeight: 'bold' }}>
                        {formatCurrency(cell.getValue())}
                    </Typography>
                ),
                muiTableBodyCellProps: { align: 'right' },
            },
        ],
        [],
    );

    return (
        <Container maxWidth="lg">
            <Box sx={{ my: 4 }}>
                <Typography variant="h4" gutterBottom align="center" sx={{ fontWeight: 'bold', color: '#1a237e' }}>
                    كشف الحسابات العامة (الأستاذ العام)
                </Typography>

                <Paper sx={{ p: 3, mb: 4, borderRadius: 2 }}>
                    <Grid container spacing={3} alignItems="flex-end">
                        <Grid item xs={12} md={4}>
                            <Autocomplete
                                options={accounts}
                                getOptionLabel={(option) => `${option.name} (${option.code || ''})`}
                                value={selectedAccount}
                                onChange={(event, newValue) => setSelectedAccount(newValue)}
                                renderInput={(params) => <TextField {...params} label="اختر الحساب" size="small" />}
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
                                startIcon={<SearchIcon />}
                                onClick={fetchReport}
                                disabled={loading || !selectedAccount}
                            >
                                عرض
                            </Button>
                        </Grid>
                    </Grid>
                </Paper>

                {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

                {loading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', my: 10 }}>
                        <CircularProgress />
                    </Box>
                ) : reportData ? (
                    <>
                        <Grid container spacing={3} sx={{ mb: 4 }}>
                            <Grid item xs={12} md={3}>
                                <Card sx={{ bgcolor: '#f5f5f5', borderLeft: '5px solid #1a237e' }}>
                                    <CardContent>
                                        <Typography color="textSecondary" gutterBottom>الرصيد الافتتاحي</Typography>
                                        <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                                            {formatCurrency(reportData.openingBalance)}
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                            <Grid item xs={12} md={3}>
                                <Card sx={{ bgcolor: '#e8f5e9', borderLeft: '5px solid #2e7d32' }}>
                                    <CardContent>
                                        <Typography color="success.dark" gutterBottom>إجمالي المدين (+)</Typography>
                                        <Typography variant="h5" sx={{ fontWeight: 'bold', color: 'success.dark' }}>
                                            {formatCurrency(reportData.summary.totalDebit)}
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                            <Grid item xs={12} md={3}>
                                <Card sx={{ bgcolor: '#ffebee', borderLeft: '5px solid #c62828' }}>
                                    <CardContent>
                                        <Typography color="error.dark" gutterBottom>إجمالي الدائن (-)</Typography>
                                        <Typography variant="h5" sx={{ fontWeight: 'bold', color: 'error.dark' }}>
                                            {formatCurrency(reportData.summary.totalCredit)}
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                            <Grid item xs={12} md={3}>
                                <Card sx={{ bgcolor: '#1a237e', color: 'white' }}>
                                    <CardContent sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <Box>
                                            <Typography gutterBottom>الرصيد الختامي</Typography>
                                            <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                                                {formatCurrency(reportData.summary.closingBalance)}
                                            </Typography>
                                        </Box>
                                        <AccountBalanceIcon sx={{ fontSize: 40, opacity: 0.5 }} />
                                    </CardContent>
                                </Card>
                            </Grid>
                        </Grid>

                        <MaterialReactTable
                            columns={columns}
                            data={reportData.movements}
                            enableColumnOrdering
                            enableGlobalFilter
                            localization={MRT_Localization_AR}
                            renderTopToolbarCustomActions={() => (
                                <Stack direction="row" spacing={2}>
                                    <Button
                                        color="success"
                                        onClick={handleExport}
                                        startIcon={<FileDownloadIcon />}
                                        variant="contained"
                                    >
                                        تصدير إلى Excel
                                    </Button>
                                    <Typography variant="subtitle1" sx={{ alignSelf: 'center', fontWeight: 'bold' }}>
                                        {reportData.account.name} - {reportData.account.normal_balance === 'debit' ? 'حساب مدين الطبيعة' : 'حساب دائن الطبيعة'}
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
                        <Typography variant="h6">يرجى اختيار الحساب والفترة الزمنية لعرض كشف الحساب</Typography>
                    </Box>
                )}
            </Box>
        </Container>
    );
};

export default GeneralLedgerReport;
