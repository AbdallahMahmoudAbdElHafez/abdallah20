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
    Typography,
} from "@mui/material";
import { MaterialReactTable } from "material-react-table";
import { useDispatch, useSelector } from "react-redux";
import {
    fetchAllPayments,
    fetchPaymentsByInvoice,
    deletePayment,
    updatePayment,
} from "../features/salesInvoicePayments/salesInvoicePaymentsSlice";
import { defaultTableProps } from "../config/tableConfig";

export default function SalesInvoicePaymentsPage() {
    const dispatch = useDispatch();
    const { byInvoice, status } = useSelector((s) => s.salesInvoicePayments);

    // ====== Date Range Dialog State ======
    const [dateDialogOpen, setDateDialogOpen] = useState(true);
    const [dateRange, setDateRange] = useState({ startDate: "", endDate: "" });
    const [error, setError] = useState("");

    // ====== state for editing ======
    const [editOpen, setEditOpen] = useState(false);
    const [editData, setEditData] = useState({
        id: "",
        amount: "",
        payment_date: "",
        note: "",
    });

    // Fetch data only when date range is valid and submitted
    const handleDateSubmit = () => {
        const { startDate, endDate } = dateRange;
        if (!startDate || !endDate) {
            setError("Please select both start and end dates.");
            return;
        }
        if (new Date(startDate) > new Date(endDate)) {
            setError("Start date must be before end date.");
            return;
        }
        setError("");
        dispatch(fetchAllPayments({ startDate, endDate }));
        setDateDialogOpen(false);
    };

    // دمج كل المدفوعات (Assuming 'all' key or flat map if structure differs)
    // The slice puts fetchAll result into byInvoice.all
    const allPayments = byInvoice.all || [];

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
        { accessorKey: "sales_invoice.invoice_number", header: "Invoice Number" },
        { accessorKey: "sales_invoice.party.name", header: "Customer Name" },
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

    return (
        <Box p={2}>
            <Button variant="contained" onClick={() => setDateDialogOpen(true)} sx={{ mb: 2 }}>
                Change Date Range
            </Button>

            {status === "loading" ? (
                <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
                    <CircularProgress />
                </Box>
            ) : (
                <MaterialReactTable {...defaultTableProps} columns={columns} data={allPayments} />
            )}

            {/* ===== Date Range Dialog ===== */}
            <Dialog open={dateDialogOpen} disableEscapeKeyDown>
                <DialogTitle>Select Date Range</DialogTitle>
                <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1, minWidth: 300 }}>
                    <TextField
                        label="From Date"
                        type="date"
                        InputLabelProps={{ shrink: true }}
                        value={dateRange.startDate}
                        onChange={(e) => setDateRange({ ...dateRange, startDate: e.target.value })}
                        fullWidth
                    />
                    <TextField
                        label="To Date"
                        type="date"
                        InputLabelProps={{ shrink: true }}
                        value={dateRange.endDate}
                        onChange={(e) => setDateRange({ ...dateRange, endDate: e.target.value })}
                        fullWidth
                    />
                    {error && <Typography color="error" variant="body2">{error}</Typography>}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleDateSubmit} variant="contained" disabled={!dateRange.startDate || !dateRange.endDate}>
                        Show Payments
                    </Button>
                </DialogActions>
            </Dialog>

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
