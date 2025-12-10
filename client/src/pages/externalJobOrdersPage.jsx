import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchJobOrders,
  addJobOrder,
  updateJobOrder,
  deleteJobOrder,
} from "../features/externalJobOrders/externalJobOrdersSlice";
import {
  fetchJobOrderCostsByJobOrder,
  addJobOrderCost,
  updateJobOrderCost,
  deleteJobOrderCost,
} from "../features/jobOrderCosts/jobOrderCostsSlice";
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
  IconButton,
  Divider,
  Paper,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import { MaterialReactTable } from "material-react-table";
import axios from "axios";
import externalJobOrdersApi from "../api/externalJobOrdersApi";

const costTypeLabels = {
  raw_material: "مواد خام",
  processing: "معالجة",
  transport: "نقل",
  other: "أخرى",
};

export default function ExternalJobOrdersPage() {
  const dispatch = useDispatch();
  const { items, loading, error } = useSelector((s) => s.externalJobOrders);
  const { items: costs } = useSelector((s) => s.jobOrderCosts);

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
    process_id: "",
    warehouse_id: "",
    status: "planned",
    start_date: "",
    end_date: "",
    order_quantity: "",
    produced_quantity: "",
    estimated_processing_cost_per_unit: "",
    actual_processing_cost_per_unit: "",
    estimated_raw_material_cost_per_unit: "",
    actual_raw_material_cost_per_unit: "",
    total_estimated_cost: "",
    total_actual_cost: "",
    reference_no: "",
  });

  // Cost form states
  const [costFormOpen, setCostFormOpen] = useState(false);
  const [editCostId, setEditCostId] = useState(null);
  const [costForm, setCostForm] = useState({
    cost_type: "raw_material",
    amount: "",
    cost_per_unit: "",
    cost_date: "",
    notes: "",
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
      // Load costs for this job order
      dispatch(fetchJobOrderCostsByJobOrder(job.id));
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
        estimated_processing_cost_per_unit: "",
        actual_processing_cost_per_unit: "",
        estimated_raw_material_cost_per_unit: "",
        actual_raw_material_cost_per_unit: "",
        total_estimated_cost: "",
        total_actual_cost: "",
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
    // Calculate raw material cost if we have all required data
    if (product_id && form.warehouse_id && form.order_quantity) {
      await calculateRawMaterialCost(product_id, form.warehouse_id, form.order_quantity);
    }
  };

  const handleQuantityChange = async (e) => {
    const order_quantity = e.target.value;
    setForm({ ...form, order_quantity });
    // Calculate raw material cost if we have all required data
    if (form.product_id && form.warehouse_id && order_quantity) {
      await calculateRawMaterialCost(form.product_id, form.warehouse_id, order_quantity);
    }
  };

  const handleWarehouseChange = async (e) => {
    const warehouse_id = e.target.value;
    setForm({ ...form, warehouse_id });
    // Calculate raw material cost if we have all required data
    if (form.product_id && warehouse_id && form.order_quantity) {
      await calculateRawMaterialCost(form.product_id, warehouse_id, form.order_quantity);
    }
  };

  const calculateRawMaterialCost = async (productId, warehouseId, orderQuantity) => {
    try {
      const response = await externalJobOrdersApi.calculateCost(productId, warehouseId, orderQuantity);
      if (response.data && response.data.raw_material_cost_per_unit !== undefined) {
        setForm(prev => ({ ...prev, estimated_raw_material_cost_per_unit: response.data.raw_material_cost_per_unit }));
      }
    } catch (error) {
      console.error('Error calculating cost:', error);
      // Don't show error to user, just log it
    }
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
      estimated_processing_cost_per_unit: form.estimated_processing_cost_per_unit ? parseFloat(form.estimated_processing_cost_per_unit) : 0,
      actual_processing_cost_per_unit: form.actual_processing_cost_per_unit ? parseFloat(form.actual_processing_cost_per_unit) : 0,
      estimated_raw_material_cost_per_unit: form.estimated_raw_material_cost_per_unit ? parseFloat(form.estimated_raw_material_cost_per_unit) : 0,
      actual_raw_material_cost_per_unit: form.actual_raw_material_cost_per_unit ? parseFloat(form.actual_raw_material_cost_per_unit) : 0,
      total_estimated_cost: form.total_estimated_cost ? parseFloat(form.total_estimated_cost) : 0,
      total_actual_cost: form.total_actual_cost ? parseFloat(form.total_actual_cost) : 0,
    };

    if (editId) dispatch(updateJobOrder({ id: editId, data: cleanData }));
    else dispatch(addJobOrder(cleanData));

    setOpen(false);
  };

  const handleDelete = (id) => {
    if (confirm("هل أنت متأكد من الحذف؟")) dispatch(deleteJobOrder(id));
  };

  // Cost management functions
  const handleOpenCostForm = (cost = null) => {
    if (cost) {
      setCostForm({
        cost_type: cost.cost_type,
        amount: cost.amount,
        cost_per_unit: cost.cost_per_unit || "",
        cost_date: cost.cost_date || "",
        notes: cost.notes || "",
      });
      setEditCostId(cost.id);
    } else {
      setCostForm({
        cost_type: "raw_material",
        amount: "",
        cost_per_unit: "",
        cost_date: "",
        notes: "",
      });
      setEditCostId(null);
    }
    setCostFormOpen(true);
  };

  const handleSubmitCost = (e) => {
    e.preventDefault();
    if (!editId) {
      alert("يجب حفظ أمر التشغيل أولاً قبل إضافة التكاليف");
      return;
    }

    const data = {
      job_order_id: editId,
      cost_type: costForm.cost_type,
      amount: parseFloat(costForm.amount),
      cost_per_unit: costForm.cost_per_unit ? parseFloat(costForm.cost_per_unit) : null,
      cost_date: costForm.cost_date || null,
      notes: costForm.notes || null,
    };

    if (editCostId) {
      dispatch(updateJobOrderCost({ id: editCostId, data }));
    } else {
      dispatch(addJobOrderCost(data));
    }
    setCostFormOpen(false);
  };

  const handleDeleteCost = (id) => {
    if (confirm("هل أنت متأكد من حذف هذه التكلفة؟")) {
      dispatch(deleteJobOrderCost(id));
    }
  };

  const totalCost = costs.reduce((sum, item) => sum + parseFloat(item.amount || 0), 0);

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
          enableRowActions={true}
          positionActionsColumn="last"
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

      {/* Main Dialog */}
      <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="lg">
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
                onChange={handleWarehouseChange}
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
              onChange={handleQuantityChange}
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
              label="تكلفة المعالجة للوحدة (مقدرة)"
              type="number"
              value={form.estimated_processing_cost_per_unit}
              onChange={(e) =>
                setForm({ ...form, estimated_processing_cost_per_unit: e.target.value })
              }
            />
            <TextField
              label="تكلفة المعالجة للوحدة (فعلية)"
              type="number"
              value={form.actual_processing_cost_per_unit}
              onChange={(e) =>
                setForm({ ...form, actual_processing_cost_per_unit: e.target.value })
              }
            />
            <TextField
              label="تكلفة المواد الخام للوحدة (مقدرة)"
              type="number"
              value={form.estimated_raw_material_cost_per_unit}
              InputProps={{ readOnly: true }}
              helperText="يتم حسابها تلقائياً من بنية المواد"
            />
            <TextField
              label="تكلفة المواد الخام للوحدة (فعلية)"
              type="number"
              value={form.actual_raw_material_cost_per_unit}
              onChange={(e) =>
                setForm({ ...form, actual_raw_material_cost_per_unit: e.target.value })
              }
            />
            <TextField
              label="إجمالي التكلفة المقدرة"
              type="number"
              value={form.total_estimated_cost}
              onChange={(e) =>
                setForm({ ...form, total_estimated_cost: e.target.value })
              }
              helperText="الكمية × (تكلفة معالجة + مواد خام)"
            />
            <TextField
              label="إجمالي التكلفة الفعلية"
              type="number"
              value={form.total_actual_cost}
              InputProps={{ readOnly: true }}
              helperText="يتم حسابها عند الإكمال"
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

          {/* قسم التكاليف */}
          {editId && (
            <>
              <Divider sx={{ my: 3 }} />
              <Box>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                  <Typography variant="h6">تكاليف أمر التشغيل</Typography>
                  <Button
                    variant="contained"
                    size="small"
                    startIcon={<AddIcon />}
                    onClick={() => handleOpenCostForm()}
                  >
                    إضافة تكلفة
                  </Button>
                </Box>

                <Paper variant="outlined" sx={{ p: 2 }}>
                  {costs.length === 0 ? (
                    <Typography color="text.secondary" textAlign="center">
                      لا توجد تكاليف مضافة
                    </Typography>
                  ) : (
                    <Box>
                      {costs.map((cost) => (
                        <Box
                          key={cost.id}
                          display="flex"
                          justifyContent="space-between"
                          alignItems="center"
                          p={1.5}
                          mb={1}
                          sx={{
                            border: "1px solid #e0e0e0",
                            borderRadius: 1,
                            "&:hover": { bgcolor: "#f5f5f5" },
                          }}
                        >
                          <Box flex={1}>
                            <Typography variant="body1" fontWeight="medium">
                              {costTypeLabels[cost.cost_type]}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {cost.notes || "لا توجد ملاحظات"}
                            </Typography>
                          </Box>
                          <Box display="flex" alignItems="center" gap={2}>
                            <Typography variant="h6" color="primary">
                              {parseFloat(cost.amount).toFixed(2)} جنيه
                            </Typography>
                            <Box>
                              <IconButton
                                size="small"
                                color="warning"
                                onClick={() => handleOpenCostForm(cost)}
                              >
                                <EditIcon fontSize="small" />
                              </IconButton>
                              <IconButton
                                size="small"
                                color="error"
                                onClick={() => handleDeleteCost(cost.id)}
                              >
                                <DeleteIcon fontSize="small" />
                              </IconButton>
                            </Box>
                          </Box>
                        </Box>
                      ))}
                      <Divider sx={{ my: 2 }} />
                      <Box display="flex" justifyContent="flex-end">
                        <Typography variant="h6" fontWeight="bold">
                          إجمالي التكاليف: {totalCost.toFixed(2)} جنيه
                        </Typography>
                      </Box>
                    </Box>
                  )}
                </Paper>
              </Box>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>إلغاء</Button>
          <Button onClick={handleSubmit} variant="contained">
            {editId ? "تحديث" : "حفظ"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Cost Form Dialog */}
      <Dialog open={costFormOpen} onClose={() => setCostFormOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{editCostId ? "تعديل التكلفة" : "إضافة تكلفة جديدة"}</DialogTitle>
        <DialogContent dividers>
          <Box display="flex" flexDirection="column" gap={2} mt={1}>
            <FormControl fullWidth>
              <InputLabel>نوع التكلفة</InputLabel>
              <Select
                value={costForm.cost_type}
                label="نوع التكلفة"
                onChange={(e) => setCostForm({ ...costForm, cost_type: e.target.value })}
              >
                <MenuItem value="raw_material">مواد خام</MenuItem>
                <MenuItem value="processing">معالجة</MenuItem>
                <MenuItem value="transport">نقل</MenuItem>
                <MenuItem value="other">أخرى</MenuItem>
              </Select>
            </FormControl>

            <TextField
              label="المبلغ"
              type="number"
              value={costForm.amount}
              onChange={(e) => setCostForm({ ...costForm, amount: e.target.value })}
              required
              inputProps={{ step: "0.01" }}
            />

            <TextField
              label="التكلفة للوحدة"
              type="number"
              value={costForm.cost_per_unit}
              onChange={(e) => setCostForm({ ...costForm, cost_per_unit: e.target.value })}
              inputProps={{ step: "0.01" }}
            />

            <TextField
              label="تاريخ التكلفة"
              type="date"
              InputLabelProps={{ shrink: true }}
              value={costForm.cost_date}
              onChange={(e) => setCostForm({ ...costForm, cost_date: e.target.value })}
            />

            <TextField
              label="ملاحظات"
              multiline
              rows={3}
              value={costForm.notes}
              onChange={(e) => setCostForm({ ...costForm, notes: e.target.value })}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCostFormOpen(false)}>إلغاء</Button>
          <Button onClick={handleSubmitCost} variant="contained">
            {editCostId ? "تحديث" : "حفظ"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
