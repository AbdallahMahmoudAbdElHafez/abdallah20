import React, { useEffect, useState } from "react";
import { Box, Button, CircularProgress } from "@mui/material";
import { MaterialReactTable } from "material-react-table";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchSettings, createSetting, updateSetting, deleteSetting
} from "../features/accountingSettings/accountingSettingsSlice";
import AccountingSettingDialog from "../components/AccountingSettingDialog";

export default function AccountingSettingsPage() {
  const dispatch = useDispatch();
  const { list, status } = useSelector(s => s.accountingSettings);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editRow, setEditRow] = useState(null);

  useEffect(() => {
    dispatch(fetchSettings());
  }, [dispatch]);

  const handleAdd = () => { setEditRow(null); setDialogOpen(true); };
  const handleEdit = (row) => { setEditRow(row.original); setDialogOpen(true); };
  const handleDelete = (id) => {
    if (window.confirm("حذف الإعداد؟")) dispatch(deleteSetting(id));
  };

  const handleSubmit = (data) => {
    if (editRow) {
      dispatch(updateSetting({ id: editRow.id, data }));
    } else {
      dispatch(createSetting(data));
    }
  };

  const columns = [
    { accessorKey: "id", header: "ID" },
    { accessorKey: "operation_type", header: "Operation" },
    { accessorKey: "scope", header: "Scope" },
    { accessorKey: "parent_account_id", header: "Parent Account" },
    { accessorKey: "default_account_id", header: "Default Account" },
    { accessorKey: "description", header: "Description" },
    {
      header: "Actions",
      Cell: ({ row }) => (
        <Box sx={{ display: "flex", gap: 1 }}>
          <Button size="small" onClick={() => handleEdit(row)}>تعديل</Button>
          <Button
            size="small"
            color="error"
            onClick={() => handleDelete(row.original.id)}
          >
            حذف
          </Button>
        </Box>
      ),
    },
  ];

  if (status === "loading") {
    return <CircularProgress sx={{ m: 4 }} />;
  }

  return (
    <Box p={2}>
      <Button variant="contained" onClick={handleAdd} sx={{ mb: 2 }}>
        إضافة إعداد
      </Button>
      <MaterialReactTable columns={columns} data={list} />
      <AccountingSettingDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onSubmit={handleSubmit}
        initialData={editRow}
      />
    </Box>
  );
}
