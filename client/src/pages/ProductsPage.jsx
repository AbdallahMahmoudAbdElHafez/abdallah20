import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts, addProduct, updateProduct, deleteProduct } from "../features/products/productsSlice";
import { fetchUnits } from "../features/units/unitsSlice";

import {MaterialReactTable} from "material-react-table";
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
} from "@mui/material";

export default function ProductsPage() {
  const dispatch = useDispatch();
  const { items: products, loading } = useSelector((state) => state.products);
  const { items: units } = useSelector((state) => state.units);

  const [openDialog, setOpenDialog] = useState(false);
  const [editRow, setEditRow] = useState(null);
  const [formData, setFormData] = useState({ name: "", price: "", cost_price: "", unit_id: "" });
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  useEffect(() => {
    dispatch(fetchProducts());
    dispatch(fetchUnits());
  }, [dispatch]);

  const handleOpenDialog = (row = null) => {
    if (row) {
      setEditRow(row);
      setFormData({
        name: row.name,
        price: row.price,
        cost_price: row.cost_price,
        unit_id: row.unit_id || "",
      });
    } else {
      setEditRow(null);
      setFormData({ name: "", price: "", cost_price: "", unit_id: "" });
    }
    setOpenDialog(true);
  };

  const handleSave = () => {
    if (editRow) {
      dispatch(updateProduct({ id: editRow.id, data: formData }))
        .unwrap()
        .then(() => setSnackbar({ open: true, message: "Product updated!", severity: "success" }));
    } else {
      dispatch(addProduct(formData))
        .unwrap()
        .then(() => setSnackbar({ open: true, message: "Product added!", severity: "success" }));
    }
    setOpenDialog(false);
  };

  const handleDelete = (id) => {
    dispatch(deleteProduct(id))
      .unwrap()
      .then(() => setSnackbar({ open: true, message: "Product deleted!", severity: "info" }));
  };

  const columns = useMemo(
    () => [
     
      { accessorKey: "name", header: "اسم المنتج" },
      { accessorKey: "price", header: "السعر" },
      { accessorKey: "cost_price", header: "سعر التكلفة" },
      { accessorKey: "unit", header: "الوحدة", Cell: ({ row }) => row.original.unit?.name || "-" },
    ],
    []
  );

  return (
    <>
      <Button variant="contained" sx={{ mb: 2 }} onClick={() => handleOpenDialog()}>Add Product</Button>

      <MaterialReactTable
        columns={columns}
        data={products}
        state={{ isLoading: loading }}
        enablePagination
        enableSorting
        enableGlobalFilter
        renderRowActions={({ row }) => (
          <Box sx={{ display: "flex", gap: 1 }}>
            <Button size="small" variant="outlined" onClick={() => handleOpenDialog(row.original)}>تعديل</Button>
            <Button size="small" color="error" variant="outlined" onClick={() => handleDelete(row.original.id)}>حذف</Button>
          </Box>
        )}
      />

      {/* Dialog Add/Edit */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>{editRow ? "Edit Product" : "Add Product"}</DialogTitle>
        <DialogContent>
          <Box display="flex" flexDirection="column" gap={2} mt={1} minWidth={300}>
            <TextField label="اسم المنتج" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
            <TextField label="السعر" type="number" value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })} />
            <TextField label="سعر التكلفة" type="number" value={formData.cost_price} onChange={(e) => setFormData({ ...formData, cost_price: e.target.value })} />
            <TextField select label="الوحدة" value={formData.unit_id} onChange={(e) => setFormData({ ...formData, unit_id: e.target.value })}>
              <MenuItem value="">None</MenuItem>
              {units.map(u => <MenuItem key={u.id} value={u.id}>{u.name}</MenuItem>)}
            </TextField>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleSave}>Save</Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar open={snackbar.open} autoHideDuration={3000} onClose={() => setSnackbar({ ...snackbar, open: false })}>
        <Alert severity={snackbar.severity} onClose={() => setSnackbar({ ...snackbar, open: false })}>{snackbar.message}</Alert>
      </Snackbar>
    </>
  );
}
3