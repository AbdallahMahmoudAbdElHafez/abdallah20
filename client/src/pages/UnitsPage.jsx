import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUnits, addUnit, updateUnit, deleteUnit } from "../features/units/unitsSlice";
import {MaterialReactTable} from "material-react-table";
import { Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Snackbar, Alert, Box } from "@mui/material";

export default function UnitsPage() {
  const dispatch = useDispatch();
  const { items, loading } = useSelector((state) => state.units);

  const [openDialog, setOpenDialog] = useState(false);
  const [editRow, setEditRow] = useState(null);
  const [name, setName] = useState("");
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  useEffect(() => {
    dispatch(fetchUnits());
  }, [dispatch]);

  const handleOpenDialog = (row = null) => {
    if (row) {
      setEditRow(row);
      setName(row.name);
    } else {
      setEditRow(null);
      setName("");
    }
    setOpenDialog(true);
  };

  const handleSave = () => {
    if (editRow) {
      dispatch(updateUnit({ id: editRow.id, data: { name } }))
        .unwrap()
        .then(() => setSnackbar({ open: true, message: "Unit updated!", severity: "success" }));
    } else {
      dispatch(addUnit({ name }))
        .unwrap()
        .then(() => setSnackbar({ open: true, message: "Unit added!", severity: "success" }));
    }
    setOpenDialog(false);
  };

  const handleDelete = (id) => {
    dispatch(deleteUnit(id))
      .unwrap()
      .then(() => setSnackbar({ open: true, message: "Unit deleted!", severity: "info" }));
  };

  const columns = useMemo(() => [{ accessorKey: "id", header: "ID" }, { accessorKey: "name", header: "Name" }], []);

  return (
    <>
      <Button variant="contained" sx={{ mb: 2 }} onClick={() => handleOpenDialog()}>Add Unit</Button>

      <MaterialReactTable
        columns={columns}
        data={items}
        state={{ isLoading: loading }}
        enablePagination
        enableSorting
        enableGlobalFilter
        renderRowActions={({ row }) => (
          <Box sx={{ display: "flex", gap: 1 }}>
            <Button size="small" variant="outlined" onClick={() => handleOpenDialog(row.original)}>Edit</Button>
            <Button size="small" color="error" variant="outlined" onClick={() => handleDelete(row.original.id)}>Delete</Button>
          </Box>
        )}
      />

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>{editRow ? "Edit Unit" : "Add Unit"}</DialogTitle>
        <DialogContent>
          <Box display="flex" flexDirection="column" gap={2} mt={1} minWidth={300}>
            <TextField label="Name" value={name} onChange={(e) => setName(e.target.value)} />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleSave}>Save</Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={snackbar.open} autoHideDuration={3000} onClose={() => setSnackbar({ ...snackbar, open: false })}>
        <Alert severity={snackbar.severity} onClose={() => setSnackbar({ ...snackbar, open: false })}>{snackbar.message}</Alert>
      </Snackbar>
    </>
  );
}
