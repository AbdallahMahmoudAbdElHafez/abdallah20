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
  Money as MoneyIcon,
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
import PaymentDialog from "./PaymentDialog";

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
  onSave,
}) {
  const dispatch = useDispatch();
  const suppliers = useSelector((s) => s.parties?.items ?? []);
  const products = useSelector((s) => s.products?.items ?? []);
  const warehouses = useSelector((s) => s.warehouses?.items ?? []);
  const [paymentOpen, setPaymentOpen] = useState(false);

  const [loadingMeta, setLoadingMeta] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [showItemForm, setShowItemForm] = useState(false);

  const [invoiceHead, setInvoiceHead] = useState({
    supplier_id: "",
    invoice_date: "",
    due_date: "",
    payment_terms: "",
    invoice_type: "normal",
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
    batch_number: "",
    expiry_date: "",
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
    if (invoice) {
      setInvoiceHead({
        supplier_id: invoice.supplier_id ?? "",
        invoice_date:
          invoice.invoice_date ?? new Date().toISOString().split("T")[0],
        due_date: invoice.due_date ?? "",
        payment_terms: invoice.payment_terms ?? "",
        invoice_type: invoice.invoice_type ?? "normal",
        status: invoice.status ?? "unpaid",
        subtotal: Number(invoice.subtotal) || 0,
        additional_discount: Number(invoice.additional_discount) || 0,
        vat_rate: Number(invoice.vat_rate) || 0,
        vat_amount: Number(invoice.vat_amount) || 0,
        tax_rate: Number(invoice.tax_rate) || 0,
        tax_amount: Number(invoice.tax_amount) || 0,
        total_amount: Number(invoice.total_amount) || 0,
      });
      setItems(
        (itemsInit || []).map((it) => ({ ...it, tempId: Date.now() + Math.random() }))
      );
    } else {
      setInvoiceHead({
        supplier_id: "",
        invoice_date: new Date().toISOString().split("T")[0],
        due_date: "",
        payment_terms: "",
        invoice_type: "normal",
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

  useEffect(() => {
    const subtotal = items.reduce((sum, it) => {
      const qty = Number(it.quantity) || 0;
      const price = Number(it.unit_price) || 0;
      const disc = Number(it.discount) || 0;
      return sum + (qty * price - disc);
    }, 0);

    const vatAmount = subtotal * ((Number(invoiceHead.vat_rate) || 0) / 100);
    const taxAmount = subtotal * ((Number(invoiceHead.tax_rate) || 0) / 100);
    const total =
      subtotal + vatAmount + taxAmount - (Number(invoiceHead.additional_discount) || 0);

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
    if (!itemForm.quantity || Number(itemForm.quantity) <= 0)
      return "Quantity must be greater than 0";
    if (itemForm.unit_price === "" || Number(itemForm.unit_price) < 0)
      return "Unit price must be 0 or greater";
    // batch_number and expiry_date are optional
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
    setItemForm({
      product_id: "",
      warehouse_id: "",
      quantity: "",
      unit_price: "",
      discount: "",
      batch_number: "",
      expiry_date: "",
    });
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

    // For opening balance invoices, items are not required but total_amount is
    if (invoiceHead.invoice_type === "opening") {
      if (!invoiceHead.total_amount || Number(invoiceHead.total_amount) <= 0) {
        setError("Please enter a total amount for opening balance");
        return;
      }
    } else {
      // For normal invoices, items are required
      if (items.length === 0) {
        setError("Please add at least one item");
        return;
      }
    }

    setSaving(true);
    setError("");

    const payload = {
      ...invoiceHead,
      due_date: invoiceHead.due_date || null,
      items: items.map(({ tempId, id, ...rest }) => rest),
    };

    try {
      if (typeof onSave === "function") {
        await onSave(payload);
        onClose();
      } else {
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
      Cell: ({ cell }) => {
        const product = products.find((p) => p.id === cell.getValue());
        return <Typography>{product?.name || "—"}</Typography>;
      },
    },
    {
      accessorKey: "warehouse_id",
      header: "Warehouse",
      Cell: ({ cell }) => {
        const w = warehouses.find((x) => x.id === cell.getValue());
        return <Typography>{w?.name || "—"}</Typography>;
      },
    },
    { accessorKey: "batch_number", header: "Batch #" },
    { accessorKey: "expiry_date", header: "Expiry Date" },
    { accessorKey: "quantity", header: "Qty" },
    { accessorKey: "unit_price", header: "Unit Price" },
    { accessorKey: "discount", header: "Discount" },
    {
      id: "total",
      header: "Total",
      Cell: ({ row }) => {
        const q = Number(row.original.quantity) || 0;
        const p = Number(row.original.unit_price) || 0;
        const d = Number(row.original.discount) || 0;
        return <Typography>${(q * p - d).toFixed(2)}</Typography>;
      },
    },
    {
      header: "Actions",
      Cell: ({ row }) => (
        <IconButton color="error" onClick={() => removeItemTemp(row.original.tempId)}>
          <DeleteIcon fontSize="small" />
        </IconButton>
      ),
    },
  ];

  const selectedSupplier = suppliers.find((s) => s.id === invoiceHead.supplier_id);

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="lg">
      <DialogTitle sx={{ display: "flex", justifyContent: "space-between" }}>
        <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
          <ReceiptIcon />
          <Typography variant="h6">
            {invoice ? "Edit Purchase Invoice" : "Create Purchase Invoice"}
          </Typography>
        </Box>
        <IconButton onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError("")}>
            {error}
          </Alert>
        )}

        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <TextField
                  select
                  fullWidth
                  label="Supplier"
                  value={invoiceHead.supplier_id}
                  onChange={(e) =>
                    setInvoiceHead({ ...invoiceHead, supplier_id: e.target.value })
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
                    Contact: {selectedSupplier.phone || "N/A"}
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
                  onChange={(e) =>
                    setInvoiceHead({ ...invoiceHead, invoice_date: e.target.value })
                  }
                />
              </Grid>

              <Grid item xs={12} md={3}>
                <TextField
                  type="date"
                  fullWidth
                  label="Due Date"
                  InputLabelProps={{ shrink: true }}
                  value={invoiceHead.due_date}
                  onChange={(e) =>
                    setInvoiceHead({ ...invoiceHead, due_date: e.target.value })
                  }
                />
              </Grid>

              <Grid item xs={12} md={3}>
                <TextField
                  fullWidth
                  label="Payment Terms"
                  value={invoiceHead.payment_terms}
                  onChange={(e) =>
                    setInvoiceHead({ ...invoiceHead, payment_terms: e.target.value })
                  }
                  placeholder="e.g., Net 30"
                />
              </Grid>

              <Grid item xs={12} md={3}>
                <TextField
                  select
                  fullWidth
                  label="Invoice Type"
                  value={invoiceHead.invoice_type}
                  onChange={(e) =>
                    setInvoiceHead({ ...invoiceHead, invoice_type: e.target.value })
                  }
                >
                  <MenuItem value="normal">Normal</MenuItem>
                  <MenuItem value="opening">Opening Balance</MenuItem>
                </TextField>
              </Grid>

              <Grid item xs={12} md={3}>
                <TextField
                  select
                  fullWidth
                  label="Status"
                  value={invoiceHead.status}
                  onChange={(e) =>
                    setInvoiceHead({ ...invoiceHead, status: e.target.value })
                  }
                >
                  {Object.entries(statusConfig).map(([key, cfg]) => (
                    <MenuItem key={key} value={key}>
                      {cfg.label}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* === Items Section (Only for Normal Invoices) === */}
        {invoiceHead.invoice_type === "normal" ? (
          <Card sx={{ mb: 2 }}>
            <CardContent>
              <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
                <Typography variant="h6">
                  <InventoryIcon /> Invoice Items ({items.length})
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
                <Paper sx={{ p: 2, mb: 2 }}>
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

                    <Grid item xs={12} sm={4} md={2}>
                      <TextField
                        fullWidth
                        label="Batch Number"
                        value={itemForm.batch_number}
                        onChange={(e) =>
                          setItemForm((f) => ({ ...f, batch_number: e.target.value }))
                        }
                        size="small"
                      />
                    </Grid>

                    <Grid item xs={12} sm={4} md={2}>
                      <TextField
                        type="date"
                        fullWidth
                        label="Expiry Date"
                        InputLabelProps={{ shrink: true }}
                        value={itemForm.expiry_date}
                        onChange={(e) =>
                          setItemForm((f) => ({ ...f, expiry_date: e.target.value }))
                        }
                        size="small"
                      />
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

              {loadingMeta ? (
                <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
                  <CircularProgress />
                </Box>
              ) : (
                <MaterialReactTable
                  columns={itemColumns}
                  data={items}
                  enablePagination={false}
                  enableTopToolbar={false}
                />
              )}
            </CardContent>
          </Card>
        ) : (
          // === Opening Balance Input (Only for Opening Invoices) ===
          <Card sx={{ mb: 2 }}>
            <CardContent>
              <Box sx={{ mb: 2 }}>
                <Typography variant="h6" gutterBottom>
                  <MoneyIcon /> Opening Balance
                </Typography>
                <Alert severity="info" sx={{ mb: 2 }}>
                  For opening balance invoices, enter the total amount directly. Items are not required.
                </Alert>
              </Box>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <TextField
                    type="number"
                    fullWidth
                    label="Total Amount"
                    value={invoiceHead.total_amount}
                    onChange={(e) =>
                      setInvoiceHead({ ...invoiceHead, total_amount: Number(e.target.value) })
                    }
                    inputProps={{ min: 0, step: 0.01 }}
                    helperText="Enter the opening balance amount"
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardContent>
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Typography variant="h6">
                <MoneyIcon /> Invoice Total
              </Typography>
              <Typography variant="h4" color="primary">
                ${Number(invoiceHead.total_amount || 0).toFixed(2)}
              </Typography>
            </Stack>
          </CardContent>
        </Card>
      </DialogContent>

      <DialogActions>
        <Button
          variant="outlined"
          color="primary"
          onClick={() => setPaymentOpen(true)}
        >
          Add Payment
        </Button>

        <PaymentDialog
          open={paymentOpen}
          onClose={() => setPaymentOpen(false)}
          invoiceId={invoice?.id}
        />
        <Button onClick={onClose}>Cancel</Button>
        <Button
          variant="contained"
          onClick={handleSaveAll}
          disabled={saving || loadingMeta}
          startIcon={saving ? <CircularProgress size={20} /> : <SaveIcon />}
        >
          {saving ? "Saving..." : invoice ? "Update Invoice" : "Save Invoice"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
