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
import SalesInvoiceDialog from "../components/SalesInvoiceDialog";
import SalesInvoicePaymentsManager from "../components/SalesInvoicePaymentsManager";

export default function SalesInvoicesPage() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { items: invoices = [], loading } = useSelector(
        (state) => state.salesInvoices
    );

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

    useEffect(() => {
        dispatch(fetchSalesInvoices());
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
                        variant="outlined"
                        color="info"
                        onClick={() => handleOpenPayments(row.original)}
                    >
                        قبض
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
        </Box>
    );
}
