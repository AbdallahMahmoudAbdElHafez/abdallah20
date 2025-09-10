import React, { useEffect, useMemo, useState  } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCities, addCity, updateCity, deleteCity } from "../features/cities/citiesSlice";
import { fetchGovernates } from "../features/governates/governatesSlice";
import { MaterialReactTable } from "material-react-table";
import { useLocation, Link as RouterLink } from "react-router-dom";
import { useNavigate } from "react-router-dom"; // <--- استيراد
import { Delete, Edit } from "@mui/icons-material";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Snackbar,
  Alert,
  Box,
  Typography,
  Breadcrumbs,
  Link,
  IconButton,  FormControl, InputLabel, Select
} from "@mui/material";

export default function CitiesPage() {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const governateIdFilter = queryParams.get("governate_id") ? parseInt(queryParams.get("governate_id")) : null;

  const { items, loading } = useSelector((state) => state.cities);
  const { items: governates } = useSelector((state) => state.governates);

  const [openDialog, setOpenDialog] = useState(false);
  const [editRow, setEditRow] = useState(null);
  const [formData, setFormData] = useState({ name: "", governate_id: "" });
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  useEffect(() => {
    dispatch(fetchCities());
    dispatch(fetchGovernates());
  }, [dispatch]);

  const handleOpenDialog = (row = null) => {
    if (row) {
      setEditRow(row);
      setFormData({ name: row.name, governate_id: row.governate_id || "" });
    } else {
      setEditRow(null);
      setFormData({ name: "", governate_id: governateIdFilter || "" });
    }
    setOpenDialog(true);
  };

  const handleSave = () => {
    if (editRow) {
      dispatch(updateCity({ id: editRow.id, data: formData }))
        .unwrap()
        .then(() => setSnackbar({ open: true, message: "City updated!", severity: "success" }));
    } else {
      dispatch(addCity(formData))
        .unwrap()
        .then(() => setSnackbar({ open: true, message: "City added!", severity: "success" }));
    }
    setOpenDialog(false);
  };

  const handleDelete = (id) => {
    dispatch(deleteCity(id))
      .unwrap()
      .then(() => setSnackbar({ open: true, message: "City deleted!", severity: "info" }));
  };

  const filteredData = governateIdFilter
    ? items.filter(g => g.governate_id === governateIdFilter)
    : items;

  const governateName = governateIdFilter
    ? governates.find(c => c.id === governateIdFilter)?.name
    : null;

  const columns = useMemo(
    () => [
      { accessorKey: "id", header: "ID" },
      { accessorKey: "name", header: "Name" }
    ],
    []
  );

  return (
    <Box p={4} sx={{ direction: 'rtl' }}>
      {/* Breadcrumbs */}
      <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 2, direction: 'rtl' }}>
          <Link component={RouterLink} underline="hover" color="inherit" to="/countries">
      الدول
        </Link>
        <Link component={RouterLink} underline="hover" color="inherit" to="/governates">
          المحافظات
        </Link>
        {governateName && (
          <Typography color="text.primary">
            المناطق التابعة لمحافظة {governateName}
          </Typography>
        )}
      </Breadcrumbs>

      <Button variant="contained" sx={{ mb: 2 }} onClick={() => handleOpenDialog()}>Add City</Button>

      <MaterialReactTable
        columns={columns}
        data={filteredData}
        state={{ isLoading: loading }}
        enablePagination
        enableSorting
        muiTableBodyCellProps={{ align: 'center', sx: { py: '0px' } }}
        muiTableHeadCellProps={{ align: 'center' }}
        enableGlobalFilter
        enableRowActions
        renderRowActions={({ row }) => (
          <Box sx={{ display: "flex", gap: 1 }}>
            <IconButton color="info" onClick={() => handleOpenDialog(row.original)}>
              <Edit />
            </IconButton>
            <IconButton color="error" onClick={() => handleDelete(row.original.id)}>
              <Delete />
            </IconButton>
 
          </Box>
        )}
      />

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>{editRow ? "Edit City" : "Add City"}</DialogTitle>
       <DialogContent>
          <TextField
            fullWidth
            margin="dense"
            label="Name"
            value={formData.name}
             onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />

          <FormControl fullWidth margin="dense">
            <InputLabel id="country-label">المحافظه</InputLabel>
            <Select
              labelId="country-label"
              value={formData.governate_id || ""}
     
              onChange={(e) => {
                const val = e.target.value;
                // تحديث state بالـ country الجديد
                queryParams.set("governate_id", val);
                setFormData({ ...formData, governate_id: e.target.value })
                navigate(`/cities?${queryParams.toString()}`);
              }}
            >
              {governates.map((g) => (
                <MenuItem key={g.id} value={g.id}>
                  {g.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
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
