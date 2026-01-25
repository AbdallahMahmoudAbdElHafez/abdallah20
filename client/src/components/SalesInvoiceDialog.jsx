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
    FileDownload as FileDownloadIcon,
    Edit as EditIcon,
} from "@mui/icons-material";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
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
import { fetchAccounts } from "../features/accounts/accountsSlice";
import ExcelExportDialog from "./ExcelExportDialog";

const statusConfig = {
    unpaid: { color: "default", label: "غير مدفوع" },
    paid: { color: "success", label: "مدفوع" },
    partial: { color: "warning", label: "جزئي" },
};

const invoiceStatusConfig = {
    draft: { color: "default", label: "مسودة" },
    approved: { color: "success", label: "معتمد" },
    cancelled: { color: "error", label: "ملغي" },
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
    const accounts = useSelector((s) => s.accounts?.items ?? []);

    const [loadingMeta, setLoadingMeta] = useState(false);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [showItemForm, setShowItemForm] = useState(false);
    const [exportDialogOpen, setExportDialogOpen] = useState(false);
    const [editingItemTempId, setEditingItemTempId] = useState(null);

    const [invoiceHead, setInvoiceHead] = useState({
        invoice_number: "",
        party_id: "",
        sales_order_id: "",
        warehouse_id: "",
        employee_id: "",
        distributor_employee_id: "",
        invoice_date: "",
        due_date: "",
        invoice_type: "normal",
        invoice_status: "draft",
        status: "unpaid",
        account_id: "",
        shipping_amount: 0,
        subtotal: 0,
        additional_discount: 0,
        additional_discount_percent: 0,
        vat_rate: 0,
        vat_amount: 0,
        tax_rate: 0,
        tax_amount: 0,
        total_amount: 0,
        note: "",
    });

    const [items, setItems] = useState([]);
    const [itemForm, setItemForm] = useState({
        product_id: "",
        warehouse_id: "",
        quantity: "",
        price: "",
        discount: "",
        discount_percent: "",
        tax_percent: 0,
        bonus: 0,
        vat_rate: 0,
    });

    useEffect(() => {
        setLoadingMeta(true);
        Promise.all([
            dispatch(fetchParties()),
            // dispatch(fetchProducts()), // Don't fetch all initially, wait for warehouse selection or fetch generic
            dispatch(fetchWarehouses()),
            dispatch(fetchEmployees()),
            dispatch(fetchAccounts()),
        ]).finally(() => setLoadingMeta(false));
    }, [dispatch]);

    // Fetch products when warehouse changes
    useEffect(() => {
        if (invoiceHead.warehouse_id) {
            dispatch(fetchProducts({ warehouse_id: invoiceHead.warehouse_id }));
        } else {
            dispatch(fetchProducts()); // Fetch all (no stock info or generic)
        }
    }, [dispatch, invoiceHead.warehouse_id]);

    useEffect(() => {
        if (invoice) {
            setInvoiceHead({
                invoice_number: invoice.invoice_number ?? "",
                party_id: invoice.party_id ?? "",
                sales_order_id: invoice.sales_order_id ?? "",
                warehouse_id: invoice.warehouse_id ?? "",
                employee_id: invoice.employee_id ?? "",
                distributor_employee_id: invoice.distributor_employee_id ?? "",
                invoice_date: invoice.invoice_date ?? new Date().toISOString().split("T")[0],
                due_date: invoice.due_date ?? "",
                invoice_type: invoice.invoice_type ?? "normal",
                invoice_status: invoice.invoice_status ?? "draft",
                status: invoice.status ?? "unpaid",
                account_id: invoice.account_id ?? "",
                shipping_amount: Number(invoice.shipping_amount) || 0,
                subtotal: Number(invoice.subtotal) || 0,
                additional_discount: Number(invoice.additional_discount) || 0,
                additional_discount_percent: invoice.subtotal > 0 ? (Number(invoice.additional_discount) / Number(invoice.subtotal)) * 100 : 0,
                vat_rate: Number(invoice.vat_rate) || 0,
                vat_amount: Number(invoice.vat_amount) || 0,
                tax_rate: Number(invoice.tax_rate) || 0,
                tax_amount: Number(invoice.tax_amount) || 0,
                total_amount: Number(invoice.total_amount) || 0,
                note: invoice.note ?? "",
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
                distributor_employee_id: "",
                invoice_date: new Date().toISOString().split("T")[0],
                due_date: "",
                invoice_type: "normal",
                invoice_status: "draft",
                status: "unpaid",
                account_id: "",
                shipping_amount: 0,
                subtotal: 0,
                additional_discount: 0,
                additional_discount_percent: 0,
                vat_rate: 0,
                vat_amount: 0,
                tax_rate: 0,
                tax_amount: 0,
                total_amount: 0,
                note: "",
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

        // Sum VAT and Tax from items
        const vatAmount = items.reduce((sum, it) => sum + (Number(it.vat_amount) || 0), 0);
        // taxableAmount above is actually subtotal + shipping - discount. 
        // For tax_amount (other taxes), if it's still header-based, we keep it. 
        // However, if it's also item-based, we should sum it.
        // The user specifically asked for VAT on item level.

        const taxAmount = taxableAmount * ((Number(invoiceHead.tax_rate) || 0) / 100);
        const total = taxableAmount + vatAmount + taxAmount;

        setInvoiceHead((prev) => ({
            ...prev,
            subtotal,
            vat_amount: vatAmount,
            tax_amount: taxAmount,
            total_amount: total,
        }));
    }, [items, invoiceHead.tax_rate, invoiceHead.additional_discount, invoiceHead.shipping_amount]);

    const handleItemProductChange = (productId) => {
        const prod = products.find((p) => p.id === productId);
        setItemForm((f) => ({
            ...f,
            product_id: productId,
            price: prod ? prod.price || "" : "",
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
        const qty = Number(itemForm.quantity);
        const price = Number(itemForm.price);
        const discountPercent = Number(itemForm.discount_percent) || 0;
        const discountValue = (qty * price * discountPercent) / 100;

        if (editingItemTempId) {
            // Update existing item
            setItems((prev) =>
                prev.map((it) =>
                    it.tempId === editingItemTempId
                        ? { ...it, ...itemForm, quantity: qty, price: price, discount: discountValue, discount_percent: discountPercent, tax_percent: Number(itemForm.tax_percent) || 0, vat_rate: Number(itemForm.vat_rate) || 0, vat_amount: ((qty * price - discountValue) * (Number(itemForm.vat_rate) || 0)) / 100, bonus: Number(itemForm.bonus) || 0 }
                        : it
                )
            );
            setEditingItemTempId(null);
        } else {
            // Add new item
            const newItem = {
                ...itemForm,
                tempId: Date.now() + Math.random(),
                quantity: qty,
                price: price,
                discount: discountValue,
                discount_percent: discountPercent,
                tax_percent: Number(itemForm.tax_percent) || 0,
                vat_rate: Number(itemForm.vat_rate) || 0,
                vat_amount: ((qty * price - discountValue) * (Number(itemForm.vat_rate) || 0)) / 100,
                bonus: Number(itemForm.bonus) || 0,
            };
            setItems((prev) => [...prev, newItem]);
        }

        setItemForm({
            product_id: "",
            warehouse_id: "",
            quantity: qty, // Retain quantity
            price: "",
            discount: "",
            discount_percent: discountPercent, // Retain discount percent
            tax_percent: 0,
            bonus: 0,
            vat_rate: Number(itemForm.vat_rate) || 0, // Retain vat rate
        });
        setShowItemForm(false);
    };

    const handleEditItem = (item) => {
        setItemForm({
            product_id: item.product_id,
            warehouse_id: item.warehouse_id || "",
            quantity: item.quantity,
            price: item.price,
            discount: item.discount,
            discount_percent: item.discount_percent,
            tax_percent: item.tax_percent,
            bonus: item.bonus,
            vat_rate: item.vat_rate,
        });
        setEditingItemTempId(item.tempId);
        setShowItemForm(true);
    };

    const cancelEdit = () => {
        setEditingItemTempId(null);
        setItemForm({
            product_id: "",
            warehouse_id: "",
            quantity: "",
            price: "",
            discount: "",
            discount_percent: "",
            tax_percent: 0,
            bonus: 0,
            vat_rate: 0,
        });
        setShowItemForm(false);
    };

    const removeItemTemp = (tempId) => {
        if (editingItemTempId === tempId) cancelEdit();
        setItems((prev) => prev.filter((it) => it.tempId !== tempId));
    };

    const handleSaveAll = async () => {
        if (!invoiceHead.party_id) {
            setError("يرجى اختيار العميل");
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
            sales_order_id: invoiceHead.sales_order_id || null,
            warehouse_id: invoiceHead.warehouse_id || null,
            employee_id: invoiceHead.employee_id || null,
            distributor_employee_id: invoiceHead.distributor_employee_id || null,
            account_id: invoiceHead.account_id || null,
            items: items.map(({ tempId, ...rest }) => rest),
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
            setError(err?.message || "فشل حفظ الفاتورة");
        } finally {
            setSaving(false);
        }
    };

    const exportColumns = [
        { key: "invoice_number", label: "رقم الفاتورة" },
        { key: "customer", label: "العميل" },
        { key: "invoice_date", label: "التاريخ" },
        { key: "due_date", label: "تاريخ الاستحقاق" },
        { key: "warehouse", label: "المخزن" },
        { key: "employee", label: "الموظف" },
        { key: "invoice_type", label: "نوع الفاتورة" },
        { key: "status", label: "الحالة" },
        { key: "items", label: "الأصناف" },
        { key: "subtotal", label: "المجموع الفرعي" },
        { key: "additional_discount", label: "الخصم الإضافي" },
        { key: "shipping_amount", label: "الشحن" },
        { key: "vat_amount", label: "ضريبة القيمة المضافة" },
        { key: "tax_amount", label: "ضريبة أخرى" },
        { key: "total_amount", label: "الإجمالي النهائي" },
        { key: "note", label: "ملاحظات" },
    ];

    const handleExportExcel = (selectedColumns) => {
        const wb = XLSX.utils.book_new();

        // Helper to check if column is selected
        const isSelected = (key) => selectedColumns.includes(key);

        // Prepare Header Data based on selection
        const headData = [];
        if (isSelected("invoice_number")) headData.push(["رقم الفاتورة", invoiceHead.invoice_number]);
        if (isSelected("customer")) headData.push(["العميل", selectedCustomer?.name || ""]);
        if (isSelected("invoice_date")) headData.push(["التاريخ", invoiceHead.invoice_date]);
        if (isSelected("due_date")) headData.push(["تاريخ الاستحقاق", invoiceHead.due_date]);
        if (isSelected("warehouse")) headData.push(["المخزن", warehouses.find(w => w.id === invoiceHead.warehouse_id)?.name || ""]);
        if (isSelected("employee")) headData.push(["الموظف", employees.find(e => e.id === invoiceHead.employee_id)?.name || ""]);
        if (isSelected("invoice_type")) headData.push(["نوع الفاتورة", invoiceHead.invoice_type === 'opening' ? 'رصيد افتتاحي' : 'فاتورة عادية']);
        if (isSelected("status")) headData.push(["الحالة", statusConfig[invoiceHead.status]?.label || invoiceHead.status]);

        headData.push([]); // Spacer

        // Items Section
        let itemsHeader = [];
        let itemsData = [];

        if (isSelected("items")) {
            headData.push(["الأصناف"]);
            itemsHeader = ["المنتج", "الكمية", "السعر", "الخصم", "ض.ق.م %", "ضريبة أخرى %", "بونص", "الإجمالي"];
            itemsData = items.map(item => {
                const product = products.find((p) => p.id === item.product_id);
                const subtotal = (item.quantity * item.price) - item.discount;
                const vatAmount = subtotal * (item.vat_rate || 0) / 100;
                const taxAmount = subtotal * (item.tax_percent || 0) / 100;
                return [
                    product?.name || "",
                    item.quantity,
                    item.price,
                    `${item.discount_percent || 0}% (${item.discount})`,
                    item.vat_rate || 0,
                    item.tax_percent || 0,
                    item.bonus,
                    (subtotal + vatAmount + taxAmount).toFixed(2)
                ];
            });
        }

        // Footer Data based on selection
        const footerData = [];
        footerData.push([]); // Spacer
        if (isSelected("subtotal")) footerData.push(["المجموع الفرعي", invoiceHead.subtotal]);
        if (isSelected("additional_discount")) footerData.push(["الخصم الإضافي", invoiceHead.additional_discount]);
        if (isSelected("shipping_amount")) footerData.push(["الشحن", invoiceHead.shipping_amount]);
        if (isSelected("vat_amount")) footerData.push(["ضريبة القيمة المضافة", invoiceHead.vat_amount]);
        if (isSelected("tax_amount")) footerData.push(["ضريبة أخرى", invoiceHead.tax_amount]);
        if (isSelected("total_amount")) footerData.push(["الإجمالي النهائي", invoiceHead.total_amount]);
        if (isSelected("note")) footerData.push(["ملاحظات", invoiceHead.note]);

        const wsData = [
            ...headData,
            ...(isSelected("items") ? [itemsHeader, ...itemsData] : []),
            ...footerData
        ];

        const ws = XLSX.utils.aoa_to_sheet(wsData);
        XLSX.utils.book_append_sheet(wb, ws, "Sales Invoice");

        const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
        const blob = new Blob([wbout], { type: 'application/octet-stream' });
        saveAs(blob, `فاتورة_مبيعات_${invoiceHead.invoice_number || 'جديدة'}.xlsx`);
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
        { accessorKey: "quantity", header: "الكمية" },
        { accessorKey: "price", header: "السعر" },
        {
            accessorKey: "discount_percent",
            header: "الخصم %",
            Cell: ({ row }) => {
                const percent = row.original.discount_percent || 0;
                const val = row.original.discount || 0;
                return <Typography>{percent}% (${Number(val).toFixed(2)})</Typography>;
            }
        },
        { accessorKey: "tax_percent", header: "الضريبة %" },
        { accessorKey: "vat_rate", header: "ض.ق.م %" },
        { accessorKey: "bonus", header: "بونص" },
        {
            id: "total",
            header: "الإجمالي",
            Cell: ({ row }) => {
                const q = Number(row.original.quantity) || 0;
                const p = Number(row.original.price) || 0;
                const d = Number(row.original.discount) || 0;
                const tax = Number(row.original.tax_percent) || 0;
                const vat = Number(row.original.vat_rate) || 0;
                const subtotal = (q * p) - d;
                const taxAmount = (subtotal * tax) / 100;
                const vatAmount = (subtotal * vat) / 100;
                return <Typography>${(subtotal + taxAmount + vatAmount).toFixed(2)}</Typography>;
            },
        },
        {
            header: "إجراءات",
            Cell: ({ row }) => (
                <Box>
                    <IconButton color="primary" onClick={() => handleEditItem(row.original)} title="تعديل">
                        <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton color="error" onClick={() => removeItemTemp(row.original.tempId)} title="حذف">
                        <DeleteIcon fontSize="small" />
                    </IconButton>
                </Box>
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
                        {invoice ? "تعديل فاتورة بيع" : "إنشاء فاتورة بيع"}
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
                            <Grid item xs={12} md={3}>
                                <TextField
                                    fullWidth
                                    label="رقم الفاتورة"
                                    value={invoiceHead.invoice_number}
                                    onChange={(e) =>
                                        setInvoiceHead({ ...invoiceHead, invoice_number: e.target.value })
                                    }
                                    placeholder="تلقائي في حال تركه فارغاً"
                                    helperText="اتركه فارغاً للتوليد التلقائي"
                                />
                            </Grid>

                            <Grid item xs={12} md={3}>
                                <TextField
                                    select
                                    fullWidth
                                    label="العميل"
                                    value={invoiceHead.party_id}
                                    onChange={(e) =>
                                        setInvoiceHead({ ...invoiceHead, party_id: e.target.value })
                                    }
                                >
                                    <MenuItem value="">اختر العميل</MenuItem>
                                    {customers
                                        .filter((p) => p.party_type === "customer")
                                        .map((c) => (
                                            <MenuItem key={c.id} value={c.id}>
                                                {c.name} {c.city?.name ? `(${c.city.name})` : ""}
                                            </MenuItem>
                                        ))}
                                </TextField>
                                {selectedCustomer && (
                                    <Typography variant="caption">
                                        رقم الهاتف: {selectedCustomer.phone || "غير متوفر"}
                                    </Typography>
                                )}
                            </Grid>

                            <Grid item xs={12} md={3}>
                                <TextField
                                    select
                                    fullWidth
                                    label="المخزن"
                                    value={invoiceHead.warehouse_id}
                                    onChange={(e) =>
                                        setInvoiceHead({ ...invoiceHead, warehouse_id: e.target.value })
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

                            <Grid item xs={12} md={3}>
                                <TextField
                                    select
                                    fullWidth
                                    label="الحساب"
                                    value={invoiceHead.account_id}
                                    onChange={(e) =>
                                        setInvoiceHead({ ...invoiceHead, account_id: e.target.value })
                                    }
                                >
                                    <MenuItem value="">اختر الحساب</MenuItem>
                                    {accounts.map((acc) => (
                                        <MenuItem key={acc.id} value={acc.id}>
                                            {acc.name} ({acc.code})
                                        </MenuItem>
                                    ))}
                                </TextField>
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
                                    label="حالة الدفع"
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

                            <Grid item xs={12} md={3}>
                                <TextField
                                    select
                                    fullWidth
                                    label="حالة الفاتورة"
                                    value={invoiceHead.invoice_status}
                                    onChange={(e) =>
                                        setInvoiceHead({ ...invoiceHead, invoice_status: e.target.value })
                                    }
                                >
                                    {Object.entries(invoiceStatusConfig).map(([key, cfg]) => (
                                        <MenuItem key={key} value={key}>
                                            {cfg.label}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            </Grid>

                            <Grid item xs={12} md={3}>
                                <TextField
                                    select
                                    fullWidth
                                    label="الموظف"
                                    value={invoiceHead.employee_id}
                                    onChange={(e) =>
                                        setInvoiceHead({ ...invoiceHead, employee_id: e.target.value })
                                    }
                                >
                                    <MenuItem value="">اختر الموظف</MenuItem>
                                    {employees.map((e) => (
                                        <MenuItem key={e.id} value={e.id}>
                                            {e.name}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            </Grid>

                            <Grid item xs={12} md={3}>
                                <TextField
                                    select
                                    fullWidth
                                    label="مندوب التوزيع"
                                    value={invoiceHead.distributor_employee_id}
                                    onChange={(e) =>
                                        setInvoiceHead({ ...invoiceHead, distributor_employee_id: e.target.value })
                                    }
                                >
                                    <MenuItem value="">اختر المندوب</MenuItem>
                                    {employees.map((e) => (
                                        <MenuItem key={e.id} value={e.id}>
                                            {e.name}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            </Grid>
                        </Grid>
                    </CardContent>
                </Card>

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

                                        <Grid item xs={6} sm={3} md={2}>
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

                                        <Grid item xs={6} sm={3} md={2}>
                                            <TextField
                                                type="number"
                                                fullWidth
                                                label="السعر"
                                                value={itemForm.price}
                                                onChange={(e) =>
                                                    setItemForm((f) => ({ ...f, price: e.target.value }))
                                                }
                                                size="small"
                                            />
                                        </Grid>

                                        <Grid item xs={6} sm={3} md={1.5}>
                                            <TextField
                                                type="number"
                                                fullWidth
                                                label="الخصم %"
                                                value={itemForm.discount_percent || ""}
                                                onChange={(e) =>
                                                    setItemForm((f) => ({ ...f, discount_percent: e.target.value }))
                                                }
                                                size="small"
                                            />
                                        </Grid>

                                        <Grid item xs={6} sm={3} md={1.5}>
                                            <TextField
                                                type="number"
                                                fullWidth
                                                label="الضريبة %"
                                                value={itemForm.tax_percent}
                                                onChange={(e) =>
                                                    setItemForm((f) => ({ ...f, tax_percent: e.target.value }))
                                                }
                                                size="small"
                                            />
                                        </Grid>

                                        <Grid item xs={6} sm={3} md={1.5}>
                                            <TextField
                                                type="number"
                                                fullWidth
                                                label="بونص"
                                                value={itemForm.bonus}
                                                onChange={(e) =>
                                                    setItemForm((f) => ({ ...f, bonus: e.target.value }))
                                                }
                                                size="small"
                                            />
                                        </Grid>

                                        <Grid item xs={6} sm={3} md={1.5}>
                                            <TextField
                                                type="number"
                                                fullWidth
                                                label="ض.ق.م %"
                                                value={itemForm.vat_rate}
                                                onChange={(e) =>
                                                    setItemForm((f) => ({ ...f, vat_rate: e.target.value }))
                                                }
                                                size="small"
                                            />
                                        </Grid>

                                        <Grid item xs={6} sm={3} md={1.5}>
                                            <Stack direction="row" spacing={1}>
                                                <Button
                                                    variant="contained"
                                                    fullWidth
                                                    onClick={addItemTemp}
                                                    startIcon={editingItemTempId ? <SaveIcon /> : <AddIcon />}
                                                    color={editingItemTempId ? "warning" : "primary"}
                                                >
                                                    {editingItemTempId ? "تحديث" : "إضافة"}
                                                </Button>
                                                {editingItemTempId && (
                                                    <Button
                                                        variant="outlined"
                                                        color="secondary"
                                                        onClick={cancelEdit}
                                                    >
                                                        إلغاء
                                                    </Button>
                                                )}
                                            </Stack>
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
                        <Grid container spacing={2} sx={{ mb: 2 }}>
                            <Grid item xs={12} md={2}>
                                <TextField
                                    type="number"
                                    fullWidth
                                    label="خصم إضافي %"
                                    value={invoiceHead.additional_discount_percent}
                                    onChange={(e) => {
                                        const percent = Number(e.target.value) || 0;
                                        const amount = (Number(invoiceHead.subtotal) * percent) / 100;
                                        setInvoiceHead({
                                            ...invoiceHead,
                                            additional_discount_percent: e.target.value,
                                            additional_discount: amount.toFixed(2)
                                        });
                                    }}
                                    size="small"
                                />
                            </Grid>
                            <Grid item xs={12} md={2}>
                                <TextField
                                    type="number"
                                    fullWidth
                                    label="خصم إضافي (مبلغ)"
                                    value={invoiceHead.additional_discount}
                                    onChange={(e) => {
                                        const amount = Number(e.target.value) || 0;
                                        const percent = invoiceHead.subtotal > 0 ? (amount / Number(invoiceHead.subtotal)) * 100 : 0;
                                        setInvoiceHead({
                                            ...invoiceHead,
                                            additional_discount: e.target.value,
                                            additional_discount_percent: percent.toFixed(2)
                                        });
                                    }}
                                    size="small"
                                />
                            </Grid>
                            <Grid item xs={12} md={3}>
                                <TextField
                                    type="number"
                                    fullWidth
                                    label="ضريبة القيمة المضافة (إجمالي)"
                                    value={Number(invoiceHead.vat_amount || 0).toFixed(2)}
                                    InputProps={{ readOnly: true }}
                                    size="small"
                                    helperText="مجموع ضريبة الأصناف"
                                />
                            </Grid>
                            <Grid item xs={12} md={3}>
                                <TextField
                                    type="number"
                                    fullWidth
                                    label="نسبة ضريبة أخرى %"
                                    value={invoiceHead.tax_rate}
                                    onChange={(e) =>
                                        setInvoiceHead({ ...invoiceHead, tax_rate: e.target.value })
                                    }
                                    size="small"
                                />
                            </Grid>
                            <Grid item xs={12} md={3}>
                                <TextField
                                    type="number"
                                    fullWidth
                                    label="تكلفة الشحن"
                                    value={invoiceHead.shipping_amount}
                                    onChange={(e) =>
                                        setInvoiceHead({ ...invoiceHead, shipping_amount: e.target.value })
                                    }
                                    size="small"
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    multiline
                                    rows={2}
                                    label="ملاحظات"
                                    value={invoiceHead.note}
                                    onChange={(e) =>
                                        setInvoiceHead({ ...invoiceHead, note: e.target.value })
                                    }
                                />
                            </Grid>
                        </Grid>

                        <Stack spacing={1}>
                            <Stack direction="row" justifyContent="space-between">
                                <Typography>المجموع الفرعي:</Typography>
                                <Typography>${Number(invoiceHead.subtotal || 0).toFixed(2)}</Typography>
                            </Stack>
                            <Stack direction="row" justifyContent="space-between">
                                <Typography>إجمالي ضريبة القيمة المضافة:</Typography>
                                <Typography>${Number(invoiceHead.vat_amount || 0).toFixed(2)}</Typography>
                            </Stack>
                            <Stack direction="row" justifyContent="space-between">
                                <Typography>قيمة الضريبة الأخرى ({invoiceHead.tax_rate}%):</Typography>
                                <Typography>${Number(invoiceHead.tax_amount || 0).toFixed(2)}</Typography>
                            </Stack>
                            <Stack direction="row" justifyContent="space-between" alignItems="center">
                                <Typography variant="h6">
                                    <MoneyIcon /> إجمالي الفاتورة
                                </Typography>
                                <Typography variant="h4" color="primary">
                                    ${Number(invoiceHead.total_amount || 0).toFixed(2)}
                                </Typography>
                            </Stack>
                        </Stack>
                    </CardContent>
                </Card>
            </DialogContent>

            <DialogActions>
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
