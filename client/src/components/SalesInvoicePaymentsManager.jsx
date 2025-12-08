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
    MenuItem,
} from "@mui/material";
import { MaterialReactTable } from "material-react-table";
import { useDispatch, useSelector } from "react-redux";
import {
    fetchPaymentsByInvoice,
    deletePayment,
    updatePayment,
    addPayment,
} from "../features/salesInvoicePayments/salesInvoicePaymentsSlice";
import { fetchAccounts } from "../features/accounts/accountsSlice";

export default function SalesInvoicePaymentsManager({ invoiceId }) {
    const dispatch = useDispatch();
    const { byInvoice, status } = useSelector((s) => s.salesInvoicePayments);
    const { items: accounts } = useSelector((s) => s.accounts);

    // ====== state for editing/adding ======
    const [dialogOpen, setDialogOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        id: "",
        sales_invoice_id: invoiceId,
        amount: "",
        payment_date: new Date().toISOString().split("T")[0],
        payment_method: "cash",
        account_id: "",
        note: "",
    });

    useEffect(() => {
        if (invoiceId) {
            dispatch(fetchPaymentsByInvoice(invoiceId));
        }
        dispatch(fetchAccounts());
    }, [dispatch, invoiceId]);

    const payments = byInvoice[invoiceId] || [];

    const handleDelete = (id) => {
        if (window.confirm("Delete this payment?")) {
            dispatch(deletePayment(id));
        }
    };

    const handleOpenDialog = (payment = null) => {
        if (payment) {
            setIsEditing(true);
            setFormData({
                id: payment.id,
                sales_invoice_id: payment.sales_invoice_id,
                amount: payment.amount,
                payment_date: payment.payment_date,
                payment_method: payment.payment_method,
                account_id: payment.account_id,
                note: payment.note || "",
            });
        } else {
            setIsEditing(false);
            setFormData({
                id: "",
                sales_invoice_id: invoiceId,
                amount: "",
                payment_date: new Date().toISOString().split("T")[0],
                payment_method: "cash",
                account_id: "", // Should be selected by user
                note: "",
            });
        }
        setDialogOpen(true);
    };

    const handleSave = async () => {
        const { id, ...data } = formData;
        if (isEditing) {
            await dispatch(updatePayment({ id, data }));
        } else {
            await dispatch(addPayment(data));
        }
        setDialogOpen(false);
        dispatch(fetchPaymentsByInvoice(invoiceId)); // Refresh
    };

    const columns = [
        { accessorKey: "id", header: "ID" },
        { accessorKey: "amount", header: "Amount" },
        { accessorKey: "payment_date", header: "Date" },
        { accessorKey: "payment_method", header: "Method" },
        {
            accessorFn: (row) => row.account?.name || row.account_id,
            header: "Account"
        },
        { accessorKey: "note", header: "Note" },
        {
            header: "Actions",
            Cell: ({ row }) => (
                <Box sx={{ display: "flex", gap: 1 }}>
                    <Button
                        size="small"
                        variant="outlined"
                        onClick={() => handleOpenDialog(row.original)}
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
        return <CircularProgress />;
    }

    return (
        <Box>
            <Button variant="contained" onClick={() => handleOpenDialog()} sx={{ mb: 2 }}>
                Add Payment
            </Button>
            <MaterialReactTable
                columns={columns}
                data={payments}
                enableTopToolbar={false}
                enableBottomToolbar={false}
                muiTableContainerProps={{ sx: { maxHeight: '400px' } }}
            />

            <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} fullWidth>
                <DialogTitle>{isEditing ? "Edit Payment" : "Add Payment"}</DialogTitle>
                <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
                    <TextField
                        label="Amount"
                        type="number"
                        value={formData.amount}
                        onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                        fullWidth
                    />
                    <TextField
                        label="Date"
                        type="date"
                        InputLabelProps={{ shrink: true }}
                        value={formData.payment_date?.slice(0, 10) || ""}
                        onChange={(e) => setFormData({ ...formData, payment_date: e.target.value })}
                        fullWidth
                    />
                    <TextField
                        select
                        label="Method"
                        value={formData.payment_method}
                        onChange={(e) => setFormData({ ...formData, payment_method: e.target.value })}
                        fullWidth
                    >
                        <MenuItem value="cash">Cash</MenuItem>
                        <MenuItem value="bank_transfer">Bank Transfer</MenuItem>
                        <MenuItem value="cheque">Cheque</MenuItem>
                    </TextField>
                    <TextField
                        select
                        label="Account"
                        value={formData.account_id}
                        onChange={(e) => setFormData({ ...formData, account_id: e.target.value })}
                        fullWidth
                    >
                        {accounts.map((acc) => (
                            <MenuItem key={acc.id} value={acc.id}>{acc.name}</MenuItem>
                        ))}
                    </TextField>
                    <TextField
                        label="Note"
                        value={formData.note}
                        onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                        fullWidth
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
                    <Button onClick={handleSave} variant="contained">
                        Save
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}
