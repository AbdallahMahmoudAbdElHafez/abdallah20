import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchJobOrders,
  addJobOrder,
  updateJobOrder,
  deleteJobOrder,
} from "../features/externalJobOrders/externalJobOrdersSlice";
import {
  Box,
  Button,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
} from "@mui/material";
import { MaterialReactTable } from "material-react-table";
import axios from "axios";

export default function ExternalJobOrdersPage() {
  const dispatch = useDispatch();
  const { items, loading, error } = useSelector((s) => s.externalJobOrders);

  const [open, setOpen] = useState(false);
  const [materials, setMaterials] = useState([]);
  const [products, setProducts] = useState([]);
  const [processes, setProcesses] = useState([]);
  const [parties, setParties] = useState([]);
  const [warehouses, setWarehouses] = useState([]);
  const [editId, setEditId] = useState(null);

  const [form, setForm] = useState({
    party_id: "",
    product_id: "",
    bill_of_material_id: "",
    process_id: "",
    warehouse_id: "",
    status: "planned",
    start_date: "",
    end_date: "",
    order_quantity: "",
    produced_quantity: "",
    cost_estimate: "",
    cost_actual: "",
    reference_no: "",
  });

  useEffect(() => {
    dispatch(fetchJobOrders());
    fetchProducts();
    fetchProcesses();
    fetchParties();
    fetchWarehouses();
  }, [dispatch]);

  const fetchProducts = async () => {
    const r = await axios.get("http://localhost:5000/api/products");
    setProducts(r.data || []);
  };
  const fetchProcesses = async () => {
    const r = await axios.get("http://localhost:5000/api/processes");
    setProcesses(r.data || []);
  };
  const fetchParties = async () => {
    const r = await axios.get("http://localhost:5000/api/parties");
    setParties(r.data || []);
  };
  const fetchWarehouses = async () => {
    const r = await axios.get("http://localhost:5000/api/warehouses");
    setWarehouses(r.data || []);
  };
  const fetchMaterials = async (productId) => {
    const r = await axios.get(
      `http://localhost:5000/api/bill-of-material?product_id=${productId}`
    );
    setMaterials(r.data || []);
  };

  const resolveName = (list, id) => list.find((x) => x.id === id)?.name || id;

  const handleOpen = async (job = null) => {
    if (job) {
      setForm(job);
      setEditId(job.id);
      if (job.product_id) await fetchMaterials(job.product_id);
    } else {
      setForm({
        party_id: "",
        product_id: "",
        process_id: "",
        warehouse_id: "",
        status: "planned",
        start_date: "",
        end_date: "",
        order_quantity: "",
        produced_quantity: "",
        cost_estimate: "",
        cost_actual: "",
        reference_no: "",
      });
      setMaterials([]);
      setEditId(null);
    }
    setOpen(true);
  };

  const handleProductChange = async (e) => {
    const product_id = e.target.value;
    setForm({ ...form, product_id });
    await fetchMaterials(product_id);
  };

const handleSubmit = (e) => {
  e.preventDefault();
  const cleanData = {
    ...form,
    party_id: parseInt(form.party_id) || null,
    product_id: parseInt(form.product_id) || null,
    process_id: form.process_id ? parseInt(form.process_id) : null,
    warehouse_id: parseInt(form.warehouse_id) || null,
    order_quantity: form.order_quantity ? parseFloat(form.order_quantity) : null,
    produced_quantity: form.produced_quantity
      ? parseFloat(form.produced_quantity)
      : null,
    cost_estimate: form.cost_estimate ? parseFloat(form.cost_estimate) : 0,
    cost_actual: form.cost_actual ? parseFloat(form.cost_actual) : 0,
  };

  if (editId) dispatch(updateJobOrder({ id: editId, data: cleanData }));
  else dispatch(addJobOrder(cleanData));

  setOpen(false);
};


  const handleDelete = (id) => {
    if (confirm("هل أنت متأكد من الحذف؟")) dispatch(deleteJobOrder(id));
  };

  const columns = [
    { accessorKey: "id", header: "ID" },
    {
      accessorFn: (row) => resolveName(products, row.product_id),
      header: "المنتج",
    },
    {
      accessorFn: (row) => resolveName(processes, row.process_id),
      header: "العملية",
    },
    {
      accessorFn: (row) => resolveName(parties, row.party_id),
      header: "الطرف",
    },
    {
      accessorFn: (row) => resolveName(warehouses, row.warehouse_id),
      header: "المخزن",
    },
    { accessorKey: "status", header: "الحالة" },
    { accessorKey: "order_quantity", header: "الكمية المطلوبة" },
    { accessorKey: "produced_quantity", header: "الكمية المنتجة" },
  ];

  const materialsColumns = [
    {
      accessorFn: (row) => resolveName(products, row.material_id),
      header: "الخامة",
    },
    { accessorKey: "quantity_per_unit", header: "الكمية لكل وحدة" },
  ];

  return (
    <Box p={4}>
      <Typography variant="h5" fontWeight="bold" mb={3}>
        أوامر التشغيل الخارجية
      </Typography>

      <Button variant="contained" onClick={() => handleOpen()}>
        إضافة أمر تشغيل جديد
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
      <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="md">
        <DialogTitle>
          {editId ? "تعديل أمر التشغيل" : "إضافة أمر تشغيل جديد"}
        </DialogTitle>
        <DialogContent dividers>
          <Box display="grid" gridTemplateColumns="1fr 1fr" gap={2}>
            <FormControl fullWidth>
              <InputLabel>الطرف</InputLabel>
              <Select
                value={form.party_id}
                label="الطرف"
                onChange={(e) => setForm({ ...form, party_id: e.target.value })}
              >
                {parties.map((p) => (
                  <MenuItem key={p.id} value={p.id}>
                    {p.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth>
              <InputLabel>المنتج</InputLabel>
              <Select
                value={form.product_id}
                label="المنتج"
                onChange={handleProductChange}
              >
                {products.map((p) => (
                  <MenuItem key={p.id} value={p.id}>
                    {p.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth>
              <InputLabel>العملية</InputLabel>
              <Select
                value={form.process_id}
                label="العملية"
                onChange={(e) =>
                  setForm({ ...form, process_id: e.target.value })
                }
              >
                {processes.map((proc) => (
                  <MenuItem key={proc.id} value={proc.id}>
                    {proc.name}
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
              label="رقم المرجع"
              value={form.reference_no}
              onChange={(e) =>
                setForm({ ...form, reference_no: e.target.value })
              }
            />
            <TextField
              label="الكمية المطلوبة"
              type="number"
              value={form.order_quantity}
              onChange={(e) =>
                setForm({ ...form, order_quantity: e.target.value })
              }
            />
            <TextField
              label="الكمية المنتجة"
              type="number"
              value={form.produced_quantity}
              onChange={(e) =>
                setForm({ ...form, produced_quantity: e.target.value })
              }
            />
            <TextField
              label="التكلفة المقدرة"
              type="number"
              value={form.cost_estimate}
              onChange={(e) =>
                setForm({ ...form, cost_estimate: e.target.value })
              }
            />
            <TextField
              label="التكلفة الفعلية"
              type="number"
              value={form.cost_actual}
              onChange={(e) =>
                setForm({ ...form, cost_actual: e.target.value })
              }
            />
            <TextField
              label="تاريخ البداية"
              type="date"
              InputLabelProps={{ shrink: true }}
              value={form.start_date}
              onChange={(e) =>
                setForm({ ...form, start_date: e.target.value })
              }
            />
            <TextField
              label="تاريخ النهاية"
              type="date"
              InputLabelProps={{ shrink: true }}
              value={form.end_date}
              onChange={(e) => setForm({ ...form, end_date: e.target.value })}
            />
          </Box>

          {/* جدول المواد */}
          <Box mt={4}>
            <Typography variant="h6">المواد المطلوبة (BOM)</Typography>
            <MaterialReactTable
              columns={materialsColumns}
              data={materials}
              enableColumnActions={false}
              enableSorting={false}
              enablePagination={false}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>إلغاء</Button>
          <Button onClick={handleSubmit} variant="contained">
            {editId ? "تحديث" : "حفظ"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
