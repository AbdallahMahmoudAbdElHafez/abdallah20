// client/src/components/PurchaseOrderDialog.jsx
import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  MenuItem,
  CircularProgress,
  Typography,
  Divider,
  Card,
  CardContent,
  Grid,
  Chip,
  IconButton,
  Alert,
  Collapse,
  Paper,
  Stack,
} from "@mui/material";
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Save as SaveIcon,
  Close as CloseIcon,
  ShoppingCart as ShoppingCartIcon,
  Inventory as InventoryIcon,
  Business as BusinessIcon,
  CalendarToday as CalendarIcon,
  AttachMoney as MoneyIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
} from "@mui/icons-material";
import { MaterialReactTable } from "material-react-table";
import { useDispatch, useSelector } from "react-redux";
import { addPurchaseOrder, updatePurchaseOrder } from "../features/purchaseOrders/purchaseOrdersSlice";
import { fetchParties } from "../features/parties/partiesSlice";
import { fetchProducts } from "../features/products/productsSlice";
import { fetchWarehouses } from "../features/warehouses/warehousesSlice";

const statusConfig = {
  draft: { color: "default", label: "Draft" },
  approved: { color: "success", label: "Approved" },
  closed: { color: "info", label: "Closed" },
  cancelled: { color: "error", label: "Cancelled" },
};

