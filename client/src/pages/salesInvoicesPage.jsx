import React, { useEffect, useState, useMemo } from "react";
import {
    Box,
    Button,
    CircularProgress,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Typography,
    Paper,
    Chip,
    IconButton,
    Tooltip,
} from "@mui/material";
import {
    Add as AddIcon,
    Visibility as ViewIcon,
    Payment as PaymentIcon,
    Edit as EditIcon,
    Receipt as ReceiptIcon,
    TrendingUp as TrendingUpIcon,
    AccountBalanceWallet as WalletIcon,
    Description as InvoiceIcon,
} from "@mui/icons-material";
import React, { useEffect, useState } from "react";
import {
    Box,
    Button,
    CircularProgress,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Typography,
    Stack,
    Card,
    CardContent,
    Grid,
    Chip,
    IconButton,
    Tooltip,
    Divider,
    Paper,
    useTheme
} from "@mui/material";
import {
    Add as AddIcon,
    Visibility as VisibilityIcon,
    Edit as EditIcon,
    AccountBalanceWallet as PaymentIcon,
    ArrowForward as ArrowIcon,
    Receipt as ReceiptIcon,
    TrendingUp as TrendIcon,
    People as PeopleIcon
} from "@mui/icons-material";
import { MaterialReactTable } from "material-react-table";
import { defaultTableProps } from "../config/tableConfig";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import {
    fetchSalesInvoices,
    updateSalesInvoice,
    addSalesInvoice,
} from "../features/salesInvoices/salesInvoicesSlice";
import { fetchSalesInvoiceItems } from "../features/salesInvoiceItems/salesInvoiceItemsSlice";
import { fetchProducts } from "../features/products/productsSlice";
import SalesInvoiceDialog from "../components/SalesInvoiceDialog";
import SalesInvoicePaymentsManager from "../components/SalesInvoicePaymentsManager";
import InvoicePreviewDialog from "../components/InvoicePreview/InvoicePreviewDialog";
import "./SalesInvoicesPage.css";

const statusConfig = {
    unpaid: { color: "error", label: "غير مدفوع" },
    paid: { color: "success", label: "مدفوع" },
    partial: { color: "warning", label: "جزئي" },
    cancelled: { color: "default", label: "ملغي" },
};

