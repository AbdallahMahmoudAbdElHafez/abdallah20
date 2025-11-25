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
import { defaultTableProps } from "../config/tableConfig";
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
    { accessorKey: "id", header: "الرقم التعريفي" },
    { accessorKey: "name", header: "اسم الحساب" },
    { accessorKey: "account_type", header: "نوع الحساب" },
    {
      accessorKey: "parent_account_id",
      header: "الحساب الرئيسي",
      Cell: ({ cell }) => {
        const parent = accounts.find((a) => a.id === cell.getValue());
        return parent ? parent.name : "-";
      },
    },
    { accessorKey: "opening_balance", header: "الرصيد الافتتاحي" },
    { accessorKey: "note", header: "ملاحظات" },
  ];

  return (
    <Box p={3}>
      {/* Breadcrumbs */}
      <Breadcrumbs sx={{ mb: 2 }}>
        <Link to="/">الرئيسية</Link>
        <Typography color="text.primary">دليل الحسابات</Typography>
      </Breadcrumbs>

      {/* Title */}
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Typography variant="h5">دليل الحسابات</Typography>
        <Button variant="contained" onClick={() => handleOpenDialog()}>
          إضافة حساب
        </Button>
      </Box>

      {/* Table */}
      {loading ? (
        <Box display="flex" justifyContent="center" mt={3}>
          <CircularProgress />
        </Box>
      ) : (
        <MaterialReactTable
          {...defaultTableProps}
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
                تعديل
              </Button>
              <Button
                size="small"
                color="error"
                variant="outlined"
                onClick={() => handleDelete(row.original.id)}
              >
                حذف
              </Button>
            </Box>
          )}
        />
      )}

      {/* Dialog Add/Edit */}
      <Dialog open={openDialog} onClose={handleCloseDialog} fullWidth>
        <DialogTitle>
          {editingAccount ? "تعديل الحساب" : "إضافة حساب"}
        </DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="اسم الحساب"
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
            <MenuItem value="asset">أصول</MenuItem>
            <MenuItem value="liability">خصوم</MenuItem>
            <MenuItem value="equity">حقوق ملكية</MenuItem>
            <MenuItem value="revenue">إيرادات</MenuItem>
            <MenuItem value="expense">مصروفات</MenuItem>
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
              <em>لا يوجد حساب رئيسي</em>
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
            label="الرصيد الافتتاحي"
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
            label="ملاحظات"
            fullWidth
            multiline
            rows={3}
            value={formData.note}
            onChange={(e) => setFormData({ ...formData, note: e.target.value })}
            sx={{ mt: 2 }}
          />
        </DialogContent>

        <DialogActions>
          <Button onClick={handleCloseDialog}>إلغاء</Button>
          <Button variant="contained" onClick={handleSubmit}>
            {editingAccount ? "تحديث" : "إضافة"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AccountsPage;
