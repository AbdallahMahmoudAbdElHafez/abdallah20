import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { fetchCustomerStatement, exportCustomerStatement } from "../api/customerLedgerApi";
import {
    Card,
    CardContent,
    CardHeader,
    Typography,
    Box,
    Button,
    CircularProgress,
    Grid,
    Paper,
    Divider,
    Stack
} from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { ar } from "date-fns/locale";
import { MaterialReactTable } from "material-react-table";
import { defaultTableProps } from "../config/tableConfig";
import { FileDownload as FileDownloadIcon, Refresh as RefreshIcon } from "@mui/icons-material";

export default function CustomerStatement({ customerId, fromParam, toParam }) {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [exporting, setExporting] = useState(false);
    const [error, setError] = useState("");
    const [from, setFrom] = useState(fromParam ? new Date(fromParam) : null);
    const [to, setTo] = useState(toParam ? new Date(toParam) : null);

    const navigate = useNavigate();

    const loadData = async () => {
        try {
            setLoading(true);
            const result = await fetchCustomerStatement(customerId, {
                from: from ? from.toISOString().slice(0, 10) : "",
                to: to ? to.toISOString().slice(0, 10) : "",
            });
            setData(result);
            setError("");

            const params = new URLSearchParams();
            if (from) params.set("from", from.toISOString().slice(0, 10));
            if (to) params.set("to", to.toISOString().slice(0, 10));
            navigate({
                pathname: `/customers/${customerId}/statement`,
                search: params.toString(),
            });
        } catch (err) {
            setError(err.message || "حدث خطأ");
        } finally {
            setLoading(false);
        }
    };

    const handleExport = async () => {
        try {
            setExporting(true);
            const blob = await exportCustomerStatement(customerId, {
                from: from ? from.toISOString().slice(0, 10) : "",
                to: to ? to.toISOString().slice(0, 10) : "",
            });
            const url = window.URL.createObjectURL(new Blob([blob]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `Customer_Statement_${customerId}.xlsx`);
            document.body.appendChild(link);
            link.click();
            link.parentNode.removeChild(link);
        } catch (err) {
            console.error("Export error:", err);
            alert("حدث خطأ أثناء التصدير");
        } finally {
            setExporting(false);
        }
    };

    useEffect(() => {
        if (customerId) loadData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [customerId]);

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight={400}>
                <CircularProgress color="primary" />
                <Typography sx={{ ml: 2, fontWeight: 'bold' }}>جاري تحميل كشف الحساب...</Typography>
            </Box>
        );
    }

    if (error) {
        return (
            <Box sx={{ p: 4, textAlign: 'center' }}>
                <Typography color="error" variant="h6">{error}</Typography>
                <Button onClick={loadData} variant="outlined" sx={{ mt: 2 }}>إعادة المحاولة</Button>
            </Box>
        );
    }

    const customerName = data?.customer?.name ?? "غير معروف";
    const openingBalance = Number(data?.opening_balance ?? 0);
    const closingBalance = Number(data?.closing_balance ?? 0);
    const statementRows = Array.isArray(data?.statement) ? data.statement : [];

    // Calculate totals for summary cards
    const totalDebit = statementRows.reduce((sum, row) => sum + Number(row.debit || 0), 0);
    const totalCredit = statementRows.reduce((sum, row) => sum + Number(row.credit || 0), 0);

    const columns = [
        { accessorKey: "date", header: "التاريخ", size: 120 },
        { accessorKey: "description", header: "الوصف", size: 300 },
        {
            accessorKey: "debit",
            header: "مدين",
            size: 120,
            Cell: ({ cell }) => (
                <Typography color="error.main" fontWeight="bold">
                    {Number(cell.getValue() ?? 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </Typography>
            ),
        },
        {
            accessorKey: "credit",
            header: "دائن",
            size: 120,
            Cell: ({ cell }) => (
                <Typography color="success.main" fontWeight="bold">
                    {Number(cell.getValue() ?? 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </Typography>
            ),
        },
        {
            accessorKey: "running_balance",
            header: "الرصيد",
            size: 150,
            Cell: ({ cell }) => (
                <Typography fontWeight="bold" sx={{ color: cell.getValue() < 0 ? 'error.main' : 'primary.main' }}>
                    {Number(cell.getValue() ?? 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </Typography>
            ),
        },
    ];

    const SummaryCard = ({ title, value, color }) => (
        <Paper elevation={2} sx={{ p: 2, textAlign: 'center', borderTop: `4px solid ${color}`, borderRadius: 2 }}>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>{title}</Typography>
            <Typography variant="h6" fontWeight="bold" color={color}>
                {Number(value).toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </Typography>
        </Paper>
    );

    return (
        <Box sx={{ maxWidth: "1200px", mx: "auto", p: { xs: 1, md: 3 } }}>
            <Card sx={{ borderRadius: 3, boxShadow: "0 8px 32px rgba(0,0,0,0.1)" }}>
                <CardHeader
                    sx={{ bgcolor: 'primary.main', color: 'white', py: 3 }}
                    title={
                        <Stack direction="row" justifyContent="space-between" alignItems="center">
                            <Typography variant="h5" fontWeight="bold">
                                كشف حساب: {customerName}
                            </Typography>
                            <Stack direction="row" spacing={1}>
                                <Button
                                    variant="contained"
                                    color="secondary"
                                    startIcon={<FileDownloadIcon />}
                                    onClick={handleExport}
                                    disabled={exporting}
                                    sx={{ borderRadius: 2, fontWeight: 'bold' }}
                                >
                                    {exporting ? "جاري التصدير..." : "تصدير Excel"}
                                </Button>
                            </Stack>
                        </Stack>
                    }
                />
                <CardContent sx={{ p: 4 }}>
                    {/* Filters */}
                    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ar}>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 4, p: 2, bgcolor: 'grey.50', borderRadius: 2 }}>
                            <DatePicker
                                label="من تاريخ"
                                value={from}
                                onChange={(newValue) => setFrom(newValue)}
                                slotProps={{ textField: { size: "small", sx: { bgcolor: 'white' } } }}
                            />
                            <DatePicker
                                label="إلى تاريخ"
                                value={to}
                                onChange={(newValue) => setTo(newValue)}
                                slotProps={{ textField: { size: "small", sx: { bgcolor: 'white' } } }}
                            />
                            <Button
                                variant="contained"
                                startIcon={<RefreshIcon />}
                                onClick={loadData}
                                sx={{ height: 40, borderRadius: 2 }}
                            >
                                تحديث
                            </Button>
                        </Box>
                    </LocalizationProvider>

                    {/* Summary Cards */}
                    <Grid container spacing={3} sx={{ mb: 4 }}>
                        <Grid item xs={12} sm={6} md={4}>
                            <SummaryCard title="إجمالي المدين" value={totalDebit} color="#d32f2f" />
                        </Grid>
                        <Grid item xs={12} sm={6} md={4}>
                            <SummaryCard title="إجمالي الدائن" value={totalCredit} color="#2e7d32" />
                        </Grid>
                        <Grid item xs={12} sm={6} md={4}>
                            <SummaryCard title="الرصيد الختامي" value={closingBalance} color="#1976d2" />
                        </Grid>
                    </Grid>

                    <Divider sx={{ mb: 4 }} />

                    {/* Table */}
                    <MaterialReactTable
                        columns={columns}
                        data={statementRows}
                        enableColumnFilters={false}
                        enableDensityToggle={false}
                        {...defaultTableProps}
                        enableSorting
                        muiTablePaperProps={{ elevation: 0, sx: { borderRadius: 2, border: '1px solid', borderColor: 'divider' } }}
                        muiTableHeadCellProps={{ sx: { bgcolor: 'grey.100', fontWeight: 'bold' } }}
                        initialState={{ density: "comfortable" }}
                    />

                    {/* Final Balance Footer */}
                    <Box sx={{ mt: 4, p: 3, bgcolor: 'primary.light', borderRadius: 2, color: 'primary.contrastText', textAlign: 'center' }}>
                        <Typography variant="h6" fontWeight="bold">
                            الرصيد الختامي المستحق: {closingBalance.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                        </Typography>
                    </Box>
                </CardContent>
            </Card>
        </Box>
    );
}