export default function SalesInvoicesPage() {
    const theme = useTheme();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { items: invoices = [], loading } = useSelector(
        (state) => state.salesInvoices
    );
    const products = useSelector((state) => state.products?.items || []);

    const [openDialog, setOpenDialog] = useState(false);
    const [editingInvoice, setEditingInvoice] = useState(null);
    const [editingItems, setEditingItems] = useState([]);

    const [paymentsOpen, setPaymentsOpen] = useState(false);
    const [selectedInvoice, setSelectedInvoice] = useState(null);

    const handleOpenPayments = (invoice) => {
        setSelectedInvoice(invoice);
        setPaymentsOpen(true);
    };

    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewInvoice, setPreviewInvoice] = useState(null);
    const [previewItems, setPreviewItems] = useState([]);

    const handlePreview = async (invoice) => {
        const res = await dispatch(
            fetchSalesInvoiceItems({ sales_invoice_id: invoice.id })
        ).unwrap();

        const mappedItems = res.map(item => ({
            ...item,
            product_name: products.find(p => p.id === item.product_id)?.name || "Unknown Product"
        }));

        setPreviewInvoice(invoice);
        setPreviewItems(mappedItems);
        setPreviewOpen(true);
    };

    useEffect(() => {
        dispatch(fetchSalesInvoices());
        dispatch(fetchProducts());
    }, [dispatch]);

    const handleEdit = async (invoice) => {
        const res = await dispatch(
            fetchSalesInvoiceItems({ sales_invoice_id: invoice.id })
        ).unwrap();
        setEditingInvoice(invoice);
        setEditingItems(res);
        setOpenDialog(true);
    };

    const handleUpdate = (payload) => {
        dispatch(updateSalesInvoice({ id: editingInvoice.id, data: payload }));
        setOpenDialog(false);
    };

    const handleCreate = () => {
        setEditingInvoice(null);
        setEditingItems([]);
        setOpenDialog(true);
    };

    const handleAdd = (payload) => {
        dispatch(addSalesInvoice(payload));
        setOpenDialog(false);
    };

    const stats = [
        { label: 'إجمالي الفواتير', value: invoices.length, icon: <ReceiptIcon color="primary" />, color: theme.palette.primary.main },
        { label: 'قيمة المبيعات', value: `${invoices.reduce((sum, inv) => sum + Number(inv.total_amount), 0).toLocaleString()} ج.م`, icon: <TrendIcon color="success" />, color: theme.palette.success.main },
        { label: 'عدد العملاء', value: [...new Set(invoices.map(inv => inv.party_id))].length, icon: <PeopleIcon color="info" />, color: theme.palette.info.main },
    ];

    // Summary Statistics
    const stats = useMemo(() => {
        const totalAmount = invoices.reduce((sum, inv) => sum + (Number(inv.total_amount) || 0), 0);
        const count = invoices.length;
        const pendingCount = invoices.filter(inv => inv.status?.toLowerCase() === 'pending' || inv.status === 'مسودة').length;

        return [
            { label: "إجمالي المبيعات", value: `${totalAmount.toLocaleString()} ج.م`, icon: <TrendingUpIcon color="primary" />, trend: "+12%", trendUp: true },
            { label: "عدد الفواتير", value: count, icon: <InvoiceIcon color="secondary" /> },
            { label: "فواتير معلقة", value: pendingCount, icon: <WalletIcon color="warning" />, trend: "تحتاج مراجعة", trendUp: false },
        ];
    }, [invoices]);

    const columns = useMemo(() => [
        {
            accessorKey: "invoice_number",
            header: "رقم الفاتورة",
            Cell: ({ cell }) => (
                <Typography variant="body2" fontWeight="600" color="primary">
                    {cell.getValue()}
                </Typography>
            )
        },
    const columns = [
        {
            accessorKey: "invoice_number",
            header: "رقم الفاتورة",
            Cell: ({ cell }) => (
                <Typography variant="body2" sx={{ fontWeight: 700, color: 'primary.main' }}>
                    {cell.getValue()}
                </Typography>
            )
        },
        { accessorKey: "party.name", header: "العميل" },
        {
            accessorKey: "invoice_date",
            header: "تاريخ الفاتورة",
            Cell: ({ cell }) => new Date(cell.getValue()).toLocaleDateString('ar-EG')
        },
        {
            accessorKey: "status",
            header: "الحالة",
            Cell: ({ cell }) => {
                const status = cell.getValue();
                let color = "default";
                if (status === "معتمد" || status === "Approved") color = "success";
                if (status === "مسودة" || status === "Draft") color = "warning";
                if (status === "ملغي" || status === "Cancelled") color = "error";

                return (
                    <Chip
                        label={status}
                        color={color}
                        size="small"
                        className="status-chip"
                        variant="outlined"
                    />
                );
            }
        },
        {
            accessorKey: "total_amount",
            header: "الإجمالي",
            Cell: ({ cell }) => (
                <Typography variant="body2" fontWeight="700">
                    {Number(cell.getValue()).toLocaleString()} ج.م
                </Typography>
            )
        },
        { accessorKey: "invoice_date", header: "التاريخ" },
        {
            accessorKey: "status",
            header: "الحالة",
            Cell: ({ cell }) => {
                const cfg = statusConfig[cell.getValue()] || statusConfig.unpaid;
                return <Chip label={cfg.label} color={cfg.color} size="small" variant="outlined" sx={{ fontWeight: 600 }} />;
            }
        },
        {
            accessorKey: "total_amount",
            header: "الإجمالي",
            Cell: ({ cell }) => (
                <Typography variant="body2" sx={{ fontWeight: 800 }}>
                    {Number(cell.getValue()).toLocaleString()} ج.م
                </Typography>
            )
        },
        {
            header: "إجراءات",
            Cell: ({ row }) => (
                <Box className="action-buttons">
                    <Tooltip title="تعديل">
                        <IconButton
                            size="small"
                            color="primary"
                            onClick={() => handleEdit(row.original)}
                        >
                            <EditIcon fontSize="small" />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="عرض الطلب">
                        <IconButton
                            size="small"
                            color="secondary"
                            onClick={() =>
                                navigate(`/sales-orders?order_id=${row.original.sales_order_id}`)
                            }
                        >
                            <ViewIcon fontSize="small" />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="قبض">
                        <IconButton
                            size="small"
                            color="info"
                            onClick={() => handleOpenPayments(row.original)}
                        >
                            <PaymentIcon fontSize="small" />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="معاينة">
                        <IconButton
                            size="small"
                            color="warning"
                            onClick={() => handlePreview(row.original)}
                        >
                            <ReceiptIcon fontSize="small" />
                        </IconButton>
                    </Tooltip>
                </Box>
                <Stack direction="row" spacing={0.5}>
                    <Tooltip title="تعديل">
                        <IconButton size="small" color="primary" onClick={() => handleEdit(row.original)}>
                            <EditIcon fontSize="small" />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="عرض الطلب">
                        <IconButton size="small" color="secondary" onClick={() => navigate(`/sales-orders?order_id=${row.original.sales_order_id}`)}>
                            <ArrowIcon fontSize="small" />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="قبض مالي">
                        <IconButton size="small" color="info" onClick={() => handleOpenPayments(row.original)}>
                            <PaymentIcon fontSize="small" />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="معاينة الفاتورة">
                        <IconButton size="small" color="warning" onClick={() => handlePreview(row.original)}>
                            <VisibilityIcon fontSize="small" />
                        </IconButton>
                    </Tooltip>
                </Stack>
            ),
        },
    ], [products, navigate]);

    if (loading === "loading") {
        return (
            <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "80vh" }}>
                <CircularProgress />
                <Box sx={{ display: "flex", justifyContent: "center", alignItems: 'center', height: '80vh' }}>
                    <CircularProgress size={60} thickness={4} />
                </Box>
                );
    }

                return (
                <Box className="sales-invoices-container">
                    <Box className="page-header">
                        <Typography className="page-title">فواتير المبيعات</Typography>
                        <Button
                            variant="contained"
                            startIcon={<AddIcon />}
                            onClick={handleCreate}
                            className="action-button"
                            sx={{ borderRadius: '12px', px: 3, py: 1 }}
                        >
                            إضافة فاتورة
                            <Box sx={{ p: 4 }}>
                                {/* Header Section */}
                                <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <Box>
                                        <Typography variant="h4" sx={{ fontWeight: 900, mb: 0.5 }}>
                                            فواتير المبيعات
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            إدارة ومتابعة فواتير المبيعات والتحصيل المالي.
                                        </Typography>
                                    </Box>
                                    <Button
                                        variant="contained"
                                        startIcon={<AddIcon />}
                                        onClick={handleCreate}
                                        sx={{
                                            borderRadius: 10,
                                            px: 3,
                                            py: 1.2,
                                            boxShadow: `0 4px 14px 0 ${theme.palette.primary.main}60`
                                        }}
                                    >
                                        إنشاء فاتورة جديدة
                                    </Button>
                                </Box>

                                <Box className="summary-cards">
                                    {stats.map((stat, index) => (
                                        <Paper key={index} className="summary-card">
                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                                <Box>
                                                    <Typography className="summary-card-label">{stat.label}</Typography>
                                                    <Typography className="summary-card-value">{stat.value}</Typography>
                                                </Box>
                                                <Box sx={{ p: 1, borderRadius: '12px', bgcolor: 'rgba(0,0,0,0.03)' }}>
                                                    {stat.icon}
                                                </Box>
                                            </Box>
                                            {stat.trend && (
                                                <Typography className={`summary-card-trend ${stat.trendUp ? 'trend-up' : 'trend-down'}`}>
                                                    {stat.trend}
                                                </Typography>
                                            )}
                                        </Paper>
                                    ))}
                                </Box>

                                <Paper className="table-container">
                                    <MaterialReactTable
                                        {...defaultTableProps}
                                        columns={columns}
                                        data={invoices}
                                        enableColumnActions={false}
                                        enableColumnFilters={false}
                                        enablePagination={true}
                                        enableSorting={true}
                                        muiTablePaperProps={{
                                            elevation: 0,
                                            sx: { borderRadius: '16px' }
                                        }}
                                    />
                                </Paper>
                                {/* Stats Cards */}
                                <Grid container spacing={3} sx={{ mb: 4 }}>
                                    {stats.map((stat, index) => (
                                        <Grid item xs={12} sm={4} key={index}>
                                            <Card elevation={0} sx={{
                                                border: `1px solid ${theme.palette.divider}`,
                                                background: `linear-gradient(45deg, ${theme.palette.background.paper} 0%, ${theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.01)'} 100%)`,
                                            }}>
                                                <CardContent sx={{ display: 'flex', alignItems: 'center', p: 3 }}>
                                                    <Box sx={{
                                                        p: 1.5,
                                                        borderRadius: 3,
                                                        bgcolor: `${stat.color}15`,
                                                        display: 'flex',
                                                        mr: 2
                                                    }}>
                                                        {stat.icon}
                                                    </Box>
                                                    <Box>
                                                        <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                                                            {stat.label}
                                                        </Typography>
                                                        <Typography variant="h5" sx={{ fontWeight: 800 }}>
                                                            {stat.value}
                                                        </Typography>
                                                    </Box>
                                                </CardContent>
                                            </Card>
                                        </Grid>
                                    ))}
                                </Grid>

                                {/* Table Section */}
                                <Paper elevation={0} sx={{
                                    borderRadius: 4,
                                    border: `1px solid ${theme.palette.divider}`,
                                    overflow: 'hidden'
                                }}>
                                    <MaterialReactTable
                                        {...defaultTableProps}
                                        columns={columns}
                                        data={invoices}
                                        muiTablePaperProps={{ elevation: 0 }}
                                        muiTableHeadCellProps={{
                                            sx: {
                                                bgcolor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)',
                                                py: 2.5
                                            }
                                        }}
                                    />
                                </Paper>

                                {openDialog && (
                                    <SalesInvoiceDialog
                                        open={openDialog}
                                        onClose={() => setOpenDialog(false)}
                                        invoice={editingInvoice}
                                        itemsInit={editingItems}
                                        onSave={editingInvoice ? handleUpdate : handleAdd}
                                    />
                                )}

                                {/* Payments Dialog */}
                                <Dialog
                                    open={paymentsOpen}
                                    onClose={() => setPaymentsOpen(false)}
                                    maxWidth="md"
                                    fullWidth
                                    PaperProps={{ sx: { borderRadius: 4 } }}
                                >
                                    <DialogTitle sx={{ fontWeight: 800, py: 3 }}>
                                        مقبوضات فاتورة: <Box component="span" sx={{ color: 'primary.main' }}>{selectedInvoice?.invoice_number}</Box>
                                    </DialogTitle>
                                    <Divider />
                                    <DialogContent sx={{ py: 4 }}>
                                        {selectedInvoice && <SalesInvoicePaymentsManager invoiceId={selectedInvoice.id} />}
                                    </DialogContent>
                                    <DialogActions sx={{ p: 3 }}>
                                        <Button onClick={() => setPaymentsOpen(false)} variant="outlined" sx={{ borderRadius: 10 }}>إغلاق</Button>
                                    </DialogActions>
                                </Dialog>

                                {/* Invoice Preview Dialog */}
                                {previewOpen && (
                                    <InvoicePreviewDialog
                                        open={previewOpen}
                                        onClose={() => setPreviewOpen(false)}
                                        invoice={previewInvoice}
                                        items={previewItems}
                                        type="sales"
                                    />
                                )}
                            </Box>
                            );
}
