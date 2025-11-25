// src/pages/IssueVoucherTypesPage.jsx
import { useEffect, useMemo, useState } from "react";
import { MaterialReactTable } from "material-react-table";
import { defaultTableProps } from "../config/tableConfig";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchIssueVoucherTypes,
  createIssueVoucherType,
  updateIssueVoucherType,
  deleteIssueVoucherType,
} from "../features/issueVoucherTypes/issueVoucherTypesSlice";
import {
  fetchAccountsByType,
  addAccountToType,
  removeAccountFromType,
  clearType,
} from "../features/issueVoucherTypeAccounts/issueVoucherTypeAccountsSlice";
import axiosClient from "../api/axiosClient";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  MenuItem,
  Box,
  Divider,
  Typography,
  Select,
  FormControl,
  InputLabel,
} from "@mui/material";

export default function IssueVoucherTypesPage() {
  const dispatch = useDispatch();
  const { list, loading } = useSelector((s) => s.issueVoucherTypes);
  const accountsState = useSelector((s) => s.issueVoucherTypeAccounts);
  const [open, setOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({ id: null, code: "", name: "", description: "" });

  // Accounts UI state
  const [accountsList, setAccountsList] = useState([]); // for select options
  const [selectedAccountId, setSelectedAccountId] = useState("");

  useEffect(() => {
    dispatch(fetchIssueVoucherTypes());
    loadAccountsList();
  }, [dispatch]);

  const loadAccountsList = async () => {
    try {
      const res = await axiosClient.get("/accounts");
      setAccountsList(res.data || []);
    } catch {
      setAccountsList([]);
    }
  };

  const openAdd = () => {
    setEditMode(false);
    setForm({ id: null, code: "", name: "", description: "" });
    setOpen(true);
  };

  const openEdit = (row) => {
    setEditMode(true);
    setForm({
      id: row.original.id,
      code: row.original.code,
      name: row.original.name,
      description: row.original.description || "",
    });
    // load accounts for this type
    dispatch(fetchAccountsByType(row.original.id));
    setOpen(true);
  };

  const closeDialog = () => {
    if (form.id) dispatch(clearType(form.id));
    setOpen(false);
    setSelectedAccountId("");
  };

  const handleSaveType = () => {
    if (editMode) {
      dispatch(updateIssueVoucherType({ id: form.id, data: form }));
    } else {
      dispatch(createIssueVoucherType(form));
    }
    setOpen(false);
  };

  const handleDeleteType = (id) => {
    if (confirm("هل تريد حذف النوع؟")) dispatch(deleteIssueVoucherType(id));
  };

  // Accounts handlers
  const handleAddAccount = async () => {
    if (!form.id) {
      alert("احفظ نوع الإذن أولاً، ثم أضف الحسابات.");
      return;
    }
    if (!selectedAccountId) return;
    await dispatch(addAccountToType({ issue_voucher_type_id: form.id, account_id: selectedAccountId }));
    setSelectedAccountId("");
    // refresh
    dispatch(fetchAccountsByType(form.id));
  };

  const handleDeleteAccount = async (id) => {
    if (!confirm("حذف الربط؟")) return;
    await dispatch(removeAccountFromType(id));
  };

  const columns = useMemo(
    () => [
      { accessorKey: "id", header: "ID", size: 50 },
      { accessorKey: "code", header: "Code" },
      { accessorKey: "name", header: "Name" },
      { accessorKey: "description", header: "Description" },
    ],
    []
  );

  const accountsColumns = useMemo(
    () => [
      { accessorKey: "id", header: "ID", size: 60 },
      {
        accessorFn: (row) => (row.account ? row.account.name : row.account_id),
        id: "account_name",
        header: "Account",
      },
      { accessorKey: "account_id", header: "Account ID", size: 120 },
      {
        accessorFn: (row) => row.name || "",
        id: "type_id",
        header: "Type ID",
      },
    ],
    []
  );

  const currentAccounts = form.id ? accountsState.byType[form.id] || [] : [];

  return (
    <Box p={3}>
      <Typography variant="h5" mb={2}>
        Issue Voucher Types
      </Typography>

      <Button variant="contained" onClick={openAdd} sx={{ mb: 2 }}>
        Add New Type
      </Button>

      <MaterialReactTable
        columns={columns}
        data={list}
        state={{ isLoading: loading }}
        enableRowActions
        renderRowActions={({ row }) => (
          <Box display="flex" gap={1}>
            <Button size="small" onClick={() => openEdit(row)}>
              Edit
            </Button>
            <Button size="small" color="error" onClick={() => handleDeleteType(row.original.id)}>
              Delete
            </Button>
          </Box>
        )}
      />

      {/* Dialog */}
      <Dialog open={open} onClose={closeDialog} fullWidth maxWidth="lg">
        <DialogTitle>{editMode ? "Edit Issue Voucher Type" : "Add Issue Voucher Type"}</DialogTitle>
        <DialogContent>
          <Box display="grid" gridTemplateColumns="1fr 1fr" gap={2} mb={2} mt={1}>
            <TextField
              label="Code"
              value={form.code}
              onChange={(e) => setForm({ ...form, code: e.target.value })}
              fullWidth
            />
            <TextField
              label="Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              fullWidth
            />
            <TextField
              label="Description"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              fullWidth
              multiline
              minRows={2}
            />
            <Box /> {/* spacer */}
          </Box>

          <Divider sx={{ my: 2 }} />

          {/* Accounts section */}
          <Box mb={1}>
            <Typography variant="h6">Linked Accounts</Typography>
            <Typography variant="body2" color="text.secondary" mb={1}>
              اربط الحسابات المحاسبية التي سيستخدمها هذا النوع عند الترحيل.
            </Typography>

            <Box display="flex" gap={2} alignItems="center" mb={2}>
              <FormControl sx={{ minWidth: 300 }}>
                <InputLabel id="select-account-label">Select Account</InputLabel>
                <Select
                  labelId="select-account-label"
                  value={selectedAccountId}
                  label="Select Account"
                  onChange={(e) => setSelectedAccountId(e.target.value)}
                >
                  <MenuItem value="">
                    <em>اختر</em>
                  </MenuItem>
                  {accountsList.map((a) => (
                    <MenuItem key={a.id} value={a.id}>
                      {a.name} ({a.id})
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <Button variant="contained" onClick={handleAddAccount} disabled={!form.id}>
                Add Account
              </Button>
            </Box>

            <MaterialReactTable
              columns={accountsColumns}
              data={currentAccounts}
              enableRowActions
              enableColumnActions={false}
              renderRowActions={({ row }) => (
                <Button color="error" size="small" onClick={() => handleDeleteAccount(row.original.id)}>
                  Delete
                </Button>
              )}
            />
          </Box>
        </DialogContent>

        <DialogActions>
          <Button onClick={closeDialog}>Cancel</Button>
          <Button variant="contained" onClick={handleSaveType}>
            {editMode ? "Update Type" : "Create Type"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
