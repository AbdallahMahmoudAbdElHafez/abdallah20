import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Button,
  CircularProgress,
  Alert,
  Stack,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { addPayment } from "../features/purchasePayments/purchasePaymentsSlice";
import { fetchAccounts } from "../features/accounts/accountsSlice";

export default function PaymentDialog({ open, onClose, invoiceId }) {
  const dispatch = useDispatch();

  // 🟢 اجلب بيانات الحسابات من الـRedux
  const { items: allAccounts, loading: loadingAccounts } = useSelector(
    (state) => state.accounts
  );

  // 🟢 فلترة الحسابات اللي parent بتاعها اسمه "صندوق وبنوك"
  const paymentAccounts = allAccounts.filter(
    (acc) => acc.parent && acc.parent.name === "صندوق وبنوك"
  );

  const [form, setForm] = useState({
    amount: "",
    payment_date: new Date().toISOString().split("T")[0],
    payment_method: "cash",
    account_id: "",
    cheque_number: "",
    cheque_bank: "",
    notes: "",
  });

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (open) {
      // ✅ استدعاء الـ thunk لجلب الحسابات
      dispatch(fetchAccounts());
    }
  }, [open, dispatch]);

  const handleChange = (field) => (e) =>
    setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSave = async () => {
    if (!form.amount || Number(form.amount) <= 0) {
      setError("Please enter a valid amount");
      return;
    }
    if (!form.account_id) {
      setError("Please select an account");
      return;
    }
    if (!invoiceId) {
      setError("Invoice ID is missing");
      return;
    }

    setError("");
    setSaving(true);
    try {
      await dispatch(
        addPayment({
          purchase_invoice_id: invoiceId,
          amount: Number(form.amount),
          payment_date: form.payment_date,
          payment_method: form.payment_method,
          account_id: Number(form.account_id),
          cheque_number:
            form.payment_method === "cheque" ? form.cheque_number : null,
          cheque_bank:
            form.payment_method === "cheque" ? form.cheque_bank : null,
          notes: form.notes,
        })
      ).unwrap();
      onClose();
    } catch (err) {
      setError(err?.message || "Failed to add payment");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Add Payment</DialogTitle>
      <DialogContent>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Stack spacing={2} sx={{ mt: 1 }}>
          <TextField
            label="Amount"
            type="number"
            fullWidth
            value={form.amount}
            onChange={handleChange("amount")}
          />
          <TextField
            label="Payment Date"
            type="date"
            fullWidth
            InputLabelProps={{ shrink: true }}
            value={form.payment_date}
            onChange={handleChange("payment_date")}
          />

          <TextField
            select
            label="Payment Method"
            fullWidth
            value={form.payment_method}
            onChange={handleChange("payment_method")}
          >
            <MenuItem value="cash">Cash</MenuItem>
            <MenuItem value="cheque">Cheque</MenuItem>
            <MenuItem value="bank_transfer">Bank Transfer</MenuItem>
          </TextField>

          {/* ✅ Dropdown الحسابات تحت "صندوق وبنوك" */}
          <TextField
            select
            label="Account"
            fullWidth
            value={form.account_id}
            onChange={handleChange("account_id")}
            disabled={loadingAccounts}
          >
            {loadingAccounts && (
              <MenuItem disabled>
                <CircularProgress size={20} sx={{ mr: 1 }} /> Loading...
              </MenuItem>
            )}
            {paymentAccounts.map((acc) => (
              <MenuItem key={acc.id} value={acc.id}>
                {acc.name}
              </MenuItem>
            ))}
          </TextField>

          {form.payment_method === "cheque" && (
            <>
              <TextField
                label="Cheque Number"
                fullWidth
                value={form.cheque_number}
                onChange={handleChange("cheque_number")}
              />
              <TextField
                label="Bank"
                fullWidth
                value={form.cheque_bank}
                onChange={handleChange("cheque_bank")}
              />
            </>
          )}

          <TextField
            label="Notes"
            multiline
            rows={2}
            fullWidth
            value={form.notes}
            onChange={handleChange("notes")}
          />
        </Stack>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          variant="contained"
          onClick={handleSave}
          disabled={saving}
          startIcon={saving ? <CircularProgress size={20} /> : null}
        >
          {saving ? "Saving..." : "Add Payment"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
