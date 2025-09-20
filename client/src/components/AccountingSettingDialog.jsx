import React, { useState, useEffect } from "react";
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, TextField, MenuItem, CircularProgress
} from "@mui/material";
import accountsApi from "../api/accountsApi";

export default function AccountingSettingDialog({
  open, onClose, onSubmit, initialData
}) {
  const [form, setForm] = useState({
    operation_type: "",
    scope: "",
    parent_account_id: "",
    default_account_id: "",
    description: "",
  });

  const [accounts, setAccounts] = useState([]);
  const [loadingAcc, setLoadingAcc] = useState(false);

  useEffect(() => {
    setForm(initialData || {
      operation_type: "",
      scope: "",
      parent_account_id: "",
      default_account_id: "",
      description: "",
    });
  }, [initialData]);

  // جلب كل الحسابات عند فتح الـDialog
  useEffect(() => {
    if (open) {
      setLoadingAcc(true);
      accountsApi.getAll()
        .then(res => setAccounts(res.data))
        .finally(() => setLoadingAcc(false));
    }
  }, [open]);

  const handleChange = e =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSave = () => {
    onSubmit(form);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <DialogTitle>
        {initialData ? "تعديل الإعداد" : "إضافة إعداد"}
      </DialogTitle>

      <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
        <TextField
          name="operation_type"
          label="Operation Type"
          value={form.operation_type}
          onChange={handleChange}
        />
        <TextField
          name="scope"
          label="Scope (اختياري)"
          value={form.scope}
          onChange={handleChange}
        />

        {loadingAcc ? (
          <CircularProgress size={24} />
        ) : (
          <>
            <TextField
              select
              name="parent_account_id"
              label="Parent Account"
              value={form.parent_account_id}
              onChange={handleChange}
            >
              {accounts.map(acc => (
                <MenuItem key={acc.id} value={acc.id}>
                  {acc.name}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              select
              name="default_account_id"
              label="Default Account"
              value={form.default_account_id}
              onChange={handleChange}
            >
              {accounts.map(acc => (
                <MenuItem key={acc.id} value={acc.id}>
                  {acc.name}
                </MenuItem>
              ))}
            </TextField>
          </>
        )}

        <TextField
          name="description"
          label="Description"
          multiline
          value={form.description}
          onChange={handleChange}
        />
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>إلغاء</Button>
        <Button variant="contained" onClick={handleSave}>
          حفظ
        </Button>
      </DialogActions>
    </Dialog>
  );
}
