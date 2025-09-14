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
  Receipt as ReceiptIcon,
  Inventory as InventoryIcon,
  Business as BusinessIcon,
  CalendarToday as CalendarIcon,
  AttachMoney as MoneyIcon,
  ExpandLess as ExpandLessIcon,
} from "@mui/icons-material";
import { MaterialReactTable } from "material-react-table";
import { useDispatch, useSelector } from "react-redux";
import {
  addPurchaseInvoice,
  updatePurchaseInvoice,
} from "../features/purchaseInvoices/purchaseInvoicesSlice";
import { fetchParties } from "../features/parties/partiesSlice";
import { fetchProducts } from "../features/products/productsSlice";
import { fetchWarehouses } from "../features/warehouses/warehousesSlice";

const statusConfig = {
  unpaid: { color: "default", label: "Unpaid" },
  paid: { color: "success", label: "Paid" },
  partially_paid: { color: "warning", label: "Partially Paid" },
  cancelled: { color: "error", label: "Cancelled" },
};

export default function PurchaseInvoiceDialog({
  open,
  onClose,
  invoice,
  itemsInit = [],
  onSave, // optional: if provided, dialog will call this instead of dispatching itself
}) {
  const dispatch = useDispatch();
  const suppliers = useSelector((s) => s.parties?.items ?? []);
  const products = useSelector((s) => s.products?.items ?? []);
  const warehouses = useSelector((s) => s.warehouses?.items ?? []);

  const [loadingMeta, setLoadingMeta] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [showItemForm, setShowItemForm] = useState(false);

  const [invoiceHead, setInvoiceHead] = useState({
    supplier_id: "",
    invoice_date: "",
    due_date: "",
    status: "unpaid",
    subtotal: 0,
    additional_discount: 0,
    vat_rate: 0,
    vat_amount: 0,
    tax_rate: 0,
    tax_amount: 0,
    total_amount: 0,
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
    Promise.all([dispatch(fetchParties()), dispatch(fetchProducts()), dispatch(fetchWarehouses())])
      .finally(() => setLoadingMeta(false));
  }, [dispatch]);

  // Init on open / invoice change
  useEffect(() => {
    if (invoice) {
      setInvoiceHead({
        supplier_id: invoice.supplier_id ?? "",
        invoice_date: invoice.invoice_date ?? new Date().toISOString().split("T")[0],
        due_date: invoice.due_date ?? "",
        status: invoice.status ?? "unpaid",
        subtotal: Number(invoice.subtotal) || 0,
        additional_discount: Number(invoice.additional_discount) || 0,
        vat_rate: Number(invoice.vat_rate) || 0,
        vat_amount: Number(invoice.vat_amount) || 0,
        tax_rate: Number(invoice.tax_rate) || 0,
        tax_amount: Number(invoice.tax_amount) || 0,
        total_amount: Number(invoice.total_amount) || 0,
      });
      setItems((itemsInit || []).map((it) => ({ ...it, tempId: Date.now() + Math.random() })));
    } else {
      setInvoiceHead({
        supplier_id: "",
        invoice_date: new Date().toISOString().split("T")[0],
        due_date: "",
        status: "unpaid",
        subtotal: 0,
        additional_discount: 0,
        vat_rate: 0,
        vat_amount: 0,
        tax_rate: 0,
        tax_amount: 0,
        total_amount: 0,
      });
      setItems([]);
    }
    setError("");
  }, [invoice, itemsInit]);

  // Recalculate totals
  useEffect(() => {
    const subtotal = items.reduce((sum, it) => {
      const qty = Number(it.quantity) || 0;
      const price = Number(it.unit_price) || 0;
      const disc = Number(it.discount) || 0;
      return sum + (qty * price - disc);
    }, 0);

    const vatAmount = subtotal * ((Number(invoiceHead.vat_rate) || 0) / 100);
    const taxAmount = subtotal * ((Number(invoiceHead.tax_rate) || 0) / 100);
    const total = subtotal + vatAmount + taxAmount - (Number(invoiceHead.additional_discount) || 0);

    setInvoiceHead((prev) => ({
      ...prev,
      subtotal,
      vat_amount: vatAmount,
      tax_amount: taxAmount,
      total_amount: total,
    }));
  }, [items, invoiceHead.vat_rate, invoiceHead.tax_rate, invoiceHead.additional_discount]);

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
    if (itemForm.unit_price === "" || Number(itemForm.unit_price) < 0) return "Unit price must be 0 or greater";
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
      tempId: Date.now() + Math.random(),
      quantity: Number(itemForm.quantity),
      unit_price: Number(itemForm.unit_price),
      discount: itemForm.discount === "" ? 0 : Number(itemForm.discount),
    };
    setItems((prev) => [...prev, newItem]);
    setItemForm({ product_id: "", warehouse_id: "", quantity: "", unit_price: "", discount: "" });
    setShowItemForm(false);
  };

  const removeItemTemp = (tempId) => {
    setItems((prev) => prev.filter((it) => it.tempId !== tempId));
  };

  const handleSaveAll = async () => {
    if (!invoiceHead.supplier_id) {
      setError("Please select a supplier");
      return;
    }
    if (!invoiceHead.invoice_date) {
      setError("Please select an invoice date");
      return;
    }
    if (items.length === 0) {
      setError("Please add at least one item");
      return;
    }

    setSaving(true);
    setError("");

    // Prepare payload
    const payload = {
      ...invoiceHead,
      items: items.map(({ tempId, id, ...rest }) => rest),
    };

    try {
      if (typeof onSave === "function") {
        // call parent-supplied handler (page might dispatch)
        await onSave(payload);
        onClose();
      } else {
        // fallback: dialog dispatches itself
        if (invoice && invoice.id) {
          await dispatch(updatePurchaseInvoice({ id: invoice.id, data: payload })).unwrap();
        } else {
          await dispatch(addPurchaseInvoice(payload)).unwrap();
        }
        onClose();
      }
    } catch (err) {
      setError(err?.message || "Failed to save invoice");
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
    {
      accessorKey: "quantity",
      header: "Qty",
      size: 80,
      Cell: ({ cell }) => (
        <Typography variant="body2" fontWeight="medium">
          {Number(cell.getValue()).toLocaleString()}
        </Typography>
      ),
    },
    {
      accessorKey: "unit_price",
      header: "Unit Price",
      size: 100,
      Cell: ({ cell }) => (
        <Typography variant="body2" color="success.main" fontWeight="medium">
          ${Number(cell.getValue()).toFixed(2)}
        </Typography>
      ),
    },
    {
      accessorKey: "discount",
      header: "Discount",
      size: 100,
      Cell: ({ cell }) => (
        <Typography variant="body2" color="error.main">
          ${Number(cell.getValue()).toFixed(2)}
        </Typography>
      ),
    },
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
        <IconButton color="error" size="small" onClick={() => removeItemTemp(row.original.tempId)}>
          <DeleteIcon fontSize="small" />
        </IconButton>
      ),
    },
  ];

  const selectedSupplier = suppliers.find((s) => s.id === invoiceHead.supplier_id);

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="lg" slotProps={{
      paper: {
        elevation: 3,
        sx: {
          minHeight: "80vh",
          borderRadius: 2,
        },
      },
    }}>
      <DialogTitle sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        pb: 1,
        background: "linear-gradient(135deg, #1976d2 0%, #1565c0 100%)",
        color: "white",
      }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <ReceiptIcon />
          <Typography variant="h6">
            {invoice ? "Edit Purchase Invoice" : "Create Purchase Invoice"}
          </Typography>
          {invoice && (
            <Chip label={`#${invoice.id}`} size="small" sx={{ backgroundColor: "rgba(255,255,255,0.2)", color: "white" }} />
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

        {/* Invoice Header */}
        <Card sx={{ mb: 3, boxShadow: 2 }}>
          <CardContent>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <TextField
                  select
                  fullWidth
                  label="Supplier"
                  value={invoiceHead.supplier_id}
                  onChange={(e) => setInvoiceHead({ ...invoiceHead, supplier_id: e.target.value })}
                  required
                >
                  <MenuItem value="">Select Supplier</MenuItem>
                  {suppliers.filter((p) => p.party_type === "supplier").map((s) => (
                    <MenuItem key={s.id} value={s.id}>
                      {s.name}
                    </MenuItem>
                  ))}
                </TextField>
                {selectedSupplier && (
                  <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: "block" }}>
                    Contact: {selectedSupplier.phone || selectedSupplier.email || "N/A"}
                  </Typography>
                )}
              </Grid>

              <Grid item xs={12} md={3}>
                <TextField
                  type="date"
                  fullWidth
                  label="Invoice Date"
                  InputLabelProps={{ shrink: true }}
                  value={invoiceHead.invoice_date}
                  onChange={(e) => setInvoiceHead({ ...invoiceHead, invoice_date: e.target.value })}
                />
              </Grid>

              <Grid item xs={12} md={3}>
                <TextField
                  select
                  fullWidth
                  label="Status"
                  value={invoiceHead.status}
                  onChange={(e) => setInvoiceHead({ ...invoiceHead, status: e.target.value })}
                >
                  {Object.entries(statusConfig).map(([key, cfg]) => (
                    <MenuItem key={key} value={key}>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <Chip label={cfg.label} color={cfg.color} size="small" />
                      </Box>
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* Items Section */}
        <Card sx={{ mb: 2, boxShadow: 2 }}>
          <CardContent>
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 2 }}>
              <Typography variant="h6" sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <InventoryIcon color="primary" />
                Invoice Items ({items.length})
              </Typography>
              <Button
                variant="outlined"
                startIcon={showItemForm ? <ExpandLessIcon /> : <AddIcon />}
                onClick={() => setShowItemForm(!showItemForm)}
                sx={{ borderRadius: 2 }}
              >
                {showItemForm ? "Hide Form" : "Add Item"}
              </Button>
            </Box>

            <Collapse in={showItemForm}>
              <Paper sx={{ p: 2, mb: 2, backgroundColor: "grey.50" }}>
                <Typography variant="subtitle2" gutterBottom color="primary">
                  Add New Item
                </Typography>
                <Grid container spacing={2} alignItems="end">
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
                      onChange={(e) => setItemForm((f) => ({ ...f, warehouse_id: e.target.value }))}
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
                      onChange={(e) => setItemForm((f) => ({ ...f, quantity: e.target.value }))}
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
                      onChange={(e) => setItemForm((f) => ({ ...f, unit_price: e.target.value }))}
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
                      onChange={(e) => setItemForm((f) => ({ ...f, discount: e.target.value }))}
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
                      sx={{ borderRadius: 2 }}
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
                />
              )}
            </Box>
          </CardContent>
        </Card>

        {/* Invoice Summary */}
        <Card sx={{ boxShadow: 2, background: "linear-gradient(135deg, #f5f5f5 0%, #e8e8e8 100%)" }}>
          <CardContent>
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Typography variant="h6" sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <MoneyIcon color="primary" />
                Invoice Summary
              </Typography>
              <Box textAlign="right">
                <Typography variant="caption" color="text.secondary">
                  Total Amount
                </Typography>
                <Typography variant="h4" color="primary.main" fontWeight="bold">
                  ${Number(invoiceHead.total_amount || 0).toFixed(2)}
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
          {saving ? "Saving..." : invoice ? "Update Invoice" : "Save Invoice"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
