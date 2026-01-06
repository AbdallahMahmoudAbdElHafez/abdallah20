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
import { addSalesOrder, updateSalesOrder } from "../features/salesOrders/salesOrdersSlice";
import { fetchParties } from "../features/parties/partiesSlice";
import { fetchProducts } from "../features/products/productsSlice";
import { fetchWarehouses } from "../features/warehouses/warehousesSlice";
import { fetchEmployees } from "../features/employees/employeesSlice";

const statusConfig = {
    pending: { color: "warning", label: "قيد الانتظار" },
    approved: { color: "success", label: "معتمد" },
    partial: { color: "info", label: "جزئي" },
    completed: { color: "success", label: "مكتمل" },
    cancelled: { color: "error", label: "ملغي" },
};

export default function SalesOrderDialog({ open, onClose, order, itemsInit = [] }) {
    const dispatch = useDispatch();
    const customers = useSelector((s) => s.parties?.items ?? []);
    const products = useSelector((s) => s.products?.items ?? []);
    const warehouses = useSelector((s) => s.warehouses?.items ?? []);
    const employees = useSelector((s) => s.employees?.list ?? []);

    const [loadingMeta, setLoadingMeta] = useState(false);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [showItemForm, setShowItemForm] = useState(false);
    const [orderHead, setOrderHead] = useState({
        party_id: "",
        warehouse_id: "",
        employee_id: "",
        order_date: "",
        status: "pending",
        notes: "",
        additional_discount: 0,
        tax_rate: 0,
        vat_rate: 0,
    });
    const [items, setItems] = useState([]);
    const [itemForm, setItemForm] = useState({
        product_id: "",
        quantity: "",
        price: "",
        discount: 0,
        tax_percent: 0,
        bonus: 0,
    });

    useEffect(() => {
        setLoadingMeta(true);
        Promise.all([
            dispatch(fetchParties()),
            dispatch(fetchProducts()),
            dispatch(fetchWarehouses()),
            dispatch(fetchEmployees()),
        ]).finally(() => setLoadingMeta(false));
    }, [dispatch]);

    useEffect(() => {
        if (order) {
            setOrderHead({
                party_id: order.party_id || "",
                warehouse_id: order.warehouse_id || "",
                employee_id: order.employee_id || "",
                order_date: order.order_date || "",
                status: order.status || "pending",
                notes: order.notes || "",
                additional_discount: Number(order.additional_discount) || 0,
                tax_rate: Number(order.tax_rate) || 0,
                vat_rate: Number(order.vat_rate) || 0,
            });
            setItems(
                (itemsInit || []).map((it) => ({
                    ...it,
                    tempId: Date.now() + Math.random(),
                }))
            );
        } else {
            setOrderHead({
                party_id: "",
                warehouse_id: "",
                employee_id: "",
                order_date: new Date().toISOString().split("T")[0],
                status: "pending",
                notes: "",
                additional_discount: 0,
                tax_rate: 0,
                vat_rate: 0,
            });
            setItems([]);
        }
        setError("");
    }, [order, itemsInit]);

    const handleItemProductChange = (productId) => {
        const prod = products.find((p) => p.id === productId);
        setItemForm((f) => ({
            ...f,
            product_id: productId,
            price: prod ? Number(prod.price || 0) : 0,
        }));
    };

    const validateItemForm = () => {
        if (!itemForm.product_id) return "يرجى اختيار المنتج";
        if (!itemForm.quantity || Number(itemForm.quantity) <= 0)
            return "الكمية يجب أن تكون أكبر من 0";
        if (itemForm.price === "" || Number(itemForm.price) < 0)
            return "السعر يجب أن يكون 0 أو أكثر";
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
            price: Number(itemForm.price),
            discount: Number(itemForm.discount || 0),
            tax_percent: Number(itemForm.tax_percent || 0),
            bonus: Number(itemForm.bonus || 0),
            warehouse_id: orderHead.warehouse_id || null, // Add warehouse_id from order header
        };
        setItems((prev) => [...prev, newItem]);
        setItemForm({
            product_id: "",
            quantity: "",
            price: "",
            discount: 0,
            tax_percent: 0,
            bonus: 0,
        });
        setShowItemForm(false);
    };

    const removeItemTemp = (tempId) => {
        setItems((prev) => prev.filter((it) => it.tempId !== tempId));
    };

    const handleSaveAll = async () => {
        if (!orderHead.party_id) {
            setError("يرجى اختيار العميل");
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
                s + (Number(it.quantity) * Number(it.price) - Number(it.discount)),
            0
        );
        const taxableAmount = subTotal - Number(orderHead.additional_discount);
        const taxAmount = (taxableAmount * Number(orderHead.tax_rate)) / 100;
        const vatAmount = (taxableAmount * Number(orderHead.vat_rate)) / 100;
        const totalAmount = taxableAmount + taxAmount + vatAmount;

        const payload = {
            ...orderHead,
            subtotal: subTotal,
            tax_amount: taxAmount,
            vat_amount: vatAmount,
            total_amount: totalAmount,
            items: items.map(({ tempId, id, sales_order_id, product, warehouse, createdAt, updatedAt, ...rest }) => rest),
        };

        // Sanitize optional fields
        if (payload.warehouse_id === "") payload.warehouse_id = null;
        if (payload.employee_id === "") payload.employee_id = null;

        try {
            if (order?.id) {
                await dispatch(
                    updateSalesOrder({ id: order.id, data: payload })
                ).unwrap();
            } else {
                await dispatch(addSalesOrder(payload)).unwrap();
            }
            onClose();
        } catch (err) {
            setError(err.message || "فشل حفظ أمر المبيعات");
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
        { accessorKey: "quantity", header: "الكمية", size: 80 },
        { accessorKey: "price", header: "السعر", size: 100 },
        { accessorKey: "discount", header: "الخصم", size: 100 },
        { accessorKey: "tax_percent", header: "ضريبة %", size: 80 },
        { accessorKey: "bonus", header: "هدية", size: 80 },
        {
            id: "total",
            header: "الإجمالي",
            size: 120,
            Cell: ({ row }) => {
                const it = row.original;
                const total =
                    Number(it.quantity) * Number(it.price) -
                    Number(it.discount);
                return <Typography>${total.toFixed(2)}</Typography>;
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

    const selectedCustomer = customers.find(
        (c) => c.id === orderHead.party_id && c.party_type === "customer"
    );

    const subTotal = items.reduce(
        (s, it) =>
            s + (Number(it.quantity) * Number(it.price) - Number(it.discount)),
        0
    );
    const taxableAmount = subTotal - Number(orderHead.additional_discount);
    const taxAmount = (taxableAmount * Number(orderHead.tax_rate)) / 100;
    const vatAmount = (taxableAmount * Number(orderHead.vat_rate)) / 100;
    const totalAmount = taxableAmount + taxAmount + vatAmount;

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="lg">
            <DialogTitle>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                    <ShoppingCartIcon />{" "}
                    {order ? "تعديل أمر مبيعات" : "إضافة أمر مبيعات"}
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
                                    select
                                    fullWidth
                                    label="العميل"
                                    value={orderHead.party_id}
                                    onChange={(e) =>
                                        setOrderHead({ ...orderHead, party_id: e.target.value })
                                    }
                                >
                                    <MenuItem value="">اختر العميل</MenuItem>
                                    {customers
                                        .filter((p) => p.party_type === "customer")
                                        .map((c) => (
                                            <MenuItem key={c.id} value={c.id}>
                                                {c.name}
                                            </MenuItem>
                                        ))}
                                </TextField>
                                {selectedCustomer && (
                                    <Typography variant="caption">
                                        رقم الهاتف:{" "}
                                        {selectedCustomer.phone ||
                                            selectedCustomer.email ||
                                            "غير متوفر"}
                                    </Typography>
                                )}
                            </Grid>
                            <Grid item xs={12} md={3}>
                                <TextField
                                    type="date"
                                    fullWidth
                                    label="تاريخ الطلب"
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
                            <Grid item xs={12} md={3}>
                                <TextField
                                    select
                                    fullWidth
                                    label="المخزن"
                                    value={orderHead.warehouse_id}
                                    onChange={(e) =>
                                        setOrderHead({ ...orderHead, warehouse_id: e.target.value })
                                    }
                                >
                                    <MenuItem value="">اختياري</MenuItem>
                                    {warehouses.map((w) => (
                                        <MenuItem key={w.id} value={w.id}>
                                            {w.name}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            </Grid>
                            <Grid item xs={12} md={3}>
                                <TextField
                                    select
                                    fullWidth
                                    label="الموظف"
                                    value={orderHead.employee_id}
                                    onChange={(e) =>
                                        setOrderHead({ ...orderHead, employee_id: e.target.value })
                                    }
                                >
                                    <MenuItem value="">اختياري</MenuItem>
                                    {employees.map((e) => (
                                        <MenuItem key={e.id} value={e.id}>
                                            {e.name}
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
                                    value={orderHead.tax_rate}
                                    onChange={(e) =>
                                        setOrderHead({
                                            ...orderHead,
                                            tax_rate: Number(e.target.value) || 0,
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
                                <InventoryIcon color="primary" /> الأصناف ({items.length})
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

                                    <Grid item xs={6} sm={3} md={2}>
                                        <TextField
                                            type="number"
                                            fullWidth
                                            label="الكمية"
                                            value={itemForm.quantity}
                                            onChange={(e) =>
                                                setItemForm((f) => ({ ...f, quantity: e.target.value }))
                                            }
                                            inputProps={{ min: 0, step: 1 }}
                                        />
                                    </Grid>

                                    <Grid item xs={6} sm={3} md={2}>
                                        <TextField
                                            type="number"
                                            fullWidth
                                            label="السعر"
                                            value={itemForm.price}
                                            onChange={(e) =>
                                                setItemForm((f) => ({ ...f, price: e.target.value }))
                                            }
                                            inputProps={{ min: 0, step: 0.01 }}
                                        />
                                    </Grid>

                                    <Grid item xs={6} sm={3} md={2}>
                                        <TextField
                                            type="number"
                                            fullWidth
                                            label="الخصم"
                                            value={itemForm.discount}
                                            onChange={(e) =>
                                                setItemForm((f) => ({ ...f, discount: e.target.value }))
                                            }
                                            inputProps={{ min: 0, step: 0.01 }}
                                        />
                                    </Grid>

                                    <Grid item xs={6} sm={3} md={1.5}>
                                        <TextField
                                            type="number"
                                            fullWidth
                                            label="ضريبة %"
                                            value={itemForm.tax_percent}
                                            onChange={(e) =>
                                                setItemForm((f) => ({ ...f, tax_percent: e.target.value }))
                                            }
                                            inputProps={{ min: 0, step: 0.01 }}
                                        />
                                    </Grid>

                                    <Grid item xs={6} sm={3} md={1.5}>
                                        <TextField
                                            type="number"
                                            fullWidth
                                            label="هدية"
                                            value={itemForm.bonus}
                                            onChange={(e) =>
                                                setItemForm((f) => ({ ...f, bonus: e.target.value }))
                                            }
                                            inputProps={{ min: 0, step: 1 }}
                                        />
                                    </Grid>

                                    <Grid item xs={6} sm={3} md={1}>
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

                <Card>
                    <CardContent>
                        <Stack direction="row" justifyContent="space-between" alignItems="center">
                            <Typography variant="h6">
                                <MoneyIcon color="primary" /> ملخص الطلب
                            </Typography>
                            <Box textAlign="right">
                                <Typography>المجموع الفرعي: ${subTotal.toFixed(2)}</Typography>
                                <Typography>
                                    خصم إضافي: $
                                    {Number(orderHead.additional_discount).toFixed(2)}
                                </Typography>
                                <Typography>
                                    ضريبة ({Number(orderHead.tax_rate)}%): ${taxAmount.toFixed(2)}
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
