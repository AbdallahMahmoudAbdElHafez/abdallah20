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
    Stack
} from '@mui/material';
import { MaterialReactTable } from 'material-react-table';
import { MRT_Localization_AR } from 'material-react-table/locales/ar';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import reportsApi from '../api/reportsApi';
import { exportToExcel } from '../utils/exportUtils';

const formatCurrency = (amount) => {
    return new Intl.NumberFormat('ar-EG', {
        style: 'currency',
        currency: 'EGP',
        minimumFractionDigits: 2
    }).format(amount || 0);
};

const BankAndCashBalancesPage = () => {
    const [data, setData] = useState([]);
    const [summary, setSummary] = useState({ total_opening: 0, total_transactions: 0, total_net_balance: 0, total_accounts: 0 });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

    const fetchData = async () => {
        setLoading(true);
        try {
            const response = await reportsApi.getBankAndCashReport({ date });
            setData(response.data.data);
            setSummary(response.data.summary);
            setError(null);
        } catch (err) {
            console.error('Error fetching bank/cash report:', err);
            setError('خطأ في جلب البيانات');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [date]);

    const columns = useMemo(
        () => [
            {
                accessorKey: 'name',
                header: 'اسم الحساب',
            },
            {
                accessorKey: 'opening_balance',
                header: 'رصيد أول المدة',
                Cell: ({ cell }) => formatCurrency(cell.getValue()),
                muiTableBodyCellProps: { align: 'right' },
            },
            {
                accessorKey: 'period_transactions',
                header: 'حركات الفترة',
                Cell: ({ cell }) => formatCurrency(cell.getValue()),
                muiTableBodyCellProps: { align: 'right' },
            },
            {
                accessorKey: 'net_balance',
                header: 'الرصيد النهائي',
                Cell: ({ cell }) => (
                    <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                        {formatCurrency(cell.getValue())}
                    </Typography>
                ),
                muiTableBodyCellProps: { align: 'right' },
            },
        ],
        [],
    );

    const handleExport = () => {
        const columnsForExport = [
            { id: 'name', columnDef: { header: 'اسم الحساب', size: 150 } },
            { id: 'opening_balance', columnDef: { header: 'رصيد أول المدة', size: 120 } },
            { id: 'period_transactions', columnDef: { header: 'حركات الفترة', size: 120 } },
            { id: 'net_balance', columnDef: { header: 'الرصيد النهائي', size: 120 } },
        ];

        exportToExcel(data, columnsForExport, `Bank_Cash_Balances_${date}`);
    };

    return (
        <Container maxWidth="lg">
            <Box sx={{ my: 4 }}>
                <Typography variant="h4" gutterBottom align="center" sx={{ fontWeight: 'bold', mb: 4 }}>
                    أرصدة البنوك والصناديق
                </Typography>

                <Grid container spacing={3} sx={{ mb: 4 }}>
                    <Grid item xs={12} md={4}>
                        <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', bgcolor: 'primary.main', color: 'white' }}>
                            <CardContent sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <Box>
                                    <Typography variant="h6">إجمالي السيولة</Typography>
                                    <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                                        {formatCurrency(summary.total_net_balance)}
                                    </Typography>
                                </Box>
                                <AccountBalanceIcon sx={{ fontSize: 40, opacity: 0.8 }} />
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <Card sx={{ height: '100%', display: 'flex', alignItems: 'center', px: 3 }}>
                            <Box sx={{ width: '100%' }}>
                                <Typography variant="subtitle2" color="text.secondary">إجمالي أرصدة أول المدة</Typography>
                                <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                                    {formatCurrency(summary.total_opening)}
                                </Typography>
                            </Box>
                        </Card>
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <Card sx={{ height: '100%', display: 'flex', alignItems: 'center', px: 3 }}>
                            <Box sx={{ width: '100%' }}>
                                <Typography variant="subtitle1" gutterBottom>تاريخ التقرير</Typography>
                                <TextField
                                    type="date"
                                    fullWidth
                                    value={date}
                                    onChange={(e) => setDate(e.target.value)}
                                    size="small"
                                />
                            </Box>
                        </Card>
                    </Grid>
                </Grid>

                {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

                {loading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', my: 10 }}>
                        <CircularProgress />
                    </Box>
                ) : (
                    <MaterialReactTable
                        columns={columns}
                        data={data}
                        enableColumnOrdering
                        enableGlobalFilter
                        localization={MRT_Localization_AR}
                        renderTopToolbarCustomActions={() => (
                            <Button
                                color="primary"
                                onClick={handleExport}
                                startIcon={<FileDownloadIcon />}
                                variant="contained"
                            >
                                تصدير إلى Excel
                            </Button>
                        )}
                        initialState={{
                            pagination: { pageSize: 25, pageIndex: 0 },
                        }}
                        muiTablePaperProps={{
                            elevation: 2,
                            sx: { borderRadius: '10px' }
                        }}
                    />
                )}
            </Box>
        </Container>
    );
};

export default BankAndCashBalancesPage;
