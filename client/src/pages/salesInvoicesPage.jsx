import React, { useEffect, useState } from "react";
import { Box, Button, CircularProgress, Dialog, DialogTitle, DialogContent, DialogActions } from "@mui/material";
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

    const columns = [
        { accessorKey: "invoice_number", header: "رقم الفاتورة" },
        { accessorKey: "invoice_date", header: "تاريخ الفاتورة" },
        { accessorKey: "status", header: "الحالة" },
        { accessorKey: "total_amount", header: "الإجمالي" },
        {
            header: "إجراءات",
            Cell: ({ row }) => (
                <Box sx={{ display: "flex", gap: 1 }}>
                    <Button
                        size="small"
                        variant="outlined"
                        onClick={() => handleEdit(row.original)}
                    >
                        تعديل
                    </Button>
                    <Button
                        size="small"
                        variant="contained"
                        color="secondary"
                        onClick={() =>
                            navigate(`/sales-orders?order_id=${row.original.sales_order_id}`)
                        }
                    >
                        عرض الطلب
                    </Button>
                    <Button
                        size="small"
                        variant="outlined"
                        color="info"
                        onClick={() => handleOpenPayments(row.original)}
                    >
                        قبض
                    </Button>
                    <Button
                        size="small"
                        variant="contained"
                        color="warning"
                        onClick={() => handlePreview(row.original)}
                    >
                        معاينة
                    </Button>
                </Box>
            ),
        },
    ];

    if (loading === "loading") {
        return (
            <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box p={2}>
            <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
                <Button variant="contained" onClick={handleCreate}>
                    إضافة فاتورة مبيعات
                </Button>
            </Box>

            <MaterialReactTable columns={columns} data={invoices} />

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
