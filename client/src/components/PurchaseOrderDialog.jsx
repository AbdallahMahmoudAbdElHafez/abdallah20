import { fetchWarehouses } from "../features/warehouses/warehousesSlice";

const statusConfig = {
  draft: { color: "default", label: "مسودة" },
  approved: { color: "success", label: "معتمد" },
  closed: { color: "info", label: "مغلق" },
  cancelled: { color: "error", label: "ملغي" },
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
    if (!itemForm.product_id) return "يرجى اختيار المنتج";
    if (!itemForm.warehouse_id) return "يرجى اختيار المخزن";
    if (!itemForm.quantity || Number(itemForm.quantity) <= 0)
      return "الكمية يجب أن تكون أكبر من 0";
    if (
      itemForm.unit_price === "" ||
      Number(itemForm.unit_price) < 0
    )
      return "سعر الوحدة يجب أن يكون 0 أو أكثر";
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
      setError("يرجى اختيار المورد");
      return;
    }
    if (!orderHead.order_date) {
      setError("يرجى اختيار تاريخ الطلب");
      return;
    }
    if (items.length === 0) {
      setError("يرجى إضافة صنف واحد على الأقل");
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
      setError(err.message || "فشل حفظ أمر الشراء");
    } finally {
      setSaving(false);
    }
  };

  const itemColumns = [
    {
      accessorKey: "product_id",
      header: "المنتج",
      size: 180,
      Cell: ({ cell }) => {
        const product = products.find((p) => p.id === cell.getValue());
        return <Typography variant="body2">{product?.name || "—"}</Typography>;
      },
    },
    {
      accessorKey: "warehouse_id",
      header: "المخزن",
      size: 140,
      Cell: ({ cell }) => {
        const warehouse = warehouses.find((w) => w.id === cell.getValue());
        return (
          <Typography variant="body2">{warehouse?.name || "—"}</Typography>
        );
      },
    },
    { accessorKey: "batch_number", header: "رقم التشغيلة", size: 120 },
    { accessorKey: "expiry_date", header: "تاريخ الانتهاء", size: 120 },
    { accessorKey: "quantity", header: "الكمية", size: 80 },
    { accessorKey: "bonus_quantity", header: "بونص", size: 90 },
    { accessorKey: "unit_price", header: "سعر الوحدة", size: 100 },
    { accessorKey: "discount", header: "الخصم", size: 100 },
    {
      id: "total",
      header: "الإجمالي",
      size: 120,
      Cell: ({ row }) => {
        const it = row.original;
        const total =
          Number(it.quantity) * Number(it.unit_price) -
          Number(it.discount);
        return <Typography>{total.toFixed(2)} ج.م</Typography>;
      },
    },
    {
      header: "إجراءات",
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
          {order ? "تعديل أمر شراء" : "إنشاء أمر شراء"}
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
                  label="رقم الأمر"
                  value={orderHead.order_number}
                  disabled
                />
              </Grid>
              <Grid item xs={12} md={3}>
                <TextField
                  select
                  fullWidth
                  label="المورد"
                  value={orderHead.supplier_id}
                  onChange={(e) =>
                    setOrderHead({ ...orderHead, supplier_id: e.target.value })
                  }
                >
                  <MenuItem value="">اختر المورد</MenuItem>
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
                    رقم الهاتف:{" "}
                    {selectedSupplier.phone ||
                      selectedSupplier.email ||
                      "غير متوفر"}
                  </Typography>
                )}
              </Grid>
              <Grid item xs={12} md={3}>
                <TextField
                  type="date"
                  fullWidth
                  label="تاريخ الأمر"
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
                  label="الحالة"
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
                  label="خصم إضافي"
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
                  label="ضريبة %"
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
                  label="ضريبة القيمة المضافة %"
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
                  label="ملاحظات"
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
                <InventoryIcon color="primary" /> أصناف الأمر ({items.length})
              </Typography>
              <Button
                variant="outlined"
                startIcon={showItemForm ? <ExpandLessIcon /> : <AddIcon />}
                onClick={() => setShowItemForm(!showItemForm)}
              >
                {showItemForm ? "إخفاء" : "إضافة صنف"}
              </Button>
            </Box>

            <Collapse in={showItemForm}>
              <Paper sx={{ p: 2, mb: 2, backgroundColor: "grey.50" }}>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6} md={3}>
                    <TextField
                      select
                      fullWidth
                      label="المنتج"
                      value={itemForm.product_id}
                      onChange={(e) => handleItemProductChange(e.target.value)}
                    >
                      <MenuItem value="">اختر المنتج</MenuItem>
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
                      label="المخزن"
                      value={itemForm.warehouse_id}
                      onChange={(e) =>
                        setItemForm({
                          ...itemForm,
                          warehouse_id: e.target.value,
                        })
                      }
                    >
                      <MenuItem value="">اختر المخزن</MenuItem>
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
                      label="رقم التشغيلة"
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
                      label="تاريخ الانتهاء"
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
                      label="الكمية"
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
                      label="بونص"
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
                      label="سعر الوحدة"
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
                      label="الخصم"
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
                      إضافة
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
                <MoneyIcon color="primary" /> ملخص الأمر
              </Typography>
              <Box textAlign="right">
                <Typography>المجموع الفرعي: ${subTotal.toFixed(2)}</Typography>
                <Typography>
                  خصم إضافي: $
                  {Number(orderHead.additional_discount).toFixed(2)}
                </Typography>
                <Typography>
                  ضريبة ({Number(orderHead.tax_percent)}%): ${taxAmount.toFixed(2)}
                </Typography>
                <Typography>
                  ض.ق.م ({Number(orderHead.vat_rate)}%): ${vatAmount.toFixed(2)}
                </Typography>
                <Divider sx={{ my: 1 }} />
                <Typography variant="h4" color="primary.main">
                  الإجمالي: ${totalAmount.toFixed(2)}
                </Typography>
              </Box>
            </Stack>
          </CardContent>
        </Card>
      </DialogContent>

      <DialogActions sx={{ p: 3, gap: 1 }}>
        <Button onClick={onClose} variant="outlined">
          إلغاء
        </Button>
        <Button
          variant="contained"
          onClick={handleSaveAll}
          disabled={saving || loadingMeta}
          startIcon={saving ? <CircularProgress size={20} /> : <SaveIcon />}
        >
          {saving ? "جار الحفظ..." : "حفظ"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}