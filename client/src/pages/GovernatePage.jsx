import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchGovernates, addGovernate, updateGovernate, deleteGovernate } from "../features/governates/governatesSlice";
import { fetchCountries } from "../features/countries/countriesSlice";
import { MaterialReactTable } from "material-react-table";
import { defaultTableProps } from "../config/tableConfig";
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
  IconButton,
  FormControl,
  InputLabel,
  Select
} from "@mui/material";

export default function GovernatesPage() {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const countryIdFilter = queryParams.get("country_id") ? parseInt(queryParams.get("country_id")) : null;

  const { items, loading } = useSelector((state) => state.governates);
  const { items: countries } = useSelector((state) => state.countries);

  const [openDialog, setOpenDialog] = useState(false);
  const [editRow, setEditRow] = useState(null);
  const [formData, setFormData] = useState({ name: "", country_id: "" });
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  useEffect(() => {
    dispatch(fetchGovernates());
    dispatch(fetchCountries());
  }, [dispatch]);

  const handleOpenDialog = (row = null) => {
    if (row) {
      setEditRow(row);
      setFormData({ name: row.name, country_id: row.country_id || "" });
    } else {
      setEditRow(null);
      setFormData({ name: "", country_id: countryIdFilter || "" });
    }
    setOpenDialog(true);
  };

  const handleSave = () => {
    if (editRow) {
      dispatch(updateGovernate({ id: editRow.id, data: formData }))
        .unwrap()
        .then(() => setSnackbar({ open: true, message: "Governate updated!", severity: "success" }));
    } else {
      dispatch(addGovernate(formData))
        .unwrap()
        .then(() => setSnackbar({ open: true, message: "Governate added!", severity: "success" }));
    }
    setOpenDialog(false);
  };

  const handleDelete = (id) => {
    dispatch(deleteGovernate(id))
      .unwrap()
      .then(() => setSnackbar({ open: true, message: "Governate deleted!", severity: "info" }));
  };

  const filteredData = countryIdFilter
    ? items.filter(g => g.country_id === countryIdFilter)
    : items;

  const countryName = countryIdFilter
    ? countries.find(c => c.id === countryIdFilter)?.name
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
        {countryName && (
          <Typography color="text.primary">
            المحافظات التابعة لدولة {countryName}
          </Typography>
        )}
      </Breadcrumbs>

      <Button variant="contained" sx={{ mb: 2 }} onClick={() => handleOpenDialog()}>Add Governate</Button>

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
            {/* زر Manage Governates */}
            <Button
              size="small"
              variant="contained"
              onClick={() => navigate(`/cities?governate_id=${row.original.id}`)}
            >
              المناطق
            </Button>
          </Box>
        )}
      />

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>{editRow ? "Edit Governate" : "Add Governate"}</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            margin="dense"
            label="Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />

          <FormControl fullWidth margin="dense">
            <InputLabel id="country-label">الدوله</InputLabel>
            <Select
              labelId="country-label"
              value={formData.country_id || ""}

              onChange={(e) => {
                const val = e.target.value;
                // تحديث state بالـ country الجديد
                queryParams.set("country_id", val);
                setFormData({ ...formData, country_id: e.target.value })
                navigate(`/governates?${queryParams.toString()}`);
              }}
            >
              {countries.map((c) => (
                <MenuItem key={c.id} value={c.id}>
                  {c.name}
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
