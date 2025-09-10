import React, { useEffect, useState } from "react";
import {
  Box,
  Breadcrumbs,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { MaterialReactTable } from "material-react-table";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAccounts,
  addAccount,
  updateAccount,
  deleteAccount,
} from "../features/accounts/accountsSlice";
import { Link } from "react-router-dom";

const AccountsPage = () => {
  const dispatch = useDispatch();
  const { items: accounts, loading } = useSelector((state) => state.accounts);

  const [openDialog, setOpenDialog] = useState(false);
  const [editingAccount, setEditingAccount] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    account_type: "asset",
    parent_account_id: null,
    opening_balance: 0,
    note: "",
  });

  useEffect(() => {
    dispatch(fetchAccounts());
  }, [dispatch]);

  const handleOpenDialog = (account = null) => {
    console.log(account);
    if (account) {
      setEditingAccount(account);
      setFormData({
        name: account.name,
        account_type: account.account_type,
        parent_account_id: account.parent_account_id,
        opening_balance: account.opening_balance,
        note: account.note || "",
      });
    } else {
      setEditingAccount(null);
      setFormData({
        name: "",
        account_type: "asset",
        parent_account_id: null,
        opening_balance: 0,
        note: "",
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => setOpenDialog(false);

  const handleSubmit = () => {
    if (editingAccount) {
      dispatch(updateAccount({ id: editingAccount.id, data: formData }));
    } else {

      dispatch(addAccount(formData));
    }
    handleCloseDialog();
  };

  const handleDelete = (id) => {
    if (window.confirm("هل أنت متأكد من حذف هذا الحساب؟")) {
      dispatch(deleteAccount(id));
    }
  };

  const columns = [
    { accessorKey: "id", header: "ID" },
    { accessorKey: "name", header: "Name" },
    { accessorKey: "account_type", header: "Type" },
    {
      accessorKey: "parent_account_id",
      header: "Parent Account",
      Cell: ({ cell }) => {
        const parent = accounts.find((a) => a.id === cell.getValue());
        return parent ? parent.name : "-";
      },
    },
    { accessorKey: "opening_balance", header: "Opening Balance" },
    { accessorKey: "note", header: "Note" },
  ];

  return (
    <Box p={3}>
      {/* Breadcrumbs */}
      <Breadcrumbs sx={{ mb: 2 }}>
        <Link to="/">Home</Link>
        <Typography color="text.primary">Accounts</Typography>
      </Breadcrumbs>

      {/* Title */}
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Typography variant="h5">Accounts</Typography>
        <Button variant="contained" onClick={() => handleOpenDialog()}>
          Add Account
        </Button>
      </Box>

      {/* Table */}
      {loading ? (
        <Box display="flex" justifyContent="center" mt={3}>
          <CircularProgress />
        </Box>
      ) : (
        <MaterialReactTable
          columns={columns}
          data={accounts}
          enableRowActions
          renderRowActions={({ row }) => (
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
          )}
        />
      )}

      {/* Dialog Add/Edit */}
      <Dialog open={openDialog} onClose={handleCloseDialog} fullWidth>
        <DialogTitle>
          {editingAccount ? "Edit Account" : "Add Account"}
        </DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Name"
            fullWidth
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />

          {/* Account Type */}
          <Select
            margin="dense"
            fullWidth
            value={formData.account_type}
            onChange={(e) =>
              setFormData({ ...formData, account_type: e.target.value })
            }
            sx={{ mt: 2 }}
          >
            <MenuItem value="asset">Asset</MenuItem>
            <MenuItem value="liability">Liability</MenuItem>
            <MenuItem value="equity">Equity</MenuItem>
            <MenuItem value="revenue">Revenue</MenuItem>
            <MenuItem value="expense">Expense</MenuItem>
          </Select>

          {/* Parent Account */}
          <Select
            margin="dense"
            fullWidth
            value={formData.parent_account_id || ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                parent_account_id: e.target.value || null,
              })
            }
            sx={{ mt: 2 }}
            displayEmpty
          >
            <MenuItem value="">
              <em>No Parent</em>
            </MenuItem>
            {accounts.map((acc) => (
              <MenuItem key={acc.id} value={acc.id}>
                {acc.name}
              </MenuItem>
            ))}
          </Select>

          {/* Opening Balance */}
          <TextField
            margin="dense"
            label="Opening Balance"
            type="number"
            fullWidth
            value={formData.opening_balance}
            onChange={(e) =>
              setFormData({ ...formData, opening_balance: e.target.value })
            }
            sx={{ mt: 2 }}
          />

          {/* Note */}
          <TextField
            margin="dense"
            label="Note"
            fullWidth
            multiline
            rows={3}
            value={formData.note}
            onChange={(e) => setFormData({ ...formData, note: e.target.value })}
            sx={{ mt: 2 }}
          />
        </DialogContent>

        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button variant="contained" onClick={handleSubmit}>
            {editingAccount ? "Update" : "Add"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AccountsPage;
