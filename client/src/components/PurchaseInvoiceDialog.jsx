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
  FileDownload as FileDownloadIcon,
} from "@mui/icons-material";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
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
import ExcelExportDialog from "./ExcelExportDialog";

const statusConfig = {
  unpaid: { color: "default", label: "غير مدفوع" },
  paid: { color: "success", label: "مدفوع" },
  partially_paid: { color: "warning", label: "مدفوع جزئياً" },
  cancelled: { color: "error", label: "ملغي" },
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
  const [exportDialogOpen, setExportDialogOpen] = useState(false);

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
      // dispatch(fetchProducts()),
      dispatch(fetchWarehouses()),
    ]).finally(() => setLoadingMeta(false));
  }, [dispatch]);

  useEffect(() => {
    if (itemForm.warehouse_id) {
      dispatch(fetchProducts({ warehouse_id: itemForm.warehouse_id }));
    } else {
      dispatch(fetchProducts());
    }
  }, [dispatch, itemForm.warehouse_id]);


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
    if (!itemForm.product_id) return "يرجى اختيار المنتج";
    if (!itemForm.warehouse_id) return "يرجى اختيار المخزن";
    if (!itemForm.quantity || Number(itemForm.quantity) <= 0)
      return "الكمية يجب أن تكون أكبر من 0";
    if (itemForm.unit_price === "" || Number(itemForm.unit_price) < 0)
      return "سعر الوحدة يجب أن يكون 0 أو أكثر";
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
      expiry_date: itemForm.expiry_date === "" ? null : itemForm.expiry_date,
    };
    setItems((prev) => [...prev, newItem]);
    setItemForm({
      product_id: "",
      warehouse_id: "",
      quantity: newItem.quantity, // Retain quantity
      unit_price: "",
      discount: newItem.discount, // Retain discount
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
      setError("يرجى اختيار المورد");
      return;
    }
    if (!invoiceHead.invoice_date) {
      setError("يرجى اختيار تاريخ الفاتورة");
      return;
    }

    // For opening balance invoices, items are not required but total_amount is
    if (invoiceHead.invoice_type === "opening") {
      if (!invoiceHead.total_amount || Number(invoiceHead.total_amount) <= 0) {
        setError("يرجى إدخال المبلغ الإجمالي للرصيد الافتتاحي");
        return;
      }
    } else {
      // For normal invoices, items are required
      if (items.length === 0) {
        setError("يرجى إضافة صنف واحد على الأقل");
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
      setError(err?.message || "فشل حفظ الفاتورة");
    } finally {
      setSaving(false);
    }
  };

  const exportColumns = [
    { key: "invoice_number", label: "رقم الفاتورة" },
    { key: "supplier", label: "المورد" },
    { key: "invoice_date", label: "التاريخ" },
    { key: "due_date", label: "تاريخ الاستحقاق" },
    { key: "payment_terms", label: "شروط الدفع" },
    { key: "invoice_type", label: "نوع الفاتورة" },
    { key: "status", label: "الحالة" },
    { key: "items", label: "الأصناف" },
    { key: "subtotal", label: "المجموع الفرعي" },
    { key: "additional_discount", label: "الخصم الإضافي" },
    { key: "vat_amount", label: "ضريبة القيمة المضافة" },
    { key: "tax_amount", label: "ضريبة أخرى" },
    { key: "total_amount", label: "الإجمالي النهائي" },
  ];

  const handleExportExcel = (selectedColumns) => {
    const wb = XLSX.utils.book_new();

    // Helper to check if column is selected
    const isSelected = (key) => selectedColumns.includes(key);

    // Prepare Header Data based on selection
    const headData = [];
    if (isSelected("invoice_number")) headData.push(["رقم الفاتورة", invoiceHead.invoice_number || invoice?.invoice_number]);
    if (isSelected("supplier")) headData.push(["المورد", selectedSupplier?.name || ""]);
    if (isSelected("invoice_date")) headData.push(["التاريخ", invoiceHead.invoice_date]);
    if (isSelected("due_date")) headData.push(["تاريخ الاستحقاق", invoiceHead.due_date]);
    if (isSelected("payment_terms")) headData.push(["شروط الدفع", invoiceHead.payment_terms]);
    if (isSelected("invoice_type")) headData.push(["نوع الفاتورة", invoiceHead.invoice_type === 'opening' ? 'رصيد افتتاحي' : 'فاتورة عادية']);
    if (isSelected("status")) headData.push(["الحالة", statusConfig[invoiceHead.status]?.label || invoiceHead.status]);

    headData.push([]); // Spacer

    // Items Section
    let itemsHeader = [];
    let itemsData = [];

    if (isSelected("items")) {
      headData.push(["الأصناف"]);
      itemsHeader = ["المنتج", "المخزن", "رقم التشغيلة", "تاريخ الانتهاء", "الكمية", "سعر الوحدة", "الخصم", "الإجمالي"];
      itemsData = items.map(item => {
        const product = products.find(p => p.id === item.product_id);
        const warehouse = warehouses.find(w => w.id === item.warehouse_id);
        return [
          product?.name || "",
          warehouse?.name || "",
          item.batch_number,
          item.expiry_date,
          item.quantity,
          item.unit_price,
          item.discount,
          ((item.quantity * item.unit_price) - item.discount).toFixed(2)
        ];
      });
    }

    // Footer Data based on selection
    const footerData = [];
    footerData.push([]); // Spacer
    if (isSelected("subtotal")) footerData.push(["المجموع الفرعي", invoiceHead.subtotal]);
    if (isSelected("additional_discount")) footerData.push(["الخصم الإضافي", invoiceHead.additional_discount]);
    if (isSelected("vat_amount")) footerData.push(["ضريبة القيمة المضافة", invoiceHead.vat_amount]);
    if (isSelected("tax_amount")) footerData.push(["ضريبة أخرى", invoiceHead.tax_amount]);
    if (isSelected("total_amount")) footerData.push(["الإجمالي النهائي", invoiceHead.total_amount]);

    const wsData = [
      ...headData,
      ...(isSelected("items") ? [itemsHeader, ...itemsData] : []),
      ...footerData
    ];

    const ws = XLSX.utils.aoa_to_sheet(wsData);
    XLSX.utils.book_append_sheet(wb, ws, "Purchase Invoice");

    const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([wbout], { type: 'application/octet-stream' });
    saveAs(blob, `فاتورة_مشتريات_${invoiceHead.invoice_number || invoice?.invoice_number || 'جديدة'}.xlsx`);
  };

  const itemColumns = [
    {
      accessorKey: "product_id",
      header: "المنتج",
      Cell: ({ cell }) => {
        const product = products.find((p) => p.id === cell.getValue());
        return <Typography>{product?.name || "—"}</Typography>;
      },
    },
    {
      accessorKey: "warehouse_id",
      header: "المخزن",
      Cell: ({ cell }) => {
        const w = warehouses.find((x) => x.id === cell.getValue());
        return <Typography>{w?.name || "—"}</Typography>;
      },
    },
    { accessorKey: "batch_number", header: "رقم التشغيلة" },
    { accessorKey: "expiry_date", header: "تاريخ الانتهاء" },
    { accessorKey: "quantity", header: "الكمية" },
    { accessorKey: "unit_price", header: "سعر الوحدة" },
    { accessorKey: "discount", header: "الخصم" },
    {
      id: "total",
      header: "الإجمالي",
      Cell: ({ row }) => {
        const q = Number(row.original.quantity) || 0;
        const p = Number(row.original.unit_price) || 0;
        const d = Number(row.original.discount) || 0;
        return <Typography>${(q * p - d).toFixed(2)}</Typography>;
      },
    },
    {
      header: "إجراءات",
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
            {invoice ? "تعديل فاتورة شراء" : "إنشاء فاتورة شراء"}
          </Typography>
        </Box>
        <Box>
          {invoice && (
            <IconButton onClick={() => setExportDialogOpen(true)} title="تصدير Excel">
              <FileDownloadIcon />
            </IconButton>
          )}
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <ExcelExportDialog
        open={exportDialogOpen}
        onClose={() => setExportDialogOpen(false)}
        onExport={handleExportExcel}
        columns={exportColumns}
      />

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
                  label="المورد"
                  value={invoiceHead.supplier_id}
                  onChange={(e) =>
                    setInvoiceHead({ ...invoiceHead, supplier_id: e.target.value })
                  }
                >
                  <MenuItem value="">اختر المورد</MenuItem>
                  {suppliers
                    .filter((p) => p.party_type === "supplier")
                    .map((s) => (
                      <MenuItem key={s.id} value={s.id}>
                        {s.name} {s.City?.name ? `(${s.City.name})` : ""}
                      </MenuItem>
                    ))}
                </TextField>
                {selectedSupplier && (
                  <Typography variant="caption">
                    رقم الهاتف: {selectedSupplier.phone || "غير متوفر"}
                  </Typography>
                )}
              </Grid>

              <Grid item xs={12} md={3}>
                <TextField
                  type="date"
                  fullWidth
                  label="تاريخ الفاتورة"
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
                  label="تاريخ الاستحقاق"
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
                  label="شروط الدفع"
                  value={invoiceHead.payment_terms}
                  onChange={(e) =>
                    setInvoiceHead({ ...invoiceHead, payment_terms: e.target.value })
                  }
                  placeholder="مثال: Net 30"
                />
              </Grid>

              <Grid item xs={12} md={3}>
                <TextField
                  select
                  fullWidth
                  label="نوع الفاتورة"
                  value={invoiceHead.invoice_type}
                  onChange={(e) =>
                    setInvoiceHead({ ...invoiceHead, invoice_type: e.target.value })
                  }
                >
                  <MenuItem value="normal">فاتورة عادية</MenuItem>
                  <MenuItem value="opening">رصيد افتتاحي</MenuItem>
                </TextField>
              </Grid>

              <Grid item xs={12} md={3}>

                <TextField
                  select
                  fullWidth
                  label="الحالة"
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
                  <InventoryIcon /> أصناف الفاتورة ({items.length})
                </Typography>
                <Button
                  variant="outlined"
                  startIcon={showItemForm ? <ExpandLessIcon /> : <AddIcon />}
                  onClick={() => setShowItemForm(!showItemForm)}
                >
                  {showItemForm ? "إخفاء النموذج" : "إضافة صنف"}
                </Button>
              </Box>

              <Collapse in={showItemForm}>
                <Paper sx={{ p: 2, mb: 2 }}>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6} md={2}>
                      <TextField
                        select
                        fullWidth
                        label="المخزن"
                        value={itemForm.warehouse_id}
                        onChange={(e) =>
                          setItemForm((f) => ({ ...f, warehouse_id: e.target.value }))
                        }
                        size="small"
                      >
                        <MenuItem value="">اختر المخزن</MenuItem>
                        {warehouses.map((w) => (
                          <MenuItem key={w.id} value={w.id}>
                            {w.name}
                          </MenuItem>
                        ))}
                      </TextField>
                    </Grid>

                    <Grid item xs={12} sm={6} md={3}>
                      <TextField
                        select
                        fullWidth
                        label="المنتج"
                        value={itemForm.product_id}
                        onChange={(e) => handleItemProductChange(e.target.value)}
                        size="small"
                      >
                        <MenuItem value="">اختر المنتج</MenuItem>
                        {products.map((p) => {
                          const stock = p.current_inventory?.[0]?.quantity || 0;
                          return (
                            <MenuItem key={p.id} value={p.id}>
                              {p.name} (الرصيد: {stock})
                            </MenuItem>
                          );
                        })}
                      </TextField>
                    </Grid>

                    <Grid item xs={12} sm={4} md={2}>

                      <TextField
                        fullWidth
                        label="رقم التشغيلة"
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
                        label="تاريخ الانتهاء"
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
                        label="الكمية"
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
                        label="سعر الوحدة"
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
                        label="الخصم"
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
                        إضافة
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
                  <MoneyIcon /> الرصيد الافتتاحي
                </Typography>
                <Alert severity="info" sx={{ mb: 2 }}>
                  للفواتير الافتتاحية، أدخل المبلغ الإجمالي مباشرة. الأصناف غير مطلوبة.
                </Alert>
              </Box>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <TextField
                    type="number"
                    fullWidth
                    label="المبلغ الإجمالي"
                    value={invoiceHead.total_amount}
                    onChange={(e) =>
                      setInvoiceHead({ ...invoiceHead, total_amount: Number(e.target.value) })
                    }
                    inputProps={{ min: 0, step: 0.01 }}
                    helperText="أدخل مبلغ الرصيد الافتتاحي"
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
                <MoneyIcon /> إجمالي الفاتورة
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
          إضافة دفعة
        </Button>

        <PaymentDialog
          open={paymentOpen}
          onClose={() => setPaymentOpen(false)}
          invoiceId={invoice?.id}
        />
        <Button onClick={onClose}>إلغاء</Button>
        <Button
          variant="contained"
          onClick={handleSaveAll}
          disabled={saving || loadingMeta}
          startIcon={saving ? <CircularProgress size={20} /> : <SaveIcon />}
        >
          {saving ? "جاري الحفظ..." : invoice ? "تحديث الفاتورة" : "حفظ الفاتورة"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