export default function PurchaseOrderDialog({ open, onClose, order }) {
  const dispatch = useDispatch();
  const suppliers = useSelector((s) => s.parties?.items ?? []);
  const products = useSelector((s) => s.products?.items ?? []);
  const warehouses = useSelector((s) => s.warehouses?.items ?? []);

  const [loadingMeta, setLoadingMeta] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [showItemForm, setShowItemForm] = useState(false);
  const [orderHead, setOrderHead] = useState({
    supplier_id: "",
    order_date: "",
    status: "draft",
    total_amount: 0,
    order_number: "",
    notes: "",
    additional_discount: 0,
    tax_percent: 0,
  });
  const [items, setItems] = useState([]);
  const [itemForm, setItemForm] = useState({
    product_id: "",
    warehouse_id: "",
    quantity: "",
    unit_price: "",
    discount: "",
  });

  // Load master data
  useEffect(() => {
    setLoadingMeta(true);
    Promise.all([
      dispatch(fetchParties()),
      dispatch(fetchProducts()),
      dispatch(fetchWarehouses()),
    ]).finally(() => setLoadingMeta(false));
  }, [dispatch]);

  // Initialize form for editing
  useEffect(() => {
    if (order) {
      setOrderHead({
        supplier_id: order.supplier_id ?? "",
        order_date: order.order_date ?? "",
        status: order.status ?? "draft",
        total_amount: Number(order.total_amount) || 0,
        order_number: order.order_number || "",
        notes: order.notes || "",
        additional_discount: Number(order.additional_discount) || 0,
        tax_percent: Number(order.tax_percent) || 0,
      });
      setItems(
        (order.items || []).map((it) => ({
          ...it,
          tempId: Date.now() + Math.random(),
        }))
      );
    } else {
      setOrderHead({
        supplier_id: "",
        order_date: new Date().toISOString().split("T")[0],
        status: "draft",
        total_amount: 0,
        order_number: "", // backend will generate
        notes: "",
        additional_discount: 0,
        tax_percent: 0,
      });
      setItems([]);
    }
    setError("");
  }, [order]);

  // Calculate total amount with extra discount and tax
  useEffect(() => {
    const subTotal = items.reduce((sum, it) => {
      const qty = Number(it.quantity) || 0;
      const price = Number(it.unit_price) || 0;
      const disc = Number(it.discount) || 0;
      return sum + (qty * price - disc);
    }, 0);

    const addDisc = Number(orderHead.additional_discount) || 0;
    const taxPct = Number(orderHead.tax_percent) || 0;
    const taxVal = (subTotal - addDisc) * (taxPct / 100);

    const total = subTotal - addDisc + taxVal;

    setOrderHead((prev) => ({ ...prev, total_amount: total }));
  }, [items, orderHead.additional_discount, orderHead.tax_percent]);

  const handleItemProductChange = (productId) => {
    const prod = products.find((p) => p.id === productId);
    setItemForm((f) => ({
      ...f,
      product_id: productId,
      unit_price: prod ? prod.cost_price || "" : "",
    }));
  };

  const validateItemForm = () => {
    if (!itemForm.product_id) return "Please select a product";
    if (!itemForm.warehouse_id) return "Please select a warehouse";
    if (!itemForm.quantity || Number(itemForm.quantity) <= 0) return "Quantity must be greater than 0";
    if (!itemForm.unit_price || Number(itemForm.unit_price) < 0) return "Unit price must be 0 or greater";
    return null;
  };

  const addItemTemp = () => {
    const validation = validateItemForm();
    if (validation) {
      setError(validation);
      return;
    }
    setError("");
    const newItem = {
      ...itemForm,
      tempId: Date.now(),
      quantity: Number(itemForm.quantity),
      unit_price: Number(itemForm.unit_price),
      discount: itemForm.discount === "" ? 0 : Number(itemForm.discount),
    };
    setItems((prev) => [...prev, newItem]);
    setItemForm({
      product_id: "",
      warehouse_id: "",
      quantity: "",
      unit_price: "",
      discount: "",
    });
    setShowItemForm(false);
  };

  const removeItemTemp = (tempId) => {
    setItems((prev) => prev.filter((it) => it.tempId !== tempId));
  };

  const handleSaveAll = async () => {
    if (!orderHead.supplier_id) {
      setError("Please select a supplier");
      return;
    }
    if (!orderHead.order_date) {
      setError("Please select an order date");
      return;
    }
    if (items.length === 0) {
      setError("Please add at least one item");
      return;
    }

    setSaving(true);
    setError("");

    const payload = {
      ...orderHead,
      items: items.map(({ id, total_price, tempId, ...rest }) => rest),
    };

    try {
      if (order?.id) {
        await dispatch(updatePurchaseOrder({ id: order.id, data: payload })).unwrap();
      } else {
        await dispatch(addPurchaseOrder(payload)).unwrap();
      }
      onClose();
    } catch (err) {
      setError(err.message || "Failed to save purchase order");
    } finally {
      setSaving(false);
    }
  };

  const itemColumns = [
    {
      accessorKey: "product_id",
      header: "Product",
      size: 200,
      Cell: ({ cell }) => {
        const product = products.find((p) => p.id === cell.getValue());
        return (
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <InventoryIcon fontSize="small" color="action" />
            <Typography variant="body2">{product?.name || "—"}</Typography>
          </Box>
        );
      },
    },
    {
      accessorKey: "warehouse_id",
      header: "Warehouse",
      size: 150,
      Cell: ({ cell }) => {
        const warehouse = warehouses.find((w) => w.id === cell.getValue());
        return (
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <BusinessIcon fontSize="small" color="action" />
            <Typography variant="body2">{warehouse?.name || "—"}</Typography>
          </Box>
        );
      },
    },
    { accessorKey: "quantity", header: "Qty", size: 80 },
    { accessorKey: "unit_price", header: "Unit Price", size: 100 },
    { accessorKey: "discount", header: "Discount", size: 100 },
    {
      id: "total",
      header: "Total",
      size: 120,
      Cell: ({ row }) => {
        const qty = Number(row.original.quantity) || 0;
        const price = Number(row.original.unit_price) || 0;
        const discount = Number(row.original.discount) || 0;
        const total = qty * price - discount;
        return (
          <Typography variant="body2" fontWeight="bold" color="primary.main">
            ${total.toFixed(2)}
          </Typography>
        );
      },
    },
    {
      header: "Actions",
      size: 80,
      Cell: ({ row }) => (
        <IconButton
          color="error"
          size="small"
          onClick={() => removeItemTemp(row.original.tempId)}
        >
          <DeleteIcon fontSize="small" />
        </IconButton>
      ),
    },
  ];

  const selectedSupplier = suppliers.find((s) => s.id === orderHead.supplier_id);

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="lg"
      slotProps={{
        paper: {
          elevation: 3,
          sx: { minHeight: "80vh", borderRadius: 2 },
        },
      }}
    >
      <DialogTitle sx={{ display: "flex", justifyContent: "space-between", background: "linear-gradient(135deg, #1976d2 0%, #1565c0 100%)", color: "white" }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <ShoppingCartIcon />
          <Typography variant="h6">
            {order ? "Edit Purchase Order" : "Create Purchase Order"}
          </Typography>
          {order && (
            <Chip
              label={`#${order.id}`}
              size="small"
              sx={{ backgroundColor: "rgba(255,255,255,0.2)", color: "white" }}
            />
          )}
        </Box>
        <IconButton onClick={onClose} sx={{ color: "white" }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: 3 }}>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError("")}>
            {error}
          </Alert>
        )}

        {/* Order Header */}
        <Card sx={{ mb: 3, boxShadow: 2 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              <BusinessIcon color="primary" /> Order Information
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} md={3}>
                <TextField
                  fullWidth
                  label="Order Number"
                  value={orderHead.order_number}
                  disabled
                />
              </Grid>

              <Grid item xs={12} md={3}>
                <TextField
                  select
                  fullWidth
                  label="Supplier"
                  value={orderHead.supplier_id}
                  onChange={(e) =>
                    setOrderHead({ ...orderHead, supplier_id: e.target.value })
                  }
                  required
                >
                  <MenuItem value="">Select Supplier</MenuItem>
                  {suppliers
                    .filter((p) => p.party_type === "supplier")
                    .map((s) => (
                      <MenuItem key={s.id} value={s.id}>
                        {s.name}
                      </MenuItem>
                    ))}
                </TextField>
                {selectedSupplier && (
                  <Typography variant="caption" color="text.secondary">
                    Contact: {selectedSupplier.phone || selectedSupplier.email || "N/A"}
                  </Typography>
                )}
              </Grid>

              <Grid item xs={12} md={3}>
                <TextField
                  type="date"
                  fullWidth
                  label="Order Date"
                  InputLabelProps={{ shrink: true }}
                  value={orderHead.order_date}
                  onChange={(e) =>
                    setOrderHead({ ...orderHead, order_date: e.target.value })
                  }
                  required
                />
              </Grid>

              <Grid item xs={12} md={3}>
                <TextField
                  select
                  fullWidth
                  label="Status"
                  value={orderHead.status}
                  onChange={(e) =>
                    setOrderHead({ ...orderHead, status: e.target.value })
                  }
                >
                  {Object.entries(statusConfig).map(([key, config]) => (
                    <MenuItem key={key} value={key}>
                      <Chip label={config.label} color={config.color} size="small" />
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Notes"
                  multiline
                  minRows={2}
                  value={orderHead.notes}
                  onChange={(e) =>
                    setOrderHead({ ...orderHead, notes: e.target.value })
                  }
                />
              </Grid>

              <Grid item xs={6} md={3}>
                <TextField
                  type="number"
                  fullWidth
                  label="Additional Discount"
                  value={orderHead.additional_discount}
                  onChange={(e) =>
                    setOrderHead({
                      ...orderHead,
                      additional_discount: Number(e.target.value) || 0,
                    })
                  }
                  inputProps={{ min: 0, step: 0.01 }}
                />
              </Grid>

              <Grid item xs={6} md={3}>
                <TextField
                  type="number"
                  fullWidth
                  label="Tax %"
                  value={orderHead.tax_percent}
                  onChange={(e) =>
                    setOrderHead({
                      ...orderHead,
                      tax_percent: Number(e.target.value) || 0,
                    })
                  }
                  inputProps={{ min: 0, step: 0.01 }}
                />
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* Items Section */}
        <Card sx={{ mb: 2, boxShadow: 2 }}>
          <CardContent>
            <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
              <Typography variant="h6">
                <InventoryIcon color="primary" /> Order Items ({items.length})
              </Typography>
              <Button
                variant="outlined"
                startIcon={showItemForm ? <ExpandLessIcon /> : <AddIcon />}
                onClick={() => setShowItemForm(!showItemForm)}
              >
                {showItemForm ? "Hide Form" : "Add Item"}
              </Button>
            </Box>

            <Collapse in={showItemForm}>
              <Paper sx={{ p: 2, mb: 2, backgroundColor: "grey.50" }}>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6} md={3}>
                    <TextField
                      select
                      fullWidth
                      label="Product"
                      value={itemForm.product_id}
                      onChange={(e) => handleItemProductChange(e.target.value)}
                      size="small"
                    >
                      <MenuItem value="">Select Product</MenuItem>
                      {products.map((p) => (
                        <MenuItem key={p.id} value={p.id}>
                          {p.name}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>

                  <Grid item xs={12} sm={6} md={2}>
                    <TextField
                      select
                      fullWidth
                      label="Warehouse"
                      value={itemForm.warehouse_id}
                      onChange={(e) =>
                        setItemForm((f) => ({ ...f, warehouse_id: e.target.value }))
                      }
                      size="small"
                    >
                      <MenuItem value="">Select Warehouse</MenuItem>
                      {warehouses.map((w) => (
                        <MenuItem key={w.id} value={w.id}>
                          {w.name}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>

                  <Grid item xs={6} sm={3} md={1.5}>
                    <TextField
                      type="number"
                      fullWidth
                      label="Quantity"
                      value={itemForm.quantity}
                      onChange={(e) =>
                        setItemForm((f) => ({ ...f, quantity: e.target.value }))
                      }
                      size="small"
                      inputProps={{ min: 0, step: 1 }}
                    />
                  </Grid>

                  <Grid item xs={6} sm={3} md={1.5}>
                    <TextField
                      type="number"
                      fullWidth
                      label="Unit Price"
                      value={itemForm.unit_price}
                      onChange={(e) =>
                        setItemForm((f) => ({ ...f, unit_price: e.target.value }))
                      }
                      size="small"
                      inputProps={{ min: 0, step: 0.01 }}
                    />
                  </Grid>

                  <Grid item xs={6} sm={3} md={1.5}>
                    <TextField
                      type="number"
                      fullWidth
                      label="Discount"
                      value={itemForm.discount}
                      onChange={(e) =>
                        setItemForm((f) => ({ ...f, discount: e.target.value }))
                      }
                      size="small"
                      inputProps={{ min: 0, step: 0.01 }}
                    />
                  </Grid>

                  <Grid item xs={6} sm={3} md={1.5}>
                    <Button
                      variant="contained"
                      fullWidth
                      onClick={addItemTemp}
                      startIcon={<AddIcon />}
                    >
                      Add
                    </Button>
                  </Grid>
               
              </Grid>
            </Paper>
          </Collapse>

          {/* Items Table */}
          <Box sx={{ minHeight: 300 }}>
            {loadingMeta ? (
              <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
                <CircularProgress />
              </Box>
            ) : (
              <MaterialReactTable
                columns={itemColumns}
                data={items}
                enableStickyHeader
                enablePagination={false}
                enableBottomToolbar={false}
                enableTopToolbar={false}
                muiTableContainerProps={{
                  sx: {
                    maxHeight: 400,
                    overflowY: "auto",
                    border: "1px solid",
                    borderColor: "divider",
                    borderRadius: 1,
                  },
                }}
                muiTableHeadCellProps={{
                  sx: {
                    backgroundColor: "primary.main",
                    color: "black",
                    fontWeight: "bold",
                  },
                }}
                muiTableBodyRowProps={{
                  sx: {
                    "&:hover": {
                      backgroundColor: "action.hover",
                    },
                  },
                }}
              />
            )}
          </Box>
        </CardContent>
      </Card>

      {/* Order Summary */}
      <Card sx={{ boxShadow: 2, background: "linear-gradient(135deg, #f5f5f5 0%, #e8e8e8 100%)" }}>
        <CardContent>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography variant="h6" sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <MoneyIcon color="primary" />
              Order Summary
            </Typography>
            <Box textAlign="right">
              <Typography variant="body2" color="text.secondary">
                Subtotal (items)
              </Typography>
              <Typography variant="body1" fontWeight="medium">
                $
                {items
                  .reduce((sum, it) => sum + (Number(it.quantity) * Number(it.unit_price) - Number(it.discount || 0)), 0)
                  .toFixed(2)}
              </Typography>

              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Additional Discount
              </Typography>
              <Typography variant="body1" fontWeight="medium">
                ${Number(orderHead.additional_discount || 0).toFixed(2)}
              </Typography>

              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Tax ({Number(orderHead.tax_percent || 0).toFixed(2)}%)
              </Typography>
              <Typography variant="body1" fontWeight="medium">
                $
                {(
                  (items.reduce((s, it) => s + (Number(it.quantity) * Number(it.unit_price) - Number(it.discount || 0)), 0) -
                    Number(orderHead.additional_discount || 0)) *
                  (Number(orderHead.tax_percent || 0) / 100)
                ).toFixed(2)}
              </Typography>

              <Divider sx={{ my: 1 }} />

              <Typography variant="caption" color="text.secondary">
                Total Amount
              </Typography>
              <Typography variant="h4" color="primary.main" fontWeight="bold">
                ${Number(orderHead.total_amount || 0).toFixed(2)}
              </Typography>
            </Box>
          </Stack>
        </CardContent>
      </Card>
    </DialogContent>

    <DialogActions sx={{ p: 3, gap: 1, backgroundColor: "grey.50" }}>
      <Button onClick={onClose} variant="outlined" sx={{ borderRadius: 2 }}>
        Cancel
      </Button>
      <Button
        variant="contained"
        onClick={handleSaveAll}
        disabled={saving || loadingMeta}
        startIcon={saving ? <CircularProgress size={20} /> : <SaveIcon />}
        sx={{ borderRadius: 2, minWidth: 120 }}
      >
        {saving ? "Saving..." : "Save Order"}
      </Button>
    </DialogActions>
  </Dialog>
);
}
