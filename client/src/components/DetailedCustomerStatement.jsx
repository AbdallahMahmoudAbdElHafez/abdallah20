import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { fetchDetailedCustomerStatement, exportDetailedCustomerStatement } from "../api/customerLedgerApi";
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
    Stack,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Chip
} from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { ar } from "date-fns/locale";
import { MaterialReactTable } from "material-react-table";
import { defaultTableProps } from "../config/tableConfig";
import { Refresh as RefreshIcon, FileDownload as FileDownloadIcon } from "@mui/icons-material";

export default function DetailedCustomerStatement({ customerId, fromParam, toParam }) {
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
            const result = await fetchDetailedCustomerStatement(customerId, {
                from: from ? from.toISOString().slice(0, 10) : "",
                to: to ? to.toISOString().slice(0, 10) : "",
            });
            setData(result);
            setError("");

            const params = new URLSearchParams();
            if (from) params.set("from", from.toISOString().slice(0, 10));
            if (to) params.set("to", to.toISOString().slice(0, 10));
            navigate({
                pathname: `/customers/${customerId}/statement-detailed`,
                search: params.toString(),
            });
        } catch (err) {
            setError(err.message || "حدث خطأ");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (customerId) loadData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [customerId]);

    const handleExport = async () => {
        try {
            setExporting(true);
            const blob = await exportDetailedCustomerStatement(customerId, {
                from: from ? from.toISOString().slice(0, 10) : "",
                to: to ? to.toISOString().slice(0, 10) : "",
            });
            const url = window.URL.createObjectURL(new Blob([blob]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `Detailed_Customer_Statement_${customerId}.xlsx`);
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

    const formatCurrency = (val) =>
        Number(val || 0).toLocaleString(undefined, { minimumFractionDigits: 2 });

    const typeColors = {
        invoice: { label: "فاتورة", color: "error" },
        payment: { label: "سداد", color: "success" },
        return: { label: "مرتجع", color: "info" },
        refund: { label: "رد نقدية", color: "warning" },
        replacement: { label: "استبدال", color: "secondary" },
    };

    const columns = useMemo(() => [
        {
            accessorKey: "date",
            header: "التاريخ",
            size: 120,
            Cell: ({ cell }) => cell.getValue()?.slice(0, 10) || '-'
        },
        {
            accessorKey: "type",
            header: "النوع",
            size: 100,
            Cell: ({ cell }) => {
                const t = typeColors[cell.getValue()] || { label: cell.getValue(), color: "default" };
                return <Chip label={t.label} color={t.color} size="small" variant="outlined" />;
            }
        },
        { accessorKey: "description", header: "الوصف", size: 300 },
        {
            accessorKey: "debit",
            header: "مدين",
            size: 130,
            Cell: ({ cell }) => (
                <Typography color="error.main" fontWeight="bold">
                    {formatCurrency(cell.getValue())}
                </Typography>
            ),
        },
        {
            accessorKey: "credit",
            header: "دائن",
            size: 130,
            Cell: ({ cell }) => (
                <Typography color="success.main" fontWeight="bold">
                    {formatCurrency(cell.getValue())}
                </Typography>
            ),
        },
        {
            accessorKey: "running_balance",
            header: "الرصيد",
            size: 150,
            Cell: ({ cell }) => (
                <Typography fontWeight="bold" sx={{ color: cell.getValue() < 0 ? 'error.main' : 'primary.main' }}>
                    {formatCurrency(cell.getValue())}
                </Typography>
            ),
        },
    ], []);

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight={400}>
                <CircularProgress color="primary" />
                <Typography sx={{ ml: 2, fontWeight: 'bold' }}>جاري تحميل كشف الحساب التفصيلي...</Typography>
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

    const totalDebit = statementRows.reduce((sum, row) => sum + Number(row.debit || 0), 0);
    const totalCredit = statementRows.reduce((sum, row) => sum + Number(row.credit || 0), 0);

    const SummaryCard = ({ title, value, color }) => (
        <Paper elevation={2} sx={{ p: 2, textAlign: 'center', borderTop: `4px solid ${color}`, borderRadius: 2 }}>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>{title}</Typography>
            <Typography variant="h6" fontWeight="bold" color={color}>
                {formatCurrency(value)}
            </Typography>
        </Paper>
    );

    // Detail Panel: shows items for invoices / returns / replacements
    const renderDetailPanel = ({ row }) => {
        const items = row.original.items;
        if (!items || items.length === 0) {
            return (
                <Box sx={{ p: 2, textAlign: 'center' }}>
                    <Typography variant="body2" color="text.secondary">لا توجد تفاصيل أصناف لهذه الحركة</Typography>
                </Box>
            );
        }
        return (
            <Box sx={{ p: 2, maxWidth: 600 }}>
                <Typography variant="subtitle2" fontWeight="bold" gutterBottom sx={{ mb: 1 }}>
                    تفاصيل الأصناف:
                </Typography>
                <TableContainer component={Paper} variant="outlined">
                    <Table size="small">
                        <TableHead>
                            <TableRow sx={{ bgcolor: 'grey.100' }}>
                                <TableCell sx={{ fontWeight: 'bold' }}>المنتج</TableCell>
                                <TableCell sx={{ fontWeight: 'bold' }} align="center">الكمية</TableCell>
                                <TableCell sx={{ fontWeight: 'bold' }} align="center">السعر</TableCell>
                                <TableCell sx={{ fontWeight: 'bold' }} align="center">الإجمالي</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {items.map((item, idx) => (
                                <TableRow key={idx}>
                                    <TableCell>{item.product_name}</TableCell>
                                    <TableCell align="center">{item.quantity}</TableCell>
                                    <TableCell align="center">{formatCurrency(item.price)}</TableCell>
                                    <TableCell align="center">{formatCurrency(item.total)}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>
        );
    };

    return (
        <Box sx={{ maxWidth: "1200px", mx: "auto", p: { xs: 1, md: 3 } }}>
            <Card sx={{ borderRadius: 3, boxShadow: "0 8px 32px rgba(0,0,0,0.1)" }}>
                <CardHeader
                    sx={{ bgcolor: '#00695c', color: 'white', py: 3 }}
                    title={
                        <Stack direction="row" justifyContent="space-between" alignItems="center">
                            <Typography variant="h5" fontWeight="bold">
                                كشف حساب تفصيلي: {customerName}
                            </Typography>
                            <Button
                                variant="contained"
                                sx={{ bgcolor: '#004d40', '&:hover': { bgcolor: '#00352c' }, borderRadius: 2, fontWeight: 'bold' }}
                                startIcon={<FileDownloadIcon />}
                                onClick={handleExport}
                                disabled={exporting}
                            >
                                {exporting ? "جاري التصدير..." : "تصدير Excel"}
                            </Button>
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
                        <Grid item xs={12} sm={6} md={3}>
                            <SummaryCard title="الرصيد الافتتاحي" value={openingBalance} color="#1976d2" />
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                            <SummaryCard title="إجمالي المدين" value={totalDebit} color="#d32f2f" />
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                            <SummaryCard title="إجمالي الدائن" value={totalCredit} color="#2e7d32" />
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                            <SummaryCard title="الرصيد الختامي" value={closingBalance} color="#00695c" />
                        </Grid>
                    </Grid>

                    <Divider sx={{ mb: 4 }} />

                    {/* Table with Detail Panel */}
                    <MaterialReactTable
                        columns={columns}
                        data={statementRows}
                        {...defaultTableProps}
                        enableExpanding
                        enableExpandAll
                        renderDetailPanel={renderDetailPanel}
                        enableSorting
                        muiTablePaperProps={{ elevation: 0, sx: { borderRadius: 2, border: '1px solid', borderColor: 'divider' } }}
                        muiTableHeadCellProps={{ sx: { bgcolor: 'grey.100', fontWeight: 'bold' } }}
                        initialState={{ density: "comfortable" }}
                        muiDetailPanelProps={{
                            sx: { bgcolor: '#f5f5f5' }
                        }}
                    />

                    {/* Final Balance Footer */}
                    <Box sx={{ mt: 4, p: 3, bgcolor: '#00695c', borderRadius: 2, color: 'white', textAlign: 'center' }}>
                        <Typography variant="h6" fontWeight="bold">
                            الرصيد الختامي المستحق: {formatCurrency(closingBalance)}
                        </Typography>
                    </Box>
                </CardContent>
            </Card>
        </Box>
    );
}
