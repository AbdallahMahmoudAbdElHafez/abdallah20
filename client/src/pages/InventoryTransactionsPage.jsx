import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  MenuItem,
  Breadcrumbs,
  Typography,
  Link,
  CircularProgress,
} from "@mui/material";
import { MaterialReactTable } from "material-react-table";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchInventoryTransactions,
  addInventoryTransaction,
  updateInventoryTransaction,
  deleteInventoryTransaction,
} from "../features/inventoryTransactions/inventoryTransactionsSlice";
import { fetchProducts } from "../features/products/productsSlice";
import { fetchWarehouses } from "../features/warehouses/warehousesSlice";

const InventoryTransactionsPage = () => {
  const dispatch = useDispatch();
  const { items: transactions, loading } = useSelector(
    (s) => s.inventoryTransactions
  );
  const { items: products } = useSelector((s) => s.products);
  const { items: warehouses } = useSelector((s) => s.warehouses);

  const [open, setOpen] = useState(false);
  const [editRow, setEditRow] = useState(null);
  const [form, setForm] = useState({
    product_id: "",
    warehouse_id: "",
    transaction_type: "in",
    quantity: 0,
    cost_per_unit: 0,
    transaction_date: "",
    note: "",
  });

  useEffect(() => {
    dispatch(fetchInventoryTransactions());
    dispatch(fetchProducts());
    dispatch(fetchWarehouses());
  }, [dispatch]);

  const handleOpen = (row = null) => {
    setEditRow(row);
    setForm(
      row
        ? {
            product_id: row.product_id,
            warehouse_id: row.warehouse_id,
            transaction_type: row.transaction_type,
            quantity: row.quantity,
            cost_per_unit: row.cost_per_unit,
            transaction_date: row.transaction_date?.slice(0, 10) || "",
            note: row.note || "",
          }
        : {
            product_id: "",
            warehouse_id: "",
            transaction_type: "in",
            quantity: 0,
            cost_per_unit: 0,
            transaction_date: "",
            note: "",
          }
    );
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditRow(null);
  };

  const handleSave = () => {
    if (editRow) {
      dispatch(updateInventoryTransaction({ id: editRow.id, data: form }));
    } else {
      dispatch(addInventoryTransaction(form));
    }
    handleClose();
  };

  const handleDelete = (id) => dispatch(deleteInventoryTransaction(id));

  const columns = [
    {
      accessorKey: "product_id",
      header: "المنتج",
      Cell: ({ cell }) => products.find((p) => p.id === cell.getValue())?.name || "—",
    },
    {
      accessorKey: "warehouse_id",
      header: "المخزن",
      Cell: ({ cell }) =>
        warehouses.find((w) => w.id === cell.getValue())?.name || "—",
    },
    { accessorKey: "transaction_type", header: "النوع" },
    { accessorKey: "quantity", header: "الكمية" },
    { accessorKey: "cost_per_unit", header: "التكلفة للوحدة" },
    {
      accessorKey: "transaction_date",
      header: "تاريخ العملية",
      Cell: ({ cell }) =>
        cell.getValue()
          ? new Date(cell.getValue()).toLocaleDateString()
          : "—",
    },
    { accessorKey: "note", header: "ملاحظات" },
    {
      header: "الإجراءات",
      Cell: ({ row }) => (
        <Box sx={{ display: "flex", gap: 1 }}>
          <Button size="small" variant="outlined" onClick={() => handleOpen(row.original)}>
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
      ),
    },
  ];

  return (
    <Box p={2} dir="rtl">
      <Breadcrumbs sx={{ mb: 2 }}>
        <Link underline="hover" color="inherit" href="/">الرئيسية</Link>
        <Typography color="text.primary">حركات المخزون</Typography>
      </Breadcrumbs>

      <Box sx={{ mb: 2 }}>
        <Button variant="contained" onClick={() => handleOpen()}>
          إضافة حركة
        </Button>
      </Box>

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
          <CircularProgress />
        </Box>
      ) : (
        <MaterialReactTable columns={columns} data={transactions} />
      )}

      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm" dir="rtl">
        <DialogTitle>{editRow ? "تعديل حركة" : "إضافة حركة"}</DialogTitle>
        <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
          <TextField
            select
            label="المنتج"
            value={form.product_id}
            onChange={(e) => setForm({ ...form, product_id: e.target.value })}
          >
            {products.map((p) => (
              <MenuItem key={p.id} value={p.id}>
                {p.name}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            select
            label="المخزن"
            value={form.warehouse_id}
            onChange={(e) => setForm({ ...form, warehouse_id: e.target.value })}
          >
            {warehouses.map((w) => (
              <MenuItem key={w.id} value={w.id}>
                {w.name}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            select
            label="نوع العملية"
            value={form.transaction_type}
            onChange={(e) => setForm({ ...form, transaction_type: e.target.value })}
          >
            <MenuItem value="in">إدخال</MenuItem>
            <MenuItem value="out">إخراج</MenuItem>
          </TextField>

          <TextField
            label="الكمية"
            type="number"
            value={form.quantity}
            onChange={(e) => setForm({ ...form, quantity: e.target.value })}
          />

          <TextField
            label="التكلفة للوحدة"
            type="number"
            value={form.cost_per_unit}
            onChange={(e) => setForm({ ...form, cost_per_unit: e.target.value })}
          />

          <TextField
            type="date"
            label="تاريخ العملية"
            InputLabelProps={{ shrink: true }}
            value={form.transaction_date}
            onChange={(e) => setForm({ ...form, transaction_date: e.target.value })}
          />

          <TextField
            label="ملاحظات"
            multiline
            value={form.note}
            onChange={(e) => setForm({ ...form, note: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>إلغاء</Button>
          <Button onClick={handleSave} variant="contained">
            {editRow ? "تحديث" : "حفظ"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default InventoryTransactionsPage;
