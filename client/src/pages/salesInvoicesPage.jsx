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

export default function SalesInvoicesPage() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { items: invoices = [], loading } = useSelector(
        (state) => state.salesInvoices
    );
    const products = useSelector((state) => state.products?.items || []);

    const [openDialog, setOpenDialog] = useState(false);
    const [editingInvoice, setEditingInvoice] = useState(null);
    const [editingItems, setEditingItems] = useState([]);

    // Payments Dialog State
    const [paymentsOpen, setPaymentsOpen] = useState(false);
    const [selectedInvoice, setSelectedInvoice] = useState(null);

    const handleOpenPayments = (invoice) => {
        setSelectedInvoice(invoice);
        setPaymentsOpen(true);
    };

    // Preview State
    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewInvoice, setPreviewInvoice] = useState(null);
    const [previewItems, setPreviewItems] = useState([]);

    const handlePreview = async (invoice) => {
        const res = await dispatch(
            fetchSalesInvoiceItems({ sales_invoice_id: invoice.id })
        ).unwrap();

        // Map items to include product names
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
            ),
        },
    ], [products, navigate]);

    if (loading === "loading") {
        return (
            <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "80vh" }}>
                <CircularProgress />
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
            <Dialog open={paymentsOpen} onClose={() => setPaymentsOpen(false)} maxWidth="md" fullWidth>
                <DialogTitle>مقبوضات فاتورة {selectedInvoice?.invoice_number}</DialogTitle>
                <DialogContent>
                    {selectedInvoice && <SalesInvoicePaymentsManager invoiceId={selectedInvoice.id} />}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setPaymentsOpen(false)}>إغلاق</Button>
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
