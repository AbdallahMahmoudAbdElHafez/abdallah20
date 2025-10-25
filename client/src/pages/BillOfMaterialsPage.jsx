// src/pages/BillOfMaterialsPage.jsx
import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  loadBOM,
  addBOM,
  editBOM,
  removeBOM,
} from "../features/billOfMaterials/billOfMaterialsSlice";
import { fetchProducts } from "../features/products/productsSlice";

import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  MenuItem,
  TextField,
  Typography,
  Divider,
  List,
  ListItem,
  ListItemText,
  IconButton,
} from "@mui/material";
import { Add, Edit, Delete } from "@mui/icons-material";
import {MaterialReactTable} from "material-react-table";

export default function BillOfMaterialsPage() {
  const dispatch = useDispatch();
  const { items: bomItems, loading } = useSelector((s) => s.billOfMaterials);
  const { items: products } = useSelector((s) => s.products);

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({
    product_id: "",
    material_id: "",
    quantity_per_unit: "",
  });

  useEffect(() => {
    dispatch(loadBOM());
    dispatch(fetchProducts());
  }, [dispatch]);

  const handleOpen = (row = null) => {
    if (row) {
      setEditing(row);
      setForm({
        product_id: row.product_id,
        material_id: row.material_id,
        quantity_per_unit: row.quantity_per_unit,
      });
    } else {
      setEditing(null);
      setForm({ product_id: "", material_id: "", quantity_per_unit: "" });
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditing(null);
    setForm({ product_id: "", material_id: "", quantity_per_unit: "" });
  };

  const handleSubmit = async () => {
    if (editing) {
      await dispatch(editBOM({ id: editing.id, payload: form }));
      setEditing(null);
      setForm({ ...form, material_id: "", quantity_per_unit: "" });
    } else {
      await dispatch(addBOM(form));
      // لا نغلق الديالوج
      // نفرغ كل الـinputs إلا المنتج النهائي
      setForm({
        product_id: form.product_id,
        material_id: "",
        quantity_per_unit: "",
      });
    }
  };

  const handleDelete = (id) => {
    dispatch(removeBOM(id));
  };

  const bomForCurrentProduct = useMemo(() => {
    if (!form.product_id) return [];
    return bomItems.filter((b) => b.product_id === Number(form.product_id));
  }, [form.product_id, bomItems]);

  const columns = useMemo(
    () => [
      { accessorKey: "id", header: "ID", size: 60 },
      {
        accessorKey: "product_id",
        header: "المنتج النهائي",
        Cell: ({ cell }) =>
          products.find((p) => p.id === cell.getValue())?.name ||
          cell.getValue(),
      },
      {
        accessorKey: "material_id",
        header: "مستلزم الإنتاج",
        Cell: ({ cell }) =>
          products.find((p) => p.id === cell.getValue())?.name ||
          cell.getValue(),
      },
      {
      header: "سعر التكلفة",
      Cell: ({ row }) => {
        const mat = products.find((p) => p.id === row.original.material_id);
        return mat ? mat.cost_price : "-";
      },
    },
      { accessorKey: "quantity_per_unit", header: "الكمية لكل وحدة" },
    ],
    [products]
  );

  return (
    <Box p={2}>
      <Typography variant="h6" mb={2}>
        معادلات التصنيع (Bill of Materials)
      </Typography>

      <MaterialReactTable
        columns={columns}
        data={bomItems}
        state={{ isLoading: loading }}
        enableRowActions
        positionActionsColumn="last"
        renderRowActions={({ row }) => (
          <Box sx={{ display: "flex", gap: "0.5rem" }}>
            <Button
              variant="outlined"
              size="small"
              startIcon={<Edit />}
              onClick={() => handleOpen(row.original)}
            >
              تعديل
            </Button>
            <Button
              variant="outlined"
              size="small"
              color="error"
              startIcon={<Delete />}
              onClick={() => handleDelete(row.original.id)}
            >
              حذف
            </Button>
          </Box>
        )}
        renderTopToolbarCustomActions={() => (
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => handleOpen()}
          >
            إضافة
          </Button>
        )}
      />

      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogTitle>
          {editing ? "تعديل معادلة تصنيع" : "إضافة معادلة تصنيع"}
        </DialogTitle>
        <DialogContent dividers>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
            <TextField
              select
              label="المنتج النهائي"
              value={form.product_id}
              onChange={(e) =>
                setForm({ ...form, product_id: e.target.value })
              }
              required
              disabled={!!editing}
            >
              {products.map((p) => (
                <MenuItem key={p.id} value={p.id}>
                  {p.name}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              select
              label="مستلزم الإنتاج"
              value={form.material_id}
              onChange={(e) =>
                setForm({ ...form, material_id: e.target.value })
              }
              required
            >
              {products.map((p) => (
                <MenuItem key={p.id} value={p.id}>
                  {p.name}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              label="الكمية لكل وحدة"
              type="number"
              inputProps={{ step: "0.001" }}
              value={form.quantity_per_unit}
              onChange={(e) =>
                setForm({ ...form, quantity_per_unit: e.target.value })
              }
              required
            />
          </Box>

          {/* قائمة المكونات */}
          {form.product_id && (
            <>
              <Divider sx={{ my: 2 }} />
              <Typography variant="subtitle1" mb={1}>
                المكونات الحالية:
              </Typography>
              <List dense>
                {bomForCurrentProduct.length === 0 ? (
                  <ListItem>
                    <ListItemText primary="لا توجد مكونات بعد" />
                  </ListItem>
                ) : (
                  bomForCurrentProduct.map((m) => {
                    const matName =
                      products.find((p) => p.id === m.material_id)?.name ||
                      `ID: ${m.material_id}`;
                    return (
                      <ListItem
                        key={m.id}
                        secondaryAction={
                          <IconButton
                            edge="end"
                            aria-label="delete"
                            color="error"
                            onClick={() => handleDelete(m.id)}
                          >
                            <Delete />
                          </IconButton>
                        }
                      >
                        <ListItemText
                          primary={matName}
                          secondary={`الكمية: ${m.quantity_per_unit}`}
                        />
                      </ListItem>
                    );
                  })
                )}
              </List>
            </>
          )}
        </DialogContent>

        <DialogActions>
          <Button onClick={handleClose}>إغلاق</Button>
          <Button onClick={handleSubmit} variant="contained">
            {editing ? "تحديث" : "إضافة"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
