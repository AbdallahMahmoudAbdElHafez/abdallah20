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
    Money as MoneyIcon,
    ExpandLess as ExpandLessIcon,
} from "@mui/icons-material";
import { MaterialReactTable } from "material-react-table";
import { useDispatch, useSelector } from "react-redux";
import {
    addSalesInvoice,
    updateSalesInvoice,
} from "../features/salesInvoices/salesInvoicesSlice";
import { fetchParties } from "../features/parties/partiesSlice";
import { fetchProducts } from "../features/products/productsSlice";
import { fetchWarehouses } from "../features/warehouses/warehousesSlice";
import { fetchEmployees } from "../features/employees/employeesSlice";

const statusConfig = {
    unpaid: { color: "default", label: "Unpaid" },
    paid: { color: "success", label: "Paid" },
    partial: { color: "warning", label: "Partial" },
    cancelled: { color: "error", label: "Cancelled" },
};

export default function SalesInvoiceDialog({
    open,
    onClose,
    invoice,
    itemsInit = [],
    onSave,
}) {
    const dispatch = useDispatch();
    const customers = useSelector((s) => s.parties?.items ?? []);
    const products = useSelector((s) => s.products?.items ?? []);
    const warehouses = useSelector((s) => s.warehouses?.items ?? []);
    const employees = useSelector((s) => s.employees?.list ?? []);

    const [loadingMeta, setLoadingMeta] = useState(false);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [showItemForm, setShowItemForm] = useState(false);

    const [invoiceHead, setInvoiceHead] = useState({
        invoice_number: "",
        party_id: "",
        sales_order_id: "",
        warehouse_id: "",
        employee_id: "",
        invoice_date: "",
        due_date: "",
        invoice_type: "normal",
        status: "unpaid",
        shipping_amount: 0,
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
        price: "",
        discount: "",
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
        if (invoice) {
            setInvoiceHead({
                invoice_number: invoice.invoice_number ?? "",
                party_id: invoice.party_id ?? "",
                sales_order_id: invoice.sales_order_id ?? "",
                warehouse_id: invoice.warehouse_id ?? "",
                employee_id: invoice.employee_id ?? "",
                invoice_date: invoice.invoice_date ?? new Date().toISOString().split("T")[0],
                due_date: invoice.due_date ?? "",
                invoice_type: invoice.invoice_type ?? "normal",
                status: invoice.status ?? "unpaid",
                shipping_amount: Number(invoice.shipping_amount) || 0,
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
                invoice_number: "",
                party_id: "",
                sales_order_id: "",
                warehouse_id: "",
                employee_id: "",
                invoice_date: new Date().toISOString().split("T")[0],
                due_date: "",
                invoice_type: "normal",
                status: "unpaid",
                shipping_amount: 0,
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
            const price = Number(it.price) || 0;
            const disc = Number(it.discount) || 0;
            return sum + (qty * price - disc);
        }, 0);

        const shipping = Number(invoiceHead.shipping_amount) || 0;
        const taxableAmount = subtotal - (Number(invoiceHead.additional_discount) || 0) + shipping;

        const vatAmount = taxableAmount * ((Number(invoiceHead.vat_rate) || 0) / 100);
        const taxAmount = taxableAmount * ((Number(invoiceHead.tax_rate) || 0) / 100);
        const total = taxableAmount + vatAmount + taxAmount;

        setInvoiceHead((prev) => ({
            ...prev,
            subtotal,
            vat_amount: vatAmount,
            tax_amount: taxAmount,
            total_amount: total,
        }));
    }, [items, invoiceHead.vat_rate, invoiceHead.tax_rate, invoiceHead.additional_discount, invoiceHead.shipping_amount]);

    const handleItemProductChange = (productId) => {
        const prod = products.find((p) => p.id === productId);
        setItemForm((f) => ({
            ...f,
            product_id: productId,
            price: prod ? prod.price || "" : "",
        }));
    };

    const validateItemForm = () => {
        if (!itemForm.product_id) return "Please select a product";
        if (!itemForm.quantity || Number(itemForm.quantity) <= 0)
            return "Quantity must be greater than 0";
        if (itemForm.price === "" || Number(itemForm.price) < 0)
            return "Price must be 0 or greater";
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
            price: Number(itemForm.price),
            discount: itemForm.discount === "" ? 0 : Number(itemForm.discount),
            tax_percent: Number(itemForm.tax_percent) || 0,
            bonus: Number(itemForm.bonus) || 0,
        };
        setItems((prev) => [...prev, newItem]);
        setItemForm({
            product_id: "",
            warehouse_id: "",
            quantity: "",
            price: "",
            discount: "",
            tax_percent: 0,
            bonus: 0,
        });
        setShowItemForm(false);
    };

    const removeItemTemp = (tempId) => {
        setItems((prev) => prev.filter((it) => it.tempId !== tempId));
    };

    const handleSaveAll = async () => {
        if (!invoiceHead.party_id) {
            setError("Please select a customer");
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
            sales_order_id: invoiceHead.sales_order_id || null,
            warehouse_id: invoiceHead.warehouse_id || null,
            employee_id: invoiceHead.employee_id || null,
            items: items.map(({ tempId, id, ...rest }) => rest),
        };

        try {
            if (typeof onSave === "function") {
                await onSave(payload);
                onClose();
            } else {
                if (invoice && invoice.id) {
                    await dispatch(updateSalesInvoice({ id: invoice.id, data: payload })).unwrap();
                } else {
                    await dispatch(addSalesInvoice(payload)).unwrap();
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
        { accessorKey: "quantity", header: "Qty" },
        { accessorKey: "price", header: "Price" },
        { accessorKey: "discount", header: "Discount" },
        { accessorKey: "tax_percent", header: "Tax %" },
        { accessorKey: "bonus", header: "Bonus" },
        {
            id: "total",
            header: "Total",
            Cell: ({ row }) => {
                const q = Number(row.original.quantity) || 0;
                const p = Number(row.original.price) || 0;
                const d = Number(row.original.discount) || 0;
                const tax = Number(row.original.tax_percent) || 0;
                const subtotal = (q * p) - d;
                const taxAmount = (subtotal * tax) / 100;
                return <Typography>${(subtotal + taxAmount).toFixed(2)}</Typography>;
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

    const selectedCustomer = customers.find((c) => c.id === invoiceHead.party_id);

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="lg">
            <DialogTitle sx={{ display: "flex", justifyContent: "space-between" }}>
                <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
                    <ReceiptIcon />
                    <Typography variant="h6">
                        {invoice ? "Edit Sales Invoice" : "Create Sales Invoice"}
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
                                    fullWidth
                                    label="Invoice Number"
                                    value={invoiceHead.invoice_number}
                                    onChange={(e) =>
                                        setInvoiceHead({ ...invoiceHead, invoice_number: e.target.value })
                                    }
                                    placeholder="Auto-generated if empty (SI-YYYY-XXXXXX)"
                                    helperText="Leave empty for auto-generation"
                                />
                            </Grid>

                            <Grid item xs={12} md={6}>
                                <TextField
                                    select
                                    fullWidth
                                    label="Customer"
                                    value={invoiceHead.party_id}
                                    onChange={(e) =>
                                        setInvoiceHead({ ...invoiceHead, party_id: e.target.value })
                                    }
                                >
                                    <MenuItem value="">Select Customer</MenuItem>
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
                                        Contact: {selectedCustomer.phone || "N/A"}
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

                                        <Grid item xs={6} sm={3} md={2}>
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

                                        <Grid item xs={6} sm={3} md={2}>
                                            <TextField
                                                type="number"
                                                fullWidth
                                                label="Price"
                                                value={itemForm.price}
                                                onChange={(e) =>
                                                    setItemForm((f) => ({ ...f, price: e.target.value }))
                                                }
                                                size="small"
                                            />
                                        </Grid>

                                        <Grid item xs={6} sm={3} md={2}>
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
                                            <TextField
                                                type="number"
                                                fullWidth
                                                label="Tax %"
                                                value={itemForm.tax_percent}
                                                onChange={(e) =>
                                                    setItemForm((f) => ({ ...f, tax_percent: e.target.value }))
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
