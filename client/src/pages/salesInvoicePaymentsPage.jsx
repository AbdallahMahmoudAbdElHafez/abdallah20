import React, { useEffect, useState } from "react";
import {
    Box,
    Button,
    CircularProgress,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
} from "@mui/material";
import { MaterialReactTable } from "material-react-table";
import { useDispatch, useSelector } from "react-redux";
import {
    fetchPaymentsByInvoice,
    deletePayment,
    updatePayment,
} from "../features/salesInvoicePayments/salesInvoicePaymentsSlice";

export default function SalesInvoicePaymentsPage() {
    const dispatch = useDispatch();
    const { byInvoice, status } = useSelector((s) => s.salesInvoicePayments);

    // ====== state for editing ======
    const [editOpen, setEditOpen] = useState(false);
    const [editData, setEditData] = useState({
        id: "",
        amount: "",
        payment_date: "",
        note: "", // Changed from notes to note to match model
    });

    // جلب جميع المدفوعات
    useEffect(() => {
        dispatch(fetchPaymentsByInvoice("all"));
    }, [dispatch]);

    // دمج كل المدفوعات
    const allPayments = Object.values(byInvoice).flat();

    // حذف
    const handleDelete = (id) => {
        if (window.confirm("Delete this payment?")) {
            dispatch(deletePayment(id));
        }
    };

    // فتح نافذة التعديل
    const handleEditOpen = (row) => {
        setEditData({
            id: row.id,
            amount: row.amount,
            payment_date: row.payment_date,
            note: row.note || "",
        });
        setEditOpen(true);
    };

    // حفظ التعديل
    const handleEditSave = () => {
        const { id, ...fields } = editData;
        dispatch(updatePayment({ id, data: fields }));
        setEditOpen(false);
    };

    const columns = [
        { accessorKey: "id", header: "ID" },
        { accessorKey: "sales_invoice_id", header: "Invoice ID" },
        { accessorKey: "amount", header: "Amount" },
        { accessorKey: "payment_date", header: "Payment Date" },
        { accessorKey: "payment_method", header: "Method" },
        { accessorKey: "note", header: "Note" },
        {
            header: "Actions",
            Cell: ({ row }) => (
                <Box sx={{ display: "flex", gap: 1 }}>
                    <Button
                        size="small"
                        variant="outlined"
                        color="primary"
                        onClick={() => handleEditOpen(row.original)}
                    >
                        Edit
                    </Button>
                    <Button
                        size="small"
                        color="error"
                        variant="outlined"
                        onClick={() => handleDelete(row.original.id)}
                    >
                        Delete
                    </Button>
                </Box>
            ),
        },
    ];

    if (status === "loading") {
        return (
            <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box p={2}>
            <MaterialReactTable columns={columns} data={allPayments} />

            {/* ===== Dialog for Editing ===== */}
            <Dialog open={editOpen} onClose={() => setEditOpen(false)} fullWidth>
                <DialogTitle>Edit Payment</DialogTitle>
                <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
                    <TextField
                        label="Amount"
                        type="number"
                        value={editData.amount}
                        onChange={(e) => setEditData({ ...editData, amount: e.target.value })}
                    />
                    <TextField
                        label="Payment Date"
                        type="date"
                        InputLabelProps={{ shrink: true }}
                        value={editData.payment_date?.slice(0, 10) || ""}
                        onChange={(e) => setEditData({ ...editData, payment_date: e.target.value })}
                    />
                    <TextField
                        label="Note"
                        value={editData.note}
                        onChange={(e) => setEditData({ ...editData, note: e.target.value })}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setEditOpen(false)}>Cancel</Button>
                    <Button onClick={handleEditSave} variant="contained">
                        Save
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}
