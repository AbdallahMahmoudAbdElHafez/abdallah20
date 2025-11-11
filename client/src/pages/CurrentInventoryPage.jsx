import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchInventory,
  addInventory,
  updateInventory,
  deleteInventory,
} from "../features/currentInventory/currentInventorySlice.jsx";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { MaterialReactTable } from "material-react-table";
import axios from "axios";

export default function CurrentInventoryPage() {
  const dispatch = useDispatch();
  const { items, loading, error } = useSelector((s) => s.currentInventory);
  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  const [products, setProducts] = useState([]);
  const [warehouses, setWarehouses] = useState([]);
  const [form, setForm] = useState({
    product_id: "",
    warehouse_id: "",
    quantity: "",
  });

  useEffect(() => {
    dispatch(fetchInventory());
    fetchProducts();
    fetchWarehouses();
  }, [dispatch]);

  const fetchProducts = async () => {
    const r = await axios.get("http://localhost:5000/api/products");
    setProducts(r.data || []);
  };

  const fetchWarehouses = async () => {
    const r = await axios.get("http://localhost:5000/api/warehouses");
    setWarehouses(r.data || []);
  };

  const resolveName = (list, id) => list.find((x) => x.id === id)?.name || id;

  const handleOpen = (row = null) => {
    if (row) {
      setForm(row);
      setEditId(row.id);
    } else {
      setForm({ product_id: "", warehouse_id: "", quantity: "" });
      setEditId(null);
    }
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editId) dispatch(updateInventory({ id: editId, data: form }));
    else dispatch(addInventory(form));
    handleClose();
  };

  const handleDelete = (id) => {
    if (confirm("هل أنت متأكد من الحذف؟")) dispatch(deleteInventory(id));
  };

  const columns = [
    { accessorKey: "id", header: "ID" },
    {
      accessorFn: (row) => resolveName(products, row.product_id),
      header: "المنتج",
    },
    {
      accessorFn: (row) => resolveName(warehouses, row.warehouse_id),
      header: "المخزن",
    },
    { accessorKey: "quantity", header: "الكمية" },
    { accessorKey: "last_updated", header: "آخر تحديث" },
  ];

  return (
    <Box p={4}>
      <Typography variant="h5" fontWeight="bold" mb={3}>
        المخزون الحالي
      </Typography>

      <Button variant="contained" onClick={() => handleOpen()}>
        إضافة سجل جديد
      </Button>

      {loading && <Typography>جاري التحميل...</Typography>}
      {error && <Typography color="error">خطأ: {error}</Typography>}

      <Box mt={3}>
        <MaterialReactTable
          columns={columns}
          data={items}
          enableColumnActions={false}
          renderRowActions={({ row }) => (
            <Box display="flex" gap={1}>
              <Button
                size="small"
                variant="outlined"
                color="warning"
                onClick={() => handleOpen(row.original)}
              >
                تعديل
              </Button>
              <Button
                size="small"
                variant="outlined"
                color="error"
                onClick={() => handleDelete(row.original.id)}
              >
                حذف
              </Button>
            </Box>
          )}
        />
      </Box>

      {/* Dialog */}
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogTitle>
          {editId ? "تعديل سجل المخزون" : "إضافة سجل جديد"}
        </DialogTitle>
        <DialogContent dividers>
          <Box display="grid" gridTemplateColumns="1fr 1fr" gap={2}>
            <FormControl fullWidth>
              <InputLabel>المنتج</InputLabel>
              <Select
                value={form.product_id}
                label="المنتج"
                onChange={(e) =>
                  setForm({ ...form, product_id: e.target.value })
                }
              >
                {products.map((p) => (
                  <MenuItem key={p.id} value={p.id}>
                    {p.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth>
              <InputLabel>المخزن</InputLabel>
              <Select
                value={form.warehouse_id}
                label="المخزن"
                onChange={(e) =>
                  setForm({ ...form, warehouse_id: e.target.value })
                }
              >
                {warehouses.map((w) => (
                  <MenuItem key={w.id} value={w.id}>
                    {w.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              label="الكمية"
              type="number"
              value={form.quantity}
              onChange={(e) =>
                setForm({ ...form, quantity: e.target.value })
              }
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>إلغاء</Button>
          <Button onClick={handleSubmit} variant="contained">
            {editId ? "تحديث" : "حفظ"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
