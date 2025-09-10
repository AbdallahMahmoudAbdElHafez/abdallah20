import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCountries, addCountry, updateCountry, deleteCountry } from "../features/countries/countriesSlice";
import { MaterialReactTable } from "material-react-table";
import { Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Snackbar, Alert, Box ,IconButton} from "@mui/material";
import { useNavigate } from "react-router-dom"; // <--- استيراد
import { Delete, Edit } from "@mui/icons-material";

export default function CountyPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate(); // <--- تعريف navigate
  const { items, loading } = useSelector((state) => state.countries);
  const [openDialog, setOpenDialog] = useState(false);
  const [editRow, setEditRow] = useState(null);
  const [name, setName] = useState("");
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  useEffect(() => {
    dispatch(fetchCountries());
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
      dispatch(updateCountry({ id: editRow.id, data: { name } }))
        .unwrap()
        .then(() => setSnackbar({ open: true, message: "Country updated!", severity: "success" }));
    } else {
      dispatch(addCountry({ name }))
        .unwrap()
        .then(() => setSnackbar({ open: true, message: "Country added!", severity: "success" }));
    }
    setOpenDialog(false);
  };

  const handleDelete = (id) => {
    dispatch(deleteCountry(id))
      .unwrap()
      .then(() => setSnackbar({ open: true, message: "Country deleted!", severity: "info" }));
  };

  const columns = useMemo(() => [{ accessorKey: "id", header: "ID" }, { accessorKey: "name", header: "Name" }], []);

  return (
    <Box p={4} sx={{ direction: 'rtl' }} >
      <Button variant="contained" sx={{ mb: 2 }} onClick={() => handleOpenDialog()}>Add Country</Button>

      <MaterialReactTable
        columns={columns}
        data={items}
        state={{ isLoading: loading }}
        enablePagination
        enableSorting
        enableGlobalFilter
        enableRowActions
        muiTableBodyCellProps={{ align: 'center', sx: { py: '2px' } }}
        muiTableHeadCellProps={{ align: 'center' }}
        renderRowActions={({ row }) => (
          <Box sx={{ display: "flex", gap: 1 }}>
            <IconButton color="info" onClick={() => handleOpenDialog(row.original)}>
              <Edit />
            </IconButton>
            <IconButton color="error" onClick={() => handleDelete(row.original.id)}>
              <Delete />
            </IconButton>
            {/* زر Manage Governates */}
            <Button
              size="small"
              variant="contained"
              onClick={() => navigate(`/governates?country_id=${row.original.id}`)}
            >
              المحافظات
            </Button>
          </Box>
        )}
      />

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>{editRow ? "Edit Country" : "Add Country"}</DialogTitle>
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
    </Box>
  );
}
