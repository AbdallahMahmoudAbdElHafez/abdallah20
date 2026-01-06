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
    useTheme,
    Divider,
    Tooltip,
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
    People as PeopleIcon,
} from "@mui/icons-material";
import ExcelJS from "exceljs";
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
import ExcelExportDialog from "./ExcelExportDialog";

const statusConfig = {
    unpaid: { color: "default", label: "غير مدفوع" },
    paid: { color: "success", label: "مدفوع" },
    partial: { color: "warning", label: "جزئي" },
    cancelled: { color: "error", label: "ملغي" },
};

export default function SalesInvoiceDialog({
    open,
    onClose,
    invoice,
    itemsInit = [],
    onSave,
}) {
    const theme = useTheme();
    const dispatch = useDispatch();
    const customers = useSelector((s) => s.parties?.items ?? []);
    const products = useSelector((s) => s.products?.items ?? []);
    const warehouses = useSelector((s) => s.warehouses?.items ?? []);
    const employees = useSelector((s) => s.employees?.list ?? []);

    const [loadingMeta, setLoadingMeta] = useState(false);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [showItemForm, setShowItemForm] = useState(false);
    const [exportDialogOpen, setExportDialogOpen] = useState(false);

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
        additional_discount_percent: 0,
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
        discount_percent: "",
        tax_percent: 0,
        bonus: 0,
    });

    useEffect(() => {
        setLoadingMeta(true);
        Promise.all([
            dispatch(fetchParties()),
            // dispatch(fetchProducts()), // Don't fetch all initially, wait for warehouse selection or fetch generic
            dispatch(fetchWarehouses()),
            dispatch(fetchEmployees()),
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
                invoice_date: invoice.invoice_date ?? new Date().toISOString().split("T")[0],
                due_date: invoice.due_date ?? "",
                invoice_type: invoice.invoice_type ?? "normal",
                status: invoice.status ?? "unpaid",
                shipping_amount: Number(invoice.shipping_amount) || 0,
                subtotal: Number(invoice.subtotal) || 0,
                additional_discount: Number(invoice.additional_discount) || 0,
                additional_discount_percent: invoice.subtotal > 0 ? (Number(invoice.additional_discount) / Number(invoice.subtotal)) * 100 : 0,
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
                additional_discount_percent: 0,
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

        const newItem = {
            ...itemForm,
            tempId: Date.now() + Math.random(),
            quantity: qty,
            price: price,
            discount: discountValue,
            discount_percent: discountPercent,
            tax_percent: Number(itemForm.tax_percent) || 0,
            bonus: Number(itemForm.bonus) || 0,
        };
        setItems((prev) => [...prev, newItem]);
        setItemForm({
            product_id: "",
            warehouse_id: "",
            quantity: newItem.quantity, // Retain quantity
            price: "",
            discount: "",
            discount_percent: newItem.discount_percent, // Retain discount percent
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
    ];

    const handleExportExcel = async (selectedColumns) => {
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet("Invoice", {
            views: [{ rightToLeft: true }]
        });

        // Helper to check if column is selected
        const isSelected = (key) => selectedColumns.includes(key);

        // Styling Constants
        const colors = {
            primary: "1976d2",
            secondary: "f50057",
            header: "f8f9fa",
            border: "dee2e6"
        };

        // 1. Header Section
        worksheet.mergeCells("A1:G2");
        const titleCell = worksheet.getCell("A1");
        titleCell.value = `فاتورة مبيعات رقم: ${invoiceHead.invoice_number || "جديدة"}`;
        titleCell.font = { name: "Arial", size: 20, bold: true, color: { argb: "FFFFFF" } };
        titleCell.alignment = { vertical: "middle", horizontal: "center" };
        titleCell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: colors.primary } };

        let currRow = 4;

        // 2. Metadata Info Table
        const addMetadataRow = (label, value) => {
            const row = worksheet.getRow(currRow);
            row.getCell(1).value = label;
            row.getCell(2).value = value;

            row.getCell(1).font = { bold: true };
            row.getCell(1).fill = { type: "pattern", pattern: "solid", fgColor: { argb: colors.header } };
            row.getCell(1).border = { bottom: { style: 'thin' }, left: { style: 'thin' } };
            row.getCell(2).border = { bottom: { style: 'thin' }, right: { style: 'thin' } };

            currRow++;
        };

        if (isSelected("invoice_number")) addMetadataRow("رقم الفاتورة", invoiceHead.invoice_number);
        if (isSelected("customer")) addMetadataRow("العميل", selectedCustomer?.name || "");
        if (isSelected("invoice_date")) addMetadataRow("التاريخ", invoiceHead.invoice_date);
        if (isSelected("due_date")) addMetadataRow("تاريخ الاستحقاق", invoiceHead.due_date);
        if (isSelected("warehouse")) addMetadataRow("المخزن", warehouses.find(w => w.id === invoiceHead.warehouse_id)?.name || "");
        if (isSelected("employee")) addMetadataRow("الموظف", employees.find(e => e.id === invoiceHead.employee_id)?.name || "");
        if (isSelected("invoice_type")) addMetadataRow("نوع الفاتورة", invoiceHead.invoice_type === 'opening' ? 'رصيد افتتاحي' : 'فاتورة عادية');
        if (isSelected("status")) addMetadataRow("الحالة", statusConfig[invoiceHead.status]?.label || invoiceHead.status);

        currRow += 2;

        // 3. Items Section
        if (isSelected("items")) {
            const itemsHeaderRow = worksheet.getRow(currRow);
            const headers = ["المنتج", "الكمية", "السعر", "الخصم", "الضريبة %", "بونص", "الإجمالي"];

            headers.forEach((h, i) => {
                const cell = itemsHeaderRow.getCell(i + 1);
                cell.value = h;
                cell.font = { bold: true, color: { argb: "FFFFFF" } };
                cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "444444" } };
                cell.alignment = { horizontal: "center" };
                cell.border = { top: { style: 'thin' }, bottom: { style: 'thin' }, left: { style: 'thin' }, right: { style: 'thin' } };
            });

            currRow++;

            items.forEach((item) => {
                const product = products.find((p) => p.id === item.product_id);
                const row = worksheet.getRow(currRow);

                const subtotal = (Number(item.quantity) * Number(item.price)) - Number(item.discount);
                const taxAmount = (subtotal * (Number(item.tax_percent) || 0)) / 100;
                const total = subtotal + taxAmount;

                row.getCell(1).value = product?.name || "";
                row.getCell(2).value = Number(item.quantity);
                row.getCell(3).value = Number(item.price);
                row.getCell(4).value = Number(item.discount);
                row.getCell(5).value = Number(item.tax_percent) || 0;
                row.getCell(6).value = Number(item.bonus) || 0;
                row.getCell(7).value = Number(total.toFixed(2));

                // Apply borders to cells
                for (let i = 1; i <= 7; i++) {
                    row.getCell(i).border = { top: { style: 'thin' }, bottom: { style: 'thin' }, left: { style: 'thin' }, right: { style: 'thin' } };
                    if (i > 1) row.getCell(i).alignment = { horizontal: "center" };
                }
                currRow++;
            });
        }

        currRow += 2;

        // 4. Financial Summary (Totals)
        const addSummaryRow = (label, value, isGrandTotal = false) => {
            const row = worksheet.getRow(currRow);
            worksheet.mergeCells(`E${currRow}:F${currRow}`);
            row.getCell(5).value = label;
            row.getCell(7).value = Number(Number(value).toFixed(2));

            row.getCell(5).font = { bold: true };
            row.getCell(5).alignment = { horizontal: "left" };
            row.getCell(7).alignment = { horizontal: "center" };

            if (isGrandTotal) {
                row.getCell(5).fill = { type: "pattern", pattern: "solid", fgColor: { argb: colors.secondary } };
                row.getCell(5).font = { bold: true, color: { argb: "FFFFFF" } };
                row.getCell(7).fill = { type: "pattern", pattern: "solid", fgColor: { argb: colors.secondary } };
                row.getCell(7).font = { bold: true, color: { argb: "FFFFFF" }, size: 14 };
            } else {
                row.getCell(5).fill = { type: "pattern", pattern: "solid", fgColor: { argb: colors.header } };
                row.getCell(7).border = { bottom: { style: 'thin' }, right: { style: 'thin' }, left: { style: 'thin' } };
            }
            currRow++;
        };

        if (isSelected("subtotal")) addSummaryRow("المجموع الفرعي", invoiceHead.subtotal);
        if (isSelected("additional_discount")) addSummaryRow("الخصم الإضافي", invoiceHead.additional_discount);
        if (isSelected("shipping_amount")) addSummaryRow("الشحن", invoiceHead.shipping_amount);
        if (isSelected("vat_amount")) addSummaryRow("ضريبة القيمة المضافة", invoiceHead.vat_amount);
        if (isSelected("tax_amount")) addSummaryRow("ضريبة أخرى", invoiceHead.tax_amount);
        if (isSelected("total_amount")) addSummaryRow("الإجمالي النهائي", invoiceHead.total_amount, true);

        // Set column widths
        worksheet.getColumn(1).width = 30;
        worksheet.getColumn(2).width = 12;
        worksheet.getColumn(3).width = 12;
        worksheet.getColumn(4).width = 12;
        worksheet.getColumn(5).width = 12;
        worksheet.getColumn(6).width = 12;
        worksheet.getColumn(7).width = 18;

        const buffer = await workbook.xlsx.writeBuffer();
        const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        saveAs(blob, `Invoice_${invoiceHead.invoice_number || 'New'}.xlsx`);
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
        { accessorKey: "bonus", header: "بونص" },
        {
            id: "total",
            header: "الإجمالي",
            Cell: ({ row }) => {
                const q = Number(row.original.quantity) || 0;
                const p = Number(row.original.price) || 0;
                const d = Number(row.original.discount) || 0;
                const tax = Number(row.original.tax_percent) || 0;
                const subtotal = (q * p) - d;
                const taxAmount = (subtotal * tax) / 100;
                return <Typography>{(subtotal + taxAmount).toFixed(2)} ج.م</Typography>;
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

    const selectedCustomer = customers.find((c) => c.id === invoiceHead.party_id);

    return (
        <Dialog
            open={open}
            onClose={onClose}
            fullWidth
            maxWidth="lg"
            PaperProps={{
                sx: {
                    borderRadius: 4,
                    backgroundImage: 'none',
                    bgcolor: 'background.default'
                }
            }}
        >
            <DialogTitle sx={{
                p: 3,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                bgcolor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)',
                borderBottom: `1px solid ${theme.palette.divider}`
            }}>
                <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
                    <Box sx={{
                        p: 1,
                        borderRadius: 2,
                        bgcolor: 'primary.main',
                        color: 'primary.contrastText',
                        display: 'flex'
                    }}>
                        <ReceiptIcon />
                    </Box>
                    <Box>
                        <Typography variant="h6" sx={{ fontWeight: 800 }}>
                            {invoice ? "تعديل فاتورة مبيعات" : "إنشاء فاتورة مبيعات جديدة"}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                            يرجى إكمال البيانات المطلوبة بدقة لضمان صحة القيود المحاسبية.
                        </Typography>
                    </Box>
                </Box>
                <Box>
                    {invoice && (
                        <Tooltip title="تصدير Excel">
                            <IconButton onClick={() => setExportDialogOpen(true)}>
                                <FileDownloadIcon />
                            </IconButton>
                        </Tooltip>
                    )}
                    <IconButton onClick={onClose} sx={{ ml: 1 }}>
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

            <DialogContent sx={{ p: 4 }}>
                {error && (
                    <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }} onClose={() => setError("")}>
                        {error}
                    </Alert>
                )}

                <Grid container spacing={3}>
                    {/* Header Info Section */}
                    <Grid item xs={12} md={8}>
                        <Paper variant="outlined" sx={{ p: 3, borderRadius: 3, mb: 3 }}>
                            <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                                <PeopleIcon fontSize="small" color="primary" /> بيانات العميل واللوجستيات
                            </Typography>
                            <Grid container spacing={2}>
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        select
                                        fullWidth
                                        label="العميل"
                                        value={invoiceHead.party_id}
                                        onChange={(e) => setInvoiceHead({ ...invoiceHead, party_id: e.target.value })}
                                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                                    >
                                        <MenuItem value="">اختر العميل</MenuItem>
                                        {customers.filter((p) => p.party_type === "customer").map((c) => (
                                            <MenuItem key={c.id} value={c.id}>{c.name}</MenuItem>
                                        ))}
                                    </TextField>
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        select
                                        fullWidth
                                        label="المخزن"
                                        value={invoiceHead.warehouse_id}
                                        onChange={(e) => setInvoiceHead({ ...invoiceHead, warehouse_id: e.target.value })}
                                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                                    >
                                        <MenuItem value="">اختر المخزن</MenuItem>
                                        {warehouses.map((w) => (
                                            <MenuItem key={w.id} value={w.id}>{w.name}</MenuItem>
                                        ))}
                                    </TextField>
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        type="date"
                                        fullWidth
                                        label="تاريخ الفاتورة"
                                        InputLabelProps={{ shrink: true }}
                                        value={invoiceHead.invoice_date}
                                        onChange={(e) => setInvoiceHead({ ...invoiceHead, invoice_date: e.target.value })}
                                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                                    />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        select
                                        fullWidth
                                        label="الموظف المسئول"
                                        value={invoiceHead.employee_id}
                                        onChange={(e) => setInvoiceHead({ ...invoiceHead, employee_id: e.target.value })}
                                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                                    >
                                        <MenuItem value="">اختر الموظف</MenuItem>
                                        {employees.map((e) => (
                                            <MenuItem key={e.id} value={e.id}>{e.name}</MenuItem>
                                        ))}
                                    </TextField>
                                </Grid>
                            </Grid>
                        </Paper>

                        {/* Items Section */}
                        {invoiceHead.invoice_type === "normal" ? (
                            <Paper variant="outlined" sx={{ borderRadius: 3, overflow: 'hidden' }}>
                                <Box sx={{ p: 2.5, display: "flex", justifyContent: "space-between", alignItems: "center", bgcolor: 'rgba(0,0,0,0.01)' }}>
                                    <Typography variant="subtitle2" sx={{ fontWeight: 700, display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <InventoryIcon fontSize="small" color="primary" /> أصناف الفاتورة ({items.length})
                                    </Typography>
                                    <Button
                                        variant="contained"
                                        size="small"
                                        startIcon={showItemForm ? <ExpandLessIcon /> : <AddIcon />}
                                        onClick={() => setShowItemForm(!showItemForm)}
                                        sx={{ borderRadius: 2 }}
                                    >
                                        {showItemForm ? "إغلاق النموذج" : "إضافة صنف"}
                                    </Button>
                                </Box>
                                <Divider />

                                <Collapse in={showItemForm}>
                                    <Box sx={{ p: 3, bgcolor: 'action.hover' }}>
                                        <Grid container spacing={2}>
                                            <Grid item xs={12} md={5}>
                                                <TextField
                                                    select
                                                    fullWidth
                                                    label="المنتج"
                                                    value={itemForm.product_id}
                                                    onChange={(e) => handleItemProductChange(e.target.value)}
                                                    size="small"
                                                >
                                                    <MenuItem value="">اختر المنتج</MenuItem>
                                                    {products.map((p) => (
                                                        <MenuItem key={p.id} value={p.id}>{p.name}</MenuItem>
                                                    ))}
                                                </TextField>
                                            </Grid>
                                            <Grid item xs={6} md={2}>
                                                <TextField
                                                    type="number"
                                                    fullWidth
                                                    label="الكمية"
                                                    value={itemForm.quantity}
                                                    onChange={(e) => setItemForm((f) => ({ ...f, quantity: e.target.value }))}
                                                    size="small"
                                                />
                                            </Grid>
                                            <Grid item xs={6} md={2.5}>
                                                <TextField
                                                    type="number"
                                                    fullWidth
                                                    label="السعر"
                                                    value={itemForm.price}
                                                    onChange={(e) => setItemForm((f) => ({ ...f, price: e.target.value }))}
                                                    size="small"
                                                />
                                            </Grid>
                                            <Grid item xs={12} md={2.5}>
                                                <Button
                                                    variant="contained"
                                                    fullWidth
                                                    onClick={addItemTemp}
                                                    sx={{ height: 40, borderRadius: 2 }}
                                                >
                                                    إضافة للجدول
                                                </Button>
                                            </Grid>
                                        </Grid>
                                    </Box>
                                    <Divider />
                                </Collapse>

                                <Box sx={{ p: 0 }}>
                                    {loadingMeta ? (
                                        <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}><CircularProgress /></Box>
                                    ) : (
                                        <MaterialReactTable
                                            columns={itemColumns}
                                            data={items}
                                            enablePagination={false}
                                            enableTopToolbar={false}
                                            muiTablePaperProps={{ elevation: 0 }}
                                            muiTableHeadCellProps={{ sx: { bgcolor: 'background.default', py: 2 } }}
                                        />
                                    )}
                                </Box>
                            </Paper>
                        ) : (
                            <Paper variant="outlined" sx={{ p: 3, borderRadius: 3, borderStyle: 'dashed', textAlign: 'center' }}>
                                <MoneyIcon sx={{ fontSize: 40, color: 'primary.main', mb: 1, opacity: 0.5 }} />
                                <Typography variant="h6">رصيد افتتاحي</Typography>
                                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                    يرجى إدخال المبلغ الإجمالي مباشرة في قسم الأسعار أدناه.
                                </Typography>
                            </Paper>
                        )}
                    </Grid>

                    {/* Summary Section */}
                    <Grid item xs={12} md={4}>
                        <Stack spacing={3}>
                            <Paper variant="outlined" sx={{ p: 3, borderRadius: 3 }}>
                                <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <MoneyIcon fontSize="small" color="primary" /> الأسعار والضرائب
                                </Typography>
                                <Stack spacing={2}>
                                    <TextField
                                        label="الخصم الإضافي %"
                                        type="number"
                                        fullWidth
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
                                    <TextField
                                        label="ضريبة القيمة المضافة %"
                                        type="number"
                                        fullWidth
                                        value={invoiceHead.vat_rate}
                                        onChange={(e) => setInvoiceHead({ ...invoiceHead, vat_rate: e.target.value })}
                                        size="small"
                                    />
                                    <TextField
                                        label="تكلفة الشحن"
                                        type="number"
                                        fullWidth
                                        value={invoiceHead.shipping_amount}
                                        onChange={(e) => setInvoiceHead({ ...invoiceHead, shipping_amount: e.target.value })}
                                        size="small"
                                    />
                                </Stack>

                                <Box sx={{ mt: 4, pt: 2, borderTop: `1px dashed ${theme.palette.divider}` }}>
                                    <Stack spacing={1.5}>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                            <Typography variant="body2" color="text.secondary">المجموع قبل الضريبة</Typography>
                                            <Typography variant="body2" sx={{ fontWeight: 700 }}>{Number(invoiceHead.subtotal).toLocaleString()} ج.م</Typography>
                                        </Box>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                            <Typography variant="body2" color="text.secondary">إجمالي الضريبة</Typography>
                                            <Typography variant="body2" sx={{ fontWeight: 700 }}>{Number(invoiceHead.vat_amount).toLocaleString()} ج.م</Typography>
                                        </Box>
                                        <Box sx={{
                                            mt: 2,
                                            p: 2,
                                            borderRadius: 2,
                                            bgcolor: 'primary.main',
                                            color: 'primary.contrastText',
                                            textAlign: 'center',
                                            boxShadow: `0 4px 12px ${theme.palette.primary.main}40`
                                        }}>
                                            <Typography variant="caption" sx={{ opacity: 0.8, textTransform: 'uppercase', letterSpacing: 1 }}>الإجمالي النهائي</Typography>
                                            <Typography variant="h4" sx={{ fontWeight: 900 }}>
                                                {Number(invoiceHead.total_amount).toLocaleString()} <Typography component="span" variant="h6">ج.م</Typography>
                                            </Typography>
                                        </Box>
                                    </Stack>
                                </Box>
                            </Paper>

                            <Paper variant="outlined" sx={{ p: 3, borderRadius: 3 }}>
                                <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 2 }}>إعدادات متقدمة</Typography>
                                <Grid container spacing={2}>
                                    <Grid item xs={12}>
                                        <TextField
                                            select
                                            fullWidth
                                            label="نوع الفاتورة"
                                            value={invoiceHead.invoice_type}
                                            onChange={(e) => setInvoiceHead({ ...invoiceHead, invoice_type: e.target.value })}
                                            size="small"
                                        >
                                            <MenuItem value="normal">فاتورة عادية</MenuItem>
                                            <MenuItem value="opening">رصيد افتتاحي</MenuItem>
                                        </TextField>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <TextField
                                            select
                                            fullWidth
                                            label="الحالة"
                                            value={invoiceHead.status}
                                            onChange={(e) => setInvoiceHead({ ...invoiceHead, status: e.target.value })}
                                            size="small"
                                        >
                                            {Object.entries(statusConfig).map(([key, cfg]) => (
                                                <MenuItem key={key} value={key}>{cfg.label}</MenuItem>
                                            ))}
                                        </TextField>
                                    </Grid>
                                </Grid>
                            </Paper>
                        </Stack>
                    </Grid>
                </Grid>
            </DialogContent>

            <DialogActions sx={{ p: 3, borderTop: `1px solid ${theme.palette.divider}`, bgcolor: 'action.hover' }}>
                <Button onClick={onClose} sx={{ borderRadius: 2, px: 3 }}>إلغاء</Button>
                <Button
                    variant="contained"
                    onClick={handleSaveAll}
                    disabled={saving || loadingMeta}
                    startIcon={saving ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
                    sx={{ borderRadius: 2, px: 4, py: 1 }}
                >
                    {saving ? "جاري المعالجة..." : invoice ? "حفظ التغييرات" : "اعتماد الفاتورة"}
                </Button>
            </DialogActions>
        </Dialog>
    );
}
