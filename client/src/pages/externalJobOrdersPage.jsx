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
} from "@mui/material";
import { MaterialReactTable } from "material-react-table";
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon, Visibility as ViewIcon, AttachMoney as PaymentIcon } from "@mui/icons-material";
import axiosClient from "../api/axiosClient";
import ExternalJobOrderDialog from "../components/ExternalJobOrderDialog";
import { defaultTableProps } from "../config/tableConfig";

export default function ExternalJobOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Dialog State
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [formData, setFormData] = useState({
    party_id: "",
    product_id: "",
    warehouse_id: "",
    order_quantity: "",
    start_date: new Date().toISOString().split("T")[0],
    end_date: "",
    estimated_processing_cost_per_unit: 0,
  });

  // Dropdowns
  const [suppliers, setSuppliers] = useState([]);
  const [products, setProducts] = useState([]);
  const [warehouses, setWarehouses] = useState([]);
  const [accounts, setAccounts] = useState([]);

  // Send Materials
  const [sendMaterialsOpen, setSendMaterialsOpen] = useState(false);
  const [materialsToSend, setMaterialsToSend] = useState([]);
  const [sendLoading, setSendLoading] = useState(false);

  // Receive Goods
  const [receiveGoodsOpen, setReceiveGoodsOpen] = useState(false);
  const [receiveData, setReceiveData] = useState({
    produced_quantity: "",
    waste_quantity: 0,
    service_cost: 0,
    transport_cost: 0
  });

  // Payment
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);
  const [jobOrderPayments, setJobOrderPayments] = useState([]);
  const [paymentData, setPaymentData] = useState({
    party_id: "",
    amount: "",
    payment_date: new Date().toISOString().split("T")[0],
    payment_method: "cash",
    account_id: "",
    reference_number: "",
    note: "",
    external_job_order_id: null,
    cheque_number: "",
    issue_date: "",
    due_date: ""
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
      const [partiesRes, productsRes, warehousesRes, accountsRes] = await Promise.all([
        axiosClient.get("/parties"),
        axiosClient.get("/products"),
        axiosClient.get("/warehouses"),
        axiosClient.get("/accounts")
      ]);
      setSuppliers(partiesRes.data.filter(p => p.party_type === 'supplier'));
      setProducts(productsRes.data);
      setWarehouses(warehousesRes.data);
      setAccounts(accountsRes.data);
    } catch (err) {
      console.error(err);
    }
  };

  // --- Handlers ---

  const handleCreate = () => {
    setSelectedOrder(null);
    setFormData({
      party_id: "",
      product_id: "",
      warehouse_id: "",
      order_quantity: "",
      start_date: new Date().toISOString().split("T")[0],
      end_date: "",
      estimated_processing_cost_per_unit: 0,
    });
    setDialogOpen(true);
  };

  const handleEdit = (row) => {
    setSelectedOrder(row);
    setFormData({
      ...row,
      start_date: row.start_date ? row.start_date.split('T')[0] : "",
      end_date: row.end_date ? row.end_date.split('T')[0] : ""
    });
    setDialogOpen(true);
  };

  const handleSaveOrder = async (data) => {
    try {
      if (selectedOrder) {
        await axiosClient.put(`/external-job-orders/${selectedOrder.id}`, data);
      } else {
        await axiosClient.post("/external-job-orders", data);
      }
      setDialogOpen(false);
      fetchOrders();
    } catch (err) {
      alert("Error saving order: " + (err.response?.data?.message || err.message));
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure?")) {
      await axiosClient.delete(`/external-job-orders/${id}`);
      fetchOrders();
    }
  };

  // --- Send Materials ---
  const handleOpenSendMaterials = async (order) => {
    setSelectedOrder(order);
    setSendLoading(true);
    setSendMaterialsOpen(true);
    try {
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
          warehouse_id: order.warehouse_id,
          quantity: item.required_quantity,
          available_quantity: item.available_quantity
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

  // --- Receive Goods ---
  const handleOpenReceiveGoods = (order) => {
    setSelectedOrder(order);
    setReceiveData({
      produced_quantity: order.order_quantity,
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

  // --- Payment ---
  const handleOpenPayment = async (order) => {
    setSelectedOrder(order);
    setPaymentData({
      party_id: order.party_id,
      amount: "",
      payment_date: new Date().toISOString().split("T")[0],
      payment_method: "cash",
      account_id: "",
      reference_number: "",
      note: `دفعة مقابل أمر تشغيل #${order.id}`,
      external_job_order_id: order.id,
      cheque_number: "",
      issue_date: "",
      due_date: ""
    });

    try {
      const res = await axiosClient.get("/service-payments", {
        params: { external_job_order_id: order.id }
      });
      setJobOrderPayments(res.data);
    } catch (err) {
      console.error("Error fetching payments", err);
      setJobOrderPayments([]);
    }
    setPaymentDialogOpen(true);
  };

  const handlePaymentSubmit = async () => {
    try {
      await axiosClient.post("/service-payments", paymentData);
      setPaymentDialogOpen(false);
      alert("تم تسجيل الدفعة بنجاح");
    } catch (err) {
      alert("Error saving payment: " + (err.response?.data?.message || err.message));
    }
  };

  const columns = [
    { accessorKey: "id", header: "ID", size: 60 },
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
          <IconButton onClick={() => handleEdit(row.original)} color="primary">
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
          <Button
            variant="contained"
            size="small"
            color="info"
            startIcon={<PaymentIcon />}
            onClick={() => handleOpenPayment(row.original)}
          >
            سداد
          </Button>
        </Box>
      )
    }
  ];

  return (
    <Box p={2}>
      <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
        <Button variant="contained" startIcon={<AddIcon />} onClick={handleCreate}>
          أمر تشغيل جديد
        </Button>
      </Box>

      <MaterialReactTable {...defaultTableProps} columns={columns} data={orders} state={{ isLoading: loading }} />

      <ExternalJobOrderDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onSave={handleSaveOrder}
        initialData={formData}
        suppliers={suppliers}
        products={products}
        warehouses={warehouses}
      />

      {/* Send Materials Dialog */}
      <Dialog open={sendMaterialsOpen} onClose={() => setSendMaterialsOpen(false)} fullWidth maxWidth="md">
        <DialogTitle>صرف الخامات للمصنع (أمر #{selectedOrder?.id})</DialogTitle>
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
                      error={parseFloat(item.quantity) > parseFloat(item.available_quantity)}
                      helperText={`المتاح: ${item.available_quantity}`}
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
        <DialogTitle>استلام المنتج التام (أمر #{selectedOrder?.id})</DialogTitle>
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
              onChange={(e) => {
                const waste = parseFloat(e.target.value) || 0;
                const orderQty = parseFloat(selectedOrder.order_quantity) || 0;
                setReceiveData({
                  ...receiveData,
                  waste_quantity: e.target.value,
                  produced_quantity: (orderQty - waste) > 0 ? (orderQty - waste) : 0
                });
              }}
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

      {/* Payment Dialog */}
      <Dialog open={paymentDialogOpen} onClose={() => setPaymentDialogOpen(false)} fullWidth maxWidth="md">
        <DialogTitle>تسجيل دفعة (أمر #{selectedOrder?.id})</DialogTitle>
        <DialogContent>
          {jobOrderPayments.length > 0 && (
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle2" gutterBottom>الدفعات السابقة:</Typography>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.9rem" }}>
                <thead>
                  <tr style={{ borderBottom: "1px solid #ddd", background: "#f5f5f5" }}>
                    <th style={{ padding: "8px", textAlign: "right" }}>التاريخ</th>
                    <th style={{ padding: "8px", textAlign: "right" }}>المبلغ</th>
                    <th style={{ padding: "8px", textAlign: "right" }}>طريقة الدفع</th>
                    <th style={{ padding: "8px", textAlign: "right" }}>ملاحظات</th>
                  </tr>
                </thead>
                <tbody>
                  {jobOrderPayments.map((p) => (
                    <tr key={p.id} style={{ borderBottom: "1px solid #eee" }}>
                      <td style={{ padding: "8px" }}>{p.payment_date}</td>
                      <td style={{ padding: "8px" }}>{parseFloat(p.amount).toLocaleString()}</td>
                      <td style={{ padding: "8px" }}>{p.payment_method}</td>
                      <td style={{ padding: "8px" }}>{p.note}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Box>
          )}

          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={6}>
              <TextField
                label="المبلغ"
                type="number"
                fullWidth
                value={paymentData.amount}
                onChange={(e) => setPaymentData({ ...paymentData, amount: e.target.value })}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="التاريخ"
                type="date"
                fullWidth
                value={paymentData.payment_date}
                onChange={(e) => setPaymentData({ ...paymentData, payment_date: e.target.value })}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                select
                label="الخزينة / البنك"
                fullWidth
                value={paymentData.account_id}
                onChange={(e) => setPaymentData({ ...paymentData, account_id: e.target.value })}
              >
                {accounts.map(a => <MenuItem key={a.id} value={a.id}>{a.name}</MenuItem>)}
              </TextField>
            </Grid>
            <Grid item xs={6}>
              <TextField
                select
                label="طريقة الدفع"
                fullWidth
                value={paymentData.payment_method}
                onChange={(e) => setPaymentData({ ...paymentData, payment_method: e.target.value })}
              >
                <MenuItem value="cash">نقدي</MenuItem>
                <MenuItem value="bank">تحويل بنكي</MenuItem>
                <MenuItem value="cheque">شيك</MenuItem>
                <MenuItem value="other">أخرى</MenuItem>
              </TextField>
            </Grid>

            {/* Cheque Fields */}
            {paymentData.payment_method === 'cheque' && (
              <>
                <Grid item xs={12}>
                  <Box sx={{ p: 1, bgcolor: '#f5f5f5', borderRadius: 1, mb: 1 }}>
                    <strong>بيانات الشيك</strong>
                  </Box>
                </Grid>
                <Grid item xs={4}>
                  <TextField
                    label="رقم الشيك"
                    fullWidth
                    required
                    value={paymentData.cheque_number || ''}
                    onChange={(e) => setPaymentData({ ...paymentData, cheque_number: e.target.value })}
                  />
                </Grid>
                <Grid item xs={4}>
                  <TextField
                    label="تاريخ الإصدار"
                    type="date"
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                    value={paymentData.issue_date || paymentData.payment_date}
                    onChange={(e) => setPaymentData({ ...paymentData, issue_date: e.target.value })}
                  />
                </Grid>
                <Grid item xs={4}>
                  <TextField
                    label="تاريخ الاستحقاق"
                    type="date"
                    fullWidth
                    required
                    InputLabelProps={{ shrink: true }}
                    value={paymentData.due_date || ''}
                    onChange={(e) => setPaymentData({ ...paymentData, due_date: e.target.value })}
                  />
                </Grid>
              </>
            )}

            <Grid item xs={12}>
              <TextField
                label="ملاحظات"
                fullWidth
                multiline
                rows={2}
                value={paymentData.note}
                onChange={(e) => setPaymentData({ ...paymentData, note: e.target.value })}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPaymentDialogOpen(false)}>إلغاء</Button>
          <Button variant="contained" onClick={handlePaymentSubmit}>حفظ الدفعة</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
