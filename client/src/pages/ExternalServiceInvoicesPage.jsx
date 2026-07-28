import React, { useEffect, useState } from "react";
import {
    Box,
    Button,
    Chip,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    MenuItem,
    Typography,
    IconButton,
    Grid,
    Divider,
    Alert,
    FormControlLabel,
    Checkbox,
} from "@mui/material";
import { MaterialReactTable } from "material-react-table";
import {
    Add as AddIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
    CheckCircle as PostIcon,
    Cancel as CancelIcon,
    AddCircle as AddItemIcon,
    RemoveCircle as RemoveItemIcon,
} from "@mui/icons-material";
import axiosClient from "../api/axiosClient";
import { defaultTableProps } from "../config/tableConfig";
import ServicePaymentsManager from "../components/ServicePaymentsManager";

export default function ExternalServiceInvoicesPage() {
    const [invoices, setInvoices] = useState([]);
    const [loading, setLoading] = useState(true);

    // Dialog State
    const [dialogOpen, setDialogOpen] = useState(false);
    const [selectedInvoice, setSelectedInvoice] = useState(null);
    const [formData, setFormData] = useState({
        job_order_id: "",
        party_id: "",
        invoice_no: "",
        invoice_date: new Date().toISOString().split("T")[0],
        notes: "",
        apply_vat: true,
        items: [{ service_type_id: "", description: "", quantity: 1, unit_price: "", taxes: [] }],
    });

    // Dropdowns
    const [jobOrders, setJobOrders] = useState([]);
    const [suppliers, setSuppliers] = useState([]);
    const [serviceTypes, setServiceTypes] = useState([]);
    const [accounts, setAccounts] = useState([]);

    const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);

    useEffect(() => {
        fetchInvoices();
        fetchDropdowns();
    }, []);

    const fetchInvoices = async () => {
        try {
            const res = await axiosClient.get("/external-service-invoices");
            setInvoices(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const fetchDropdowns = async () => {
        try {
            const [jobOrdersRes, partiesRes, serviceTypesRes, accountsRes] = await Promise.all([
                axiosClient.get("/external-job-orders"),
                axiosClient.get("/parties"),
                axiosClient.get("/service-types"),
                axiosClient.get("/accounts"),
            ]);
            setJobOrders(jobOrdersRes.data);
            setSuppliers(partiesRes.data.filter((p) => p.party_type === "supplier"));
            setServiceTypes(serviceTypesRes.data);
            setAccounts(accountsRes.data);
        } catch (err) {
            console.error(err);
        }
    };

    // --- Handlers ---
    const handleCreate = () => {
        setSelectedInvoice(null);
        setFormData({
            job_order_id: "",
            party_id: "",
            invoice_no: "",
            invoice_date: new Date().toISOString().split("T")[0],
            notes: "",
            apply_vat: true,
            items: [{ service_type_id: "", description: "", quantity: 1, unit_price: "", taxes: [] }],
        });
        setDialogOpen(true);
    };

    const handleEdit = async (row) => {
        try {
            const res = await axiosClient.get(`/external-service-invoices/${row.id}`);
            const invoice = res.data;
            setSelectedInvoice(invoice);
            setFormData({
                job_order_id: invoice.job_order_id,
                party_id: invoice.party_id,
                invoice_no: invoice.invoice_no || "",
                invoice_date: invoice.invoice_date?.split("T")[0] || "",
                notes: invoice.notes || "",
                items: invoice.items?.length > 0
                    ? invoice.items.map((item) => ({
                        service_type_id: item.service_type_id,
                        description: item.description || "",
                        quantity: item.quantity,
                        unit_price: item.unit_price,
                        taxes: item.taxes || [],
                    }))
                    : [{ service_type_id: "", description: "", quantity: 1, unit_price: "", taxes: [] }],
                apply_vat: invoice.items?.some(item => item.taxes?.some(t => t.tax_name === "VAT")) ?? true,
            });
            setDialogOpen(true);
        } catch (err) {
            alert("Error loading invoice: " + err.message);
        }
    };

    const handleSave = async () => {
        try {
            const dataToSend = {
                ...formData,
                items: formData.items.map((item) => ({
                    ...item,
                    taxes: formData.apply_vat ? [{ tax_name: "VAT", tax_rate: 0.14 }] : [],
                })),
            };

            if (selectedInvoice) {
                await axiosClient.put(`/external-service-invoices/${selectedInvoice.id}`, dataToSend);
            } else {
                await axiosClient.post("/external-service-invoices", dataToSend);
            }
            setDialogOpen(false);
            fetchInvoices();
        } catch (err) {
            alert("Error saving invoice: " + (err.response?.data?.error || err.message));
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("هل تريد حذف هذه الفاتورة؟")) {
            try {
                await axiosClient.delete(`/external-service-invoices/${id}`);
                fetchInvoices();
            } catch (err) {
                alert("Error: " + (err.response?.data?.error || err.message));
            }
        }
    };

    const handlePost = async (id) => {
        if (window.confirm("هل تريد ترحيل هذه الفاتورة؟ لن يمكن تعديلها بعد ذلك.")) {
            try {
                await axiosClient.post(`/external-service-invoices/${id}/post`, {});
                fetchInvoices();
                alert("تم ترحيل الفاتورة بنجاح");
            } catch (err) {
                alert("Error: " + (err.response?.data?.error || err.message));
            }
        }
    };

    const handleCancel = async (id) => {
        if (window.confirm("هل تريد إلغاء هذه الفاتورة؟")) {
            try {
                await axiosClient.post(`/external-service-invoices/${id}/cancel`, {});
                fetchInvoices();
                alert("تم إلغاء الفاتورة");
            } catch (err) {
                alert("Error: " + (err.response?.data?.error || err.message));
            }
        }
    };

    // --- Item Handlers ---
    const handleAddItem = () => {
        setFormData({
            ...formData,
            items: [...formData.items, { service_type_id: "", description: "", quantity: 1, unit_price: "", taxes: [] }],
        });
    };

    const handleRemoveItem = (index) => {
        const newItems = [...formData.items];
        newItems.splice(index, 1);
        setFormData({ ...formData, items: newItems.length > 0 ? newItems : [{ service_type_id: "", description: "", quantity: 1, unit_price: "", taxes: [] }] });
    };

    const handleItemChange = (index, field, value) => {
        const newItems = [...formData.items];
        newItems[index][field] = value;
        setFormData({ ...formData, items: newItems });
    };

    const calculateTotal = () => {
        let subTotal = 0;
        formData.items.forEach((item) => {
            const lineTotal = (parseFloat(item.quantity) || 0) * (parseFloat(item.unit_price) || 0);
            subTotal += lineTotal;
        });
        const taxTotal = formData.apply_vat ? subTotal * 0.14 : 0;
        return { subTotal, taxTotal, total: subTotal + taxTotal };
    };

    const getStatusChip = (status) => {
        switch (status) {
            case "Draft":
                return <Chip label="مسودة" color="default" size="small" />;
            case "Posted":
                return <Chip label="مرحّلة" color="success" size="small" />;
            case "Partially Paid":
                return <Chip label="مدفوعة جزئياً" color="warning" size="small" />;
            case "Paid":
                return <Chip label="مدفوعة" color="primary" size="small" />;
            case "Cancelled":
                return <Chip label="ملغاة" color="error" size="small" />;
            default:
                return <Chip label={status} size="small" />;
        }
    };

    const handleOpenPayment = (invoice) => {
        setSelectedInvoice(invoice);
        setPaymentDialogOpen(true);
    };

    const columns = [
        { accessorKey: "id", header: "#", size: 60 },
        { accessorKey: "invoice_no", header: "رقم الفاتورة" },
        { accessorKey: "invoice_date", header: "التاريخ" },
        {
            accessorKey: "job_order.warehouse.name",
            header: "المخزن",
            size: 100,
            Cell: ({ cell }) => cell.getValue() || "-",
        },
        {
            accessorKey: "party_id",
            header: "المورد",
            Cell: ({ cell }) => suppliers.find((s) => s.id === cell.getValue())?.name || cell.getValue(),
        },
        {
            accessorKey: "total_amount",
            header: "الإجمالي",
            Cell: ({ cell }) => parseFloat(cell.getValue() || 0).toLocaleString(),
        },
        {
            accessorKey: "paid_amount",
            header: "المدفوع",
            Cell: ({ cell }) => (
                <Typography variant="body2" color="success.main">
                    {parseFloat(cell.getValue() || 0).toLocaleString()}
                </Typography>
            ),
        },
        {
            accessorKey: "balance",
            header: "المتبقي",
            Cell: ({ cell }) => (
                <Typography variant="body2" color={cell.getValue() > 0 ? "error.main" : "text.secondary"}>
                    {parseFloat(cell.getValue() || 0).toLocaleString()}
                </Typography>
            ),
        },
        {
            accessorKey: "status",
            header: "الحالة",
            Cell: ({ cell }) => getStatusChip(cell.getValue()),
        },
        {
            header: "إجراءات",
            Cell: ({ row }) => (
                <Box sx={{ display: "flex", gap: 0.5 }}>
                    {row.original.status === "Draft" && (
                        <>
                            <IconButton onClick={() => handleEdit(row.original)} color="primary" size="small">
                                <EditIcon />
                            </IconButton>
                            <IconButton color="error" size="small" onClick={() => handleDelete(row.original.id)}>
                                <DeleteIcon />
                            </IconButton>
                            <Button variant="contained" size="small" color="success" startIcon={<PostIcon />} onClick={() => handlePost(row.original.id)}>
                                ترحيل
                            </Button>
                        </>
                    )}
                    {(row.original.status === "Posted" || row.original.status === "Partially Paid") && (
                        <>
                            <Button variant="contained" size="small" color="info" onClick={() => handleOpenPayment(row.original)}>
                                المدفوعات
                            </Button>
                            {row.original.status === "Posted" && (
                                <Button variant="outlined" size="small" color="error" startIcon={<CancelIcon />} onClick={() => handleCancel(row.original.id)}>
                                    إلغاء
                                </Button>
                            )}
                        </>
                    )}
                    {row.original.status === "Paid" && (
                        <Button variant="outlined" size="small" color="info" onClick={() => handleOpenPayment(row.original)}>
                            عرض المدفوعات
                        </Button>
                    )}
                </Box>
            ),
        },
    ];

    const totals = calculateTotal();

    return (
        <Box p={2}>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                <Typography variant="h5">فواتير الخدمات الخارجية</Typography>
                <Button variant="contained" startIcon={<AddIcon />} onClick={handleCreate}>
                    فاتورة جديدة
                </Button>
            </Box>

            <MaterialReactTable {...defaultTableProps} columns={columns} data={invoices} state={{ isLoading: loading }} />

            {/* Payment Dialog */}
            <Dialog open={paymentDialogOpen} onClose={() => { setPaymentDialogOpen(false); fetchInvoices(); }} fullWidth maxWidth="md">
                <DialogTitle>مدفوعات الفاتورة {selectedInvoice?.invoice_no ? `رقم ${selectedInvoice.invoice_no}` : `رقم ${selectedInvoice?.id}`}</DialogTitle>
                <DialogContent>
                    {selectedInvoice && <ServicePaymentsManager invoiceId={selectedInvoice.id} />}
                </DialogContent>
            </Dialog>

            <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} fullWidth maxWidth="md">
                <DialogTitle>{selectedInvoice ? "تعديل فاتورة" : "فاتورة خدمة جديدة"}</DialogTitle>
                <DialogContent>
                    <Grid container spacing={2} sx={{ mt: 1 }}>
                        <Grid item xs={6}>
                            <TextField
                                select
                                label="أمر التشغيل"
                                fullWidth
                                required
                                value={formData.job_order_id}
                                onChange={(e) => setFormData({ ...formData, job_order_id: e.target.value })}
                            >
                                {jobOrders.map((jo) => (
                                    <MenuItem key={jo.id} value={jo.id}>
                                        أمر #{jo.id} - {jo.status}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                select
                                label="المورد"
                                fullWidth
                                required
                                value={formData.party_id}
                                onChange={(e) => setFormData({ ...formData, party_id: e.target.value })}
                            >
                                {suppliers.map((s) => (
                                    <MenuItem key={s.id} value={s.id}>
                                        {s.name}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                label="رقم فاتورة المورد"
                                fullWidth
                                value={formData.invoice_no}
                                onChange={(e) => setFormData({ ...formData, invoice_no: e.target.value })}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                label="تاريخ الفاتورة"
                                type="date"
                                fullWidth
                                required
                                InputLabelProps={{ shrink: true }}
                                value={formData.invoice_date}
                                onChange={(e) => setFormData({ ...formData, invoice_date: e.target.value })}
                            />
                        </Grid>
                    </Grid>

                    <Divider sx={{ my: 3 }} />
                    <Typography variant="subtitle1" gutterBottom>
                        بنود الفاتورة
                    </Typography>

                    {formData.items.map((item, index) => (
                        <Grid container spacing={2} key={index} sx={{ mb: 2, alignItems: "center" }}>
                            <Grid item xs={3}>
                                <TextField
                                    select
                                    label="نوع الخدمة"
                                    fullWidth
                                    size="small"
                                    value={item.service_type_id}
                                    onChange={(e) => handleItemChange(index, "service_type_id", e.target.value)}
                                >
                                    {serviceTypes.map((st) => (
                                        <MenuItem key={st.id} value={st.id}>
                                            {st.name}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            </Grid>
                            <Grid item xs={3}>
                                <TextField
                                    label="الوصف"
                                    fullWidth
                                    size="small"
                                    value={item.description}
                                    onChange={(e) => handleItemChange(index, "description", e.target.value)}
                                />
                            </Grid>
                            <Grid item xs={2}>
                                <TextField
                                    label="الكمية"
                                    type="number"
                                    fullWidth
                                    size="small"
                                    value={item.quantity}
                                    onChange={(e) => handleItemChange(index, "quantity", e.target.value)}
                                />
                            </Grid>
                            <Grid item xs={2}>
                                <TextField
                                    label="سعر الوحدة"
                                    type="number"
                                    fullWidth
                                    size="small"
                                    value={item.unit_price}
                                    onChange={(e) => handleItemChange(index, "unit_price", e.target.value)}
                                />
                            </Grid>
                            <Grid item xs={1}>
                                <Typography variant="body2">
                                    {((parseFloat(item.quantity) || 0) * (parseFloat(item.unit_price) || 0)).toLocaleString()}
                                </Typography>
                            </Grid>
                            <Grid item xs={1}>
                                <IconButton color="error" onClick={() => handleRemoveItem(index)}>
                                    <RemoveItemIcon />
                                </IconButton>
                            </Grid>
                        </Grid>
                    ))}

                    <Button startIcon={<AddItemIcon />} onClick={handleAddItem}>
                        إضافة بند
                    </Button>

                    <Divider sx={{ my: 2 }} />
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={formData.apply_vat}
                                    onChange={(e) => setFormData({ ...formData, apply_vat: e.target.checked })}
                                />
                            }
                            label="إضافة ضريبة القيمة المضافة (14%)"
                        />
                        <Box sx={{ display: "flex", gap: 4 }}>
                            <Typography>الإجمالي قبل الضريبة: {totals.subTotal.toLocaleString()}</Typography>
                            <Typography>الضريبة ({formData.apply_vat ? "14%" : "0%"}): {totals.taxTotal.toLocaleString()}</Typography>
                            <Typography variant="h6">الإجمالي: {totals.total.toLocaleString()}</Typography>
                        </Box>
                    </Box>

                    <Grid container spacing={2} sx={{ mt: 2 }}>
                        <Grid item xs={12}>
                            <TextField
                                label="ملاحظات"
                                fullWidth
                                multiline
                                rows={2}
                                value={formData.notes}
                                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                            />
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDialogOpen(false)}>إلغاء</Button>
                    <Button variant="contained" onClick={handleSave}>
                        حفظ
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}
