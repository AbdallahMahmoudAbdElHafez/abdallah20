import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Typography,
  IconButton,
  Grid,
  Card,
  CardContent,
  Alert
} from "@mui/material";
import { MaterialReactTable } from "material-react-table";
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon, Visibility as ViewIcon } from "@mui/icons-material";
import axiosClient from "../api/axiosClient";

export default function ExternalJobOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    party_id: "",
    product_id: "",
    warehouse_id: "",
    order_quantity: "",
    start_date: new Date().toISOString().split("T")[0],
    end_date: "",
    estimated_processing_cost_per_unit: 0,
  });

  // Dropdown Data
  const [suppliers, setSuppliers] = useState([]);
  const [products, setProducts] = useState([]);
  const [warehouses, setWarehouses] = useState([]);

  // Send Materials Dialog State
  const [sendMaterialsOpen, setSendMaterialsOpen] = useState(false);
  const [materialsToSend, setMaterialsToSend] = useState([]);
  const [sendLoading, setSendLoading] = useState(false);

  // Receive Goods Dialog State
  const [receiveGoodsOpen, setReceiveGoodsOpen] = useState(false);
  const [receiveData, setReceiveData] = useState({
    produced_quantity: "",
    waste_quantity: 0,
    service_cost: 0,
    transport_cost: 0
  });

  useEffect(() => {
    fetchOrders();
    fetchDropdowns();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await axiosClient.get("/external-job-orders");
      setOrders(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchDropdowns = async () => {
    try {
      const [partiesRes, productsRes, warehousesRes] = await Promise.all([
        axiosClient.get("/parties"),
        axiosClient.get("/products"),
        axiosClient.get("/warehouses"),
      ]);
      setSuppliers(partiesRes.data.filter(p => p.party_type === 'supplier'));
      setProducts(productsRes.data);
      setWarehouses(warehousesRes.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleOpenSendMaterials = async (order) => {
    setSelectedOrder(order);
    setSendLoading(true);
    setSendMaterialsOpen(true);
    try {
      // Fetch BOM calculation to pre-fill
      const res = await axiosClient.get("/external-job-orders/calculate-cost", {
        params: {
          product_id: order.product_id,
          warehouse_id: order.warehouse_id,
          order_quantity: order.order_quantity
        }
      });

      if (res.data.details) {
        setMaterialsToSend(res.data.details.map(item => ({
          product_id: item.material_id,
          product_name: item.material_name,
          warehouse_id: order.warehouse_id, // Default to order warehouse
          quantity: item.required_quantity
        })));
      }
    } catch (err) {
      console.error(err);
      alert("Error fetching BOM details");
    } finally {
      setSendLoading(false);
    }
  };

  const handleSendMaterialsSubmit = async () => {
    try {
      await axiosClient.post(`/external-job-orders/${selectedOrder.id}/send-materials`, {
        items: materialsToSend
      });
      setSendMaterialsOpen(false);
      fetchOrders();
      alert("تم صرف الخامات بنجاح");
    } catch (err) {
      alert("Error sending materials: " + (err.response?.data?.message || err.message));
    }
  };

  const handleOpenReceiveGoods = (order) => {
    setSelectedOrder(order);
    setReceiveData({
      produced_quantity: order.order_quantity, // Default to ordered qty
      waste_quantity: 0,
      service_cost: 0,
      transport_cost: 0
    });
    setReceiveGoodsOpen(true);
  };

  const handleReceiveGoodsSubmit = async () => {
    try {
      await axiosClient.post(`/external-job-orders/${selectedOrder.id}/receive-goods`, receiveData);
      setReceiveGoodsOpen(false);
      fetchOrders();
      alert("تم استلام المنتج التام بنجاح");
    } catch (err) {
      alert("Error receiving goods: " + (err.response?.data?.message || err.message));
    }
  };

  const handleSave = async () => {
    try {
      if (selectedOrder) {
        await axiosClient.put(`/external-job-orders/${selectedOrder.id}`, formData);
      } else {
        await axiosClient.post("/external-job-orders", formData);
      }
      setDialogOpen(false);
      fetchOrders();
    } catch (err) {
      alert("Error saving order");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure?")) {
      await axiosClient.delete(`/external-job-orders/${id}`);
      fetchOrders();
    }
  };

  const columns = [
    { accessorKey: "id", header: "ID" },
    {
      accessorKey: "party_id",
      header: "المورد",
      Cell: ({ cell }) => suppliers.find(s => s.id === cell.getValue())?.name || cell.getValue()
    },
    {
      accessorKey: "product_id",
      header: "المنتج النهائي",
      Cell: ({ cell }) => products.find(p => p.id === cell.getValue())?.name || cell.getValue()
    },
    { accessorKey: "order_quantity", header: "الكمية المطلوبة" },
    { accessorKey: "status", header: "الحالة" },
    {
      header: "إجراءات",
      Cell: ({ row }) => (
        <Box sx={{ display: 'flex', gap: 1 }}>
          <IconButton onClick={() => { setSelectedOrder(row.original); setFormData(row.original); setDialogOpen(true); }}>
            <EditIcon />
          </IconButton>
          <IconButton color="error" onClick={() => handleDelete(row.original.id)}>
            <DeleteIcon />
          </IconButton>
          {row.original.status === 'planned' && (
            <Button variant="outlined" size="small" onClick={() => handleOpenSendMaterials(row.original)}>
              صرف خامات
            </Button>
          )}
          {row.original.status === 'in_progress' && (
            <Button variant="contained" size="small" color="success" onClick={() => handleOpenReceiveGoods(row.original)}>
              استلام منتج تام
            </Button>
          )}
        </Box>
      )
    }
  ];

  return (
    <Box p={2}>
      <Button variant="contained" startIcon={<AddIcon />} onClick={() => { setSelectedOrder(null); setDialogOpen(true); }}>
        أمر تشغيل جديد
      </Button>

      <MaterialReactTable columns={columns} data={orders} state={{ isLoading: loading }} />

      {/* Create/Edit Dialog */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} fullWidth maxWidth="md">
        <DialogTitle>{selectedOrder ? "تعديل أمر تشغيل" : "أمر تشغيل جديد"}</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={6}>
              <TextField
                select
                label="المورد (المصنع)"
                fullWidth
                value={formData.party_id}
                onChange={(e) => setFormData({ ...formData, party_id: e.target.value })}
              >
                {suppliers.map(s => <MenuItem key={s.id} value={s.id}>{s.name}</MenuItem>)}
              </TextField>
            </Grid>
            <Grid item xs={6}>
              <TextField
                select
                label="المخزن (للمواد الخام)"
                fullWidth
                value={formData.warehouse_id}
                onChange={(e) => setFormData({ ...formData, warehouse_id: e.target.value })}
              >
                {warehouses.map(w => <MenuItem key={w.id} value={w.id}>{w.name}</MenuItem>)}
              </TextField>
            </Grid>
            <Grid item xs={6}>
              <TextField
                select
                label="المنتج النهائي"
                fullWidth
                value={formData.product_id}
                onChange={(e) => setFormData({ ...formData, product_id: e.target.value })}
              >
                {products.map(p => <MenuItem key={p.id} value={p.id}>{p.name}</MenuItem>)}
              </TextField>
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="الكمية المطلوبة"
                type="number"
                fullWidth
                value={formData.order_quantity}
                onChange={(e) => setFormData({ ...formData, order_quantity: e.target.value })}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="تاريخ البدء"
                type="date"
                fullWidth
                InputLabelProps={{ shrink: true }}
                value={formData.start_date}
                onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="تكلفة التشغيل التقديرية (للوحدة)"
                type="number"
                fullWidth
                value={formData.estimated_processing_cost_per_unit}
                onChange={(e) => setFormData({ ...formData, estimated_processing_cost_per_unit: e.target.value })}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>إلغاء</Button>
          <Button variant="contained" onClick={handleSave}>حفظ</Button>
        </DialogActions>
      </Dialog>

      {/* Send Materials Dialog */}
      <Dialog open={sendMaterialsOpen} onClose={() => setSendMaterialsOpen(false)} fullWidth maxWidth="md">
        <DialogTitle>صرف الخامات للمصنع</DialogTitle>
        <DialogContent>
          {sendLoading ? <CircularProgress /> : (
            <Box sx={{ mt: 2 }}>
              <Typography variant="body2" sx={{ mb: 2 }}>
                يرجى مراجعة الكميات التي سيتم صرفها من المخزن.
              </Typography>
              {materialsToSend.map((item, index) => (
                <Grid container spacing={2} key={index} sx={{ mb: 1, alignItems: 'center' }}>
                  <Grid item xs={4}>
                    <Typography>{item.product_name}</Typography>
                  </Grid>
                  <Grid item xs={4}>
                    <TextField
                      label="الكمية"
                      type="number"
                      size="small"
                      value={item.quantity}
                      onChange={(e) => {
                        const newMaterials = [...materialsToSend];
                        newMaterials[index].quantity = e.target.value;
                        setMaterialsToSend(newMaterials);
                      }}
                    />
                  </Grid>
                  <Grid item xs={4}>
                    <TextField
                      select
                      label="المخزن"
                      size="small"
                      fullWidth
                      value={item.warehouse_id}
                      onChange={(e) => {
                        const newMaterials = [...materialsToSend];
                        newMaterials[index].warehouse_id = e.target.value;
                        setMaterialsToSend(newMaterials);
                      }}
                    >
                      {warehouses.map(w => <MenuItem key={w.id} value={w.id}>{w.name}</MenuItem>)}
                    </TextField>
                  </Grid>
                </Grid>
              ))}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSendMaterialsOpen(false)}>إلغاء</Button>
          <Button variant="contained" onClick={handleSendMaterialsSubmit} disabled={sendLoading}>تأكيد الصرف</Button>
        </DialogActions>
      </Dialog>

      {/* Receive Goods Dialog */}
      <Dialog open={receiveGoodsOpen} onClose={() => setReceiveGoodsOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>استلام المنتج التام</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            <TextField
              label="الكمية المنتجة (المستلمة)"
              type="number"
              value={receiveData.produced_quantity}
              onChange={(e) => setReceiveData({ ...receiveData, produced_quantity: e.target.value })}
            />
            <TextField
              label="كمية الفاقد (الهالك)"
              type="number"
              value={receiveData.waste_quantity}
              onChange={(e) => setReceiveData({ ...receiveData, waste_quantity: e.target.value })}
            />
            <TextField
              label="تكلفة التشغيل (الإجمالية)"
              type="number"
              helperText="المبلغ المستحق للمورد مقابل التصنيع"
              value={receiveData.service_cost}
              onChange={(e) => setReceiveData({ ...receiveData, service_cost: e.target.value })}
            />
            <TextField
              label="تكلفة النقل"
              type="number"
              value={receiveData.transport_cost}
              onChange={(e) => setReceiveData({ ...receiveData, transport_cost: e.target.value })}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setReceiveGoodsOpen(false)}>إلغاء</Button>
          <Button variant="contained" onClick={handleReceiveGoodsSubmit}>تأكيد الاستلام</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
