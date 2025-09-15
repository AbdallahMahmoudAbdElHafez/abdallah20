import React, { useState, useEffect } from "react";
import {
  Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, MenuItem,
  CircularProgress, Typography, Divider, Card, CardContent, Grid, Chip,
  IconButton, Alert, Collapse, Paper, Stack
} from "@mui/material";
import {
  Add as AddIcon, Delete as DeleteIcon, Save as SaveIcon, Close as CloseIcon,
  ShoppingCart as ShoppingCartIcon, Inventory as InventoryIcon, Money as MoneyIcon, ExpandLess as ExpandLessIcon
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
    vat_rate: 0,
  });
  const [items, setItems] = useState([]);
  const [itemForm, setItemForm] = useState({
    product_id: "",
    warehouse_id: "",
    batch_number: "",
    expiry_date: "",
    quantity: "",
    bonus_quantity: "",
    unit_price: "",
    discount: 0,
  });

  useEffect(() => {
    setLoadingMeta(true);
    Promise.all([
      dispatch(fetchParties()),
      dispatch(fetchProducts()),
      dispatch(fetchWarehouses()),
    ]).finally(() => setLoadingMeta(false));
  }, [dispatch]);

  useEffect(() => {
    if (order) {
      setOrderHead({
        supplier_id: order.supplier_id || "",
        order_date: order.order_date || "",
        status: order.status || "draft",
        total_amount: Number(order.total_amount) || 0,
        order_number: order.order_number || "",
        notes: order.notes || "",
        additional_discount: Number(order.additional_discount) || 0,
        tax_percent: Number(order.tax_rate) || 0,
        vat_rate: Number(order.vat_rate) || 0,
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
        order_number: "",
        notes: "",
        additional_discount: 0,
        tax_percent: 0,
        vat_rate: 0,
      });
      setItems([]);
    }
    setError("");
  }, [order]);

  const handleItemProductChange = (productId) => {
    const prod = products.find((p) => p.id === productId);
    setItemForm((f) => ({
      ...f,
      product_id: productId,
      unit_price: prod ? Number(prod.cost_price || 0) : 0,
    }));
  };

  const validateItemForm = () => {
    if (!itemForm.product_id) return "Please select a product";
    if (!itemForm.warehouse_id) return "Please select a warehouse";
    if (!itemForm.quantity || Number(itemForm.quantity) <= 0)
      return "Quantity must be greater than 0";
    if (
      itemForm.unit_price === "" ||
      Number(itemForm.unit_price) < 0
    )
      return "Unit price must be 0 or greater";
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
      bonus_quantity: Number(itemForm.bonus_quantity || 0),
      unit_price: Number(itemForm.unit_price),
      discount: Number(itemForm.discount || 0),
    };
    setItems((prev) => [...prev, newItem]);
    setItemForm({
      product_id: "",
      warehouse_id: "",
      batch_number: "",
      expiry_date: "",
      quantity: "",
      bonus_quantity: "",
      unit_price: "",
      discount: 0,
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

    const subTotal = items.reduce(
      (s, it) =>
        s + (Number(it.quantity) * Number(it.unit_price) - Number(it.discount)),
      0
    );
    const taxAmount =
      (subTotal - Number(orderHead.additional_discount)) *
      (Number(orderHead.tax_percent) / 100);
    const vatAmount =
      (subTotal - Number(orderHead.additional_discount)) *
      (Number(orderHead.vat_rate) / 100);
    const totalAmount =
      subTotal -
      Number(orderHead.additional_discount) +
      taxAmount +
      vatAmount;

    const payload = {
      ...orderHead,
      total_amount: totalAmount,
      items: items.map(({ tempId, ...rest }) => rest),
    };

    try {
      if (order?.id) {
        await dispatch(
          updatePurchaseOrder({ id: order.id, data: payload })
        ).unwrap();
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
      size: 180,
      Cell: ({ cell }) => {
        const product = products.find((p) => p.id === cell.getValue());
        return <Typography variant="body2">{product?.name || "—"}</Typography>;
      },
    },
    {
      accessorKey: "warehouse_id",
      header: "Warehouse",
      size: 140,
      Cell: ({ cell }) => {
        const warehouse = warehouses.find((w) => w.id === cell.getValue());
        return (
          <Typography variant="body2">{warehouse?.name || "—"}</Typography>
        );
      },
    },
    { accessorKey: "batch_number", header: "Batch No.", size: 120 },
    { accessorKey: "expiry_date", header: "Expiry Date", size: 120 },
    { accessorKey: "quantity", header: "Qty", size: 80 },
    { accessorKey: "bonus_quantity", header: "Bonus Qty", size: 90 },
    { accessorKey: "unit_price", header: "Unit Price", size: 100 },
    { accessorKey: "discount", header: "Discount", size: 100 },
    {
      id: "total",
      header: "Total",
      size: 120,
      Cell: ({ row }) => {
        const it = row.original;
        const total =
          Number(it.quantity) * Number(it.unit_price) -
          Number(it.discount);
        return <Typography>${total.toFixed(2)}</Typography>;
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
          <DeleteIcon />
        </IconButton>
      ),
    },
  ];

  const selectedSupplier = suppliers.find(
    (s) => s.id === orderHead.supplier_id
  );

  const subTotal = items.reduce(
    (s, it) =>
      s + (Number(it.quantity) * Number(it.unit_price) - Number(it.discount)),
    0
  );
  const taxAmount =
    (subTotal - Number(orderHead.additional_discount)) *
    (Number(orderHead.tax_percent) / 100);
  const vatAmount =
    (subTotal - Number(orderHead.additional_discount)) *
    (Number(orderHead.vat_rate) / 100);
  const totalAmount =
    subTotal -
    Number(orderHead.additional_discount) +
    taxAmount +
    vatAmount;

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="lg">
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <ShoppingCartIcon />{" "}
          {order ? "Edit Purchase Order" : "Create Purchase Order"}
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        {/* === Order Header === */}
        <Card sx={{ mb: 3 }}>
          <CardContent>
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
                  <Typography variant="caption">
                    Contact:{" "}
                    {selectedSupplier.phone ||
                      selectedSupplier.email ||
                      "N/A"}
                  </Typography>
                )}
              </Grid>
              <Grid item xs={12} md={3}>
                <TextField
                  type="date"
                  fullWidth
                  label="Order Date"
                  value={orderHead.order_date}
                  onChange={(e) =>
                    setOrderHead({ ...orderHead, order_date: e.target.value })
                  }
                  InputLabelProps={{ shrink: true }}
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
                  {Object.entries(statusConfig).map(([k, v]) => (
                    <MenuItem key={k} value={k}>
                      <Chip label={v.label} color={v.color} size="small" />
                    </MenuItem>
                  ))}
                </TextField>
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
              <Grid item xs={6} md={3}>
                <TextField
                  type="number"
                  fullWidth
                  label="VAT %"
                  value={orderHead.vat_rate}
                  onChange={(e) =>
                    setOrderHead({
                      ...orderHead,
                      vat_rate: Number(e.target.value) || 0,
                    })
                  }
                  inputProps={{ min: 0, step: 0.01 }}
                />
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
            </Grid>
          </CardContent>
        </Card>

        {/* === Items === */}
        <Card sx={{ mb: 2 }}>
          <CardContent>
            <Box display="flex" justifyContent="space-between" mb={2}>
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
                        setItemForm({
                          ...itemForm,
                          warehouse_id: e.target.value,
                        })
                      }
                    >
                      <MenuItem value="">Select Warehouse</MenuItem>
                      {warehouses.map((w) => (
                        <MenuItem key={w.id} value={w.id}>
                          {w.name}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>
                  <Grid item xs={12} sm={6} md={2}>
                    <TextField
                      fullWidth
                      label="Batch Number"
                      value={itemForm.batch_number}
                      onChange={(e) =>
                        setItemForm({ ...itemForm, batch_number: e.target.value })
                      }
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={2}>
                    <TextField
                      type="date"
                      fullWidth
                      label="Expiry Date"
                      value={itemForm.expiry_date}
                      onChange={(e) =>
                        setItemForm({ ...itemForm, expiry_date: e.target.value })
                      }
                      InputLabelProps={{ shrink: true }}
                    />
                  </Grid>
                  <Grid item xs={6} sm={3} md={1.5}>
                    <TextField
                      type="number"
                      fullWidth
                      label="Quantity"
                      value={itemForm.quantity}
                      onChange={(e) =>
                        setItemForm({ ...itemForm, quantity: e.target.value })
                      }
                      inputProps={{ min: 0, step: 1 }}
                    />
                  </Grid>
                  <Grid item xs={6} sm={3} md={1.5}>
                    <TextField
                      type="number"
                      fullWidth
                      label="Bonus Qty"
                      value={itemForm.bonus_quantity}
                      onChange={(e) =>
                        setItemForm({
                          ...itemForm,
                          bonus_quantity: e.target.value,
                        })
                      }
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
                        setItemForm({
                          ...itemForm,
                          unit_price: e.target.value,
                        })
                      }
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
                        setItemForm({ ...itemForm, discount: e.target.value })
                      }
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

            <Box minHeight={300}>
              {loadingMeta ? (
                <Box display="flex" justifyContent="center" p={4}>
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
                />
              )}
            </Box>
          </CardContent>
        </Card>

        {/* === Summary === */}
        <Card
          sx={{
            background: "linear-gradient(135deg,#f5f5f5 0%,#e8e8e8 100%)",
          }}
        >
          <CardContent>
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Typography variant="h6">
                <MoneyIcon color="primary" /> Order Summary
              </Typography>
              <Box textAlign="right">
                <Typography>Subtotal (items): ${subTotal.toFixed(2)}</Typography>
                <Typography>
                  Additional Discount: $
                  {Number(orderHead.additional_discount).toFixed(2)}
                </Typography>
                <Typography>
                  Tax ({Number(orderHead.tax_percent)}%): ${taxAmount.toFixed(2)}
                </Typography>
                <Typography>
                  VAT ({Number(orderHead.vat_rate)}%): ${vatAmount.toFixed(2)}
                </Typography>
                <Divider sx={{ my: 1 }} />
                <Typography variant="h4" color="primary.main">
                  Total: ${totalAmount.toFixed(2)}
                </Typography>
              </Box>
            </Stack>
          </CardContent>
        </Card>
      </DialogContent>

      <DialogActions sx={{ p: 3, gap: 1 }}>
        <Button onClick={onClose} variant="outlined">
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleSaveAll}
          disabled={saving || loadingMeta}
          startIcon={saving ? <CircularProgress size={20} /> : <SaveIcon />}
        >
          {saving ? "Saving..." : "Save Order"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

