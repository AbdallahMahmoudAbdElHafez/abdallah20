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
    Divider
} from '@mui/material';
import { MaterialReactTable } from 'material-react-table';
import { MRT_Localization_AR } from 'material-react-table/locales/ar';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import SearchIcon from '@mui/icons-material/Search';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import reportsApi from '../api/reportsApi';
import accountsApi from '../api/accountsApi';

const formatCurrency = (amount) => {
    return new Intl.NumberFormat('ar-EG', {
        style: 'currency',
        currency: 'EGP',
        offset: 0,
        minimumFractionDigits: 2
    }).format(amount || 0);
};

const SafeMovementsReportPage = () => {
    const [accounts, setAccounts] = useState([]);
    const [selectedAccount, setSelectedAccount] = useState('');
    const [startDate, setStartDate] = useState(new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0]);
    const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);

    const [reportData, setReportData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Fetch Safe Accounts
    useEffect(() => {
        const fetchAccounts = async () => {
            try {
                const response = await accountsApi.getAll();
                // Filter for accounts under "Safes and Banks" (Root ID 40)
                // Note: In some systems these might be direct or indirect children.
                // For now, let's include all assets or specific ones if we know the ID structure.
                // Based on getBankAndCashReport, root is 40.
                const safeAccounts = response.data.filter(acc => acc.parent_account_id === 40);
                setAccounts(safeAccounts);
                if (safeAccounts.length > 0) setSelectedAccount(safeAccounts[0].id);
            } catch (err) {
                console.error('Error fetching accounts:', err);
                setError('خطأ في تحميل الحسابات');
            }
        };
        fetchAccounts();
    }, []);

    const fetchReport = async () => {
        if (!selectedAccount) return;
        setLoading(true);
        setError(null);
        try {
            const response = await reportsApi.getSafeMovementsReport({
                accountId: selectedAccount,
                startDate,
                endDate
            });
            setReportData(response.data);
        } catch (err) {
            console.error('Error fetching safe movements:', err);
            setError('خطأ في جلب بيانات التقرير');
        } finally {
            setLoading(false);
        }
    };

    const handleExport = async () => {
        if (!selectedAccount) return;
        try {
            const response = await reportsApi.exportReport('safe-movements', {
                accountId: selectedAccount,
                startDate,
                endDate
            });

            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            const accountName = accounts.find(a => a.id === selectedAccount)?.name || 'Account';
            link.setAttribute('download', `حركة_${accountName}_${startDate}_${endDate}.xlsx`);
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
                accessorKey: 'contra_account',
                header: 'الحساب المقابل',
                size: 150,
            },
            {
                accessorKey: 'debit',
                header: 'سحب (مدين)',
                Cell: ({ cell }) => (
                    <Typography color="error.main" sx={{ fontWeight: cell.getValue() > 0 ? 'bold' : 'normal' }}>
                        {cell.getValue() > 0 ? formatCurrency(cell.getValue()) : '-'}
                    </Typography>
                ),
                muiTableBodyCellProps: { align: 'right' },
            },
            {
                accessorKey: 'credit',
                header: 'إيداع (دائن)',
                Cell: ({ cell }) => (
                    <Typography color="success.main" sx={{ fontWeight: cell.getValue() > 0 ? 'bold' : 'normal' }}>
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
                    تقرير حركات الصندوق والبنوك
                </Typography>

                <Paper sx={{ p: 3, mb: 4, borderRadius: 2 }}>
                    <Grid container spacing={3} alignItems="flex-end">
                        <Grid item xs={12} md={4}>
                            <FormControl fullWidth size="small">
                                <InputLabel>اختر الحساب</InputLabel>
                                <Select
                                    value={selectedAccount}
                                    label="اختر الحساب"
                                    onChange={(e) => setSelectedAccount(e.target.value)}
                                >
                                    {accounts.map(acc => (
                                        <MenuItem key={acc.id} value={acc.id}>{acc.name}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
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
                                <Card sx={{ bgcolor: '#f5f5f5' }}>
                                    <CardContent>
                                        <Typography color="textSecondary" gutterBottom>الرصيد الافتتاحي</Typography>
                                        <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                                            {formatCurrency(reportData.openingBalance)}
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                            <Grid item xs={12} md={3}>
                                <Card sx={{ bgcolor: 'error.light', color: 'error.contrastText' }}>
                                    <CardContent>
                                        <Typography gutterBottom>إجمالي المسحوبات</Typography>
                                        <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                                            {formatCurrency(reportData.summary.totalDebit)}
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                            <Grid item xs={12} md={3}>
                                <Card sx={{ bgcolor: 'success.light', color: 'success.contrastText' }}>
                                    <CardContent>
                                        <Typography gutterBottom>إجمالي الإيداعات</Typography>
                                        <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
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
                                        <AccountBalanceWalletIcon sx={{ fontSize: 40, opacity: 0.5 }} />
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
                                <Button
                                    color="success"
                                    onClick={handleExport}
                                    startIcon={<FileDownloadIcon />}
                                    variant="contained"
                                >
                                    تصدير إلى Excel
                                </Button>
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
                        <Typography variant="h6">يرجى اختيار الحساب والفترة الزمنية لعرض التقرير</Typography>
                    </Box>
                )}
            </Box>
        </Container>
    );
};

export default SafeMovementsReportPage;
