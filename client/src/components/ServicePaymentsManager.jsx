import React, { useEffect, useState } from "react";
import {
    Box,
    Button,
    CircularProgress,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    MenuItem,
} from "@mui/material";
import { MaterialReactTable } from "material-react-table";
import axiosClient from "../api/axiosClient";

export default function ServicePaymentsManager({ invoiceId }) {
    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(false);
    
    // Dropdown Data
    const [accounts, setAccounts] = useState([]);
    const [employees, setEmployees] = useState([]);

    // ====== state for editing/adding ======
    const [dialogOpen, setDialogOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        id: "",
        external_service_invoice_id: invoiceId,
        amount: "",
        payment_date: new Date().toISOString().split("T")[0],
        payment_method: "cash",
        account_id: "",
        reference_number: "",
        note: "",
        cheque_number: "",
        issue_date: "",
        due_date: "",
        employee_id: ""
    });

    useEffect(() => {
        if (invoiceId) {
            fetchPayments();
        }
        fetchDropdowns();
    }, [invoiceId]);

    const fetchPayments = async () => {
        setLoading(true);
        try {
            const res = await axiosClient.get("/service-payments", {
                params: { external_service_invoice_id: invoiceId }
            });
            setPayments(res.data);
        } catch (error) {
            console.error("Error fetching payments", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchDropdowns = async () => {
        try {
            const [accRes, empRes] = await Promise.all([
                axiosClient.get("/accounts"),
                axiosClient.get("/employees")
            ]);
            setAccounts(accRes.data);
            setEmployees(empRes.data);
        } catch (error) {
            console.error("Error fetching dropdowns", error);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("هل أنت متأكد من حذف هذا السند؟")) {
            try {
                await axiosClient.delete(`/service-payments/${id}`);
                fetchPayments();
            } catch (error) {
                alert("خطأ في حذف الدفعة: " + (error.response?.data?.message || error.message));
            }
        }
    };

    const handleOpenDialog = (payment = null) => {
        if (payment) {
            setIsEditing(true);
            setFormData({
                id: payment.id,
                external_service_invoice_id: payment.external_service_invoice_id,
                amount: payment.amount,
                payment_date: payment.payment_date,
                payment_method: payment.payment_method,
                account_id: payment.account_id,
                employee_id: payment.employee_id || "",
                reference_number: payment.reference_number || "",
                note: payment.note || "",
                cheque_number: payment.cheque_number || "",
                issue_date: payment.issue_date || "",
                due_date: payment.due_date || "",
            });
        } else {
            setIsEditing(false);
            setFormData({
                id: "",
                external_service_invoice_id: invoiceId,
                amount: "",
                payment_date: new Date().toISOString().split("T")[0],
                payment_method: "cash",
                account_id: "",
                employee_id: "",
                reference_number: "",
                note: "",
                cheque_number: "",
                issue_date: "",
                due_date: "",
            });
        }
        setDialogOpen(true);
    };

    const handleSave = async () => {
        if (!formData.amount || Number(formData.amount) <= 0) {
            alert("يرجى إدخال مبلغ صحيح");
            return;
        }
        const { id, ...data } = formData;
        try {
            if (isEditing) {
                await axiosClient.put(`/service-payments/${id}`, data);
            } else {
                await axiosClient.post("/service-payments", data);
            }
            setDialogOpen(false);
            fetchPayments();
        } catch (error) {
            alert("خطأ في حفظ الدفعة: " + (error.response?.data?.message || error.message));
        }
    };

    const columns = [
        { accessorKey: "id", header: "المعرف" },
        { accessorKey: "amount", header: "المبلغ" },
        { accessorKey: "payment_date", header: "التاريخ" },
        { accessorKey: "payment_method", header: "الطريقة" },
        {
            accessorFn: (row) => accounts.find(a => a.id === row.account_id)?.name || row.account_id,
            header: "الحساب"
        },
        {
            accessorFn: (row) => employees.find(e => e.id === row.employee_id)?.name || row.employee_id || "-",
            header: "الموظف"
        },
        { accessorKey: "note", header: "ملاحظات" },
        {
            header: "إجراءات",
            Cell: ({ row }) => (
                <Box sx={{ display: "flex", gap: 1 }}>
                    <Button
                        size="small"
                        variant="outlined"
                        onClick={() => handleOpenDialog(row.original)}
                    >
                        تعديل
                    </Button>
                    <Button
                        size="small"
                        color="error"
                        variant="outlined"
                        onClick={() => handleDelete(row.original.id)}
                    >
                        حذف
                    </Button>
                </Box>
            ),
        },
    ];

    if (loading && payments.length === 0) {
        return <CircularProgress />;
    }

    return (
        <Box>
            <Button variant="contained" onClick={() => handleOpenDialog()} sx={{ mb: 2 }}>
                إضافة دفعة
            </Button>
            <MaterialReactTable
                columns={columns}
                data={payments}
                enableTopToolbar={false}
                enableBottomToolbar={false}
                muiTableContainerProps={{ sx: { maxHeight: '400px' } }}
            />

            <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} fullWidth>
                <DialogTitle>{isEditing ? "تعديل دفعة" : "إضافة دفعة"}</DialogTitle>
                <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
                    <TextField
                        label="المبلغ"
                        type="number"
                        value={formData.amount}
                        onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                        fullWidth
                    />
                    <TextField
                        label="التاريخ"
                        type="date"
                        InputLabelProps={{ shrink: true }}
                        value={formData.payment_date?.slice(0, 10) || ""}
                        onChange={(e) => setFormData({ ...formData, payment_date: e.target.value })}
                        fullWidth
                    />
                    <TextField
                        select
                        label="الطريقة"
                        value={formData.payment_method}
                        onChange={(e) => setFormData({ ...formData, payment_method: e.target.value })}
                        fullWidth
                    >
                        <MenuItem value="cash">نقدي</MenuItem>
                        <MenuItem value="bank">تحويل بنكي</MenuItem>
                        <MenuItem value="cheque">شيك</MenuItem>
                        <MenuItem value="other">أخرى</MenuItem>
                    </TextField>
                    <TextField
                        select
                        label="الحساب (الدائن/الخزينة)"
                        value={formData.account_id}
                        onChange={(e) => setFormData({ ...formData, account_id: e.target.value })}
                        fullWidth
                    >
                        {accounts.map((acc) => (
                            <MenuItem key={acc.id} value={acc.id}>{acc.name}</MenuItem>
                        ))}
                    </TextField>
                    <TextField
                        label="رقم مرجعي"
                        value={formData.reference_number}
                        onChange={(e) => setFormData({ ...formData, reference_number: e.target.value })}
                        fullWidth
                    />
                    <TextField
                        select
                        label="الموظف"
                        value={formData.employee_id}
                        onChange={(e) => setFormData({ ...formData, employee_id: e.target.value })}
                        fullWidth
                    >
                        <MenuItem value=""><em>لا يوجد</em></MenuItem>
                        {employees.map((emp) => (
                            <MenuItem key={emp.id} value={emp.id}>{emp.name}</MenuItem>
                        ))}
                    </TextField>
                    {formData.payment_method === 'cheque' && (
                        <Box sx={{ p: 2, border: '1px solid #ccc', borderRadius: 1 }}>
                            <Box sx={{ mb: 2 }}><strong>بيانات الشيك</strong></Box>
                            <TextField
                                label="رقم الشيك"
                                required
                                value={formData.cheque_number}
                                onChange={(e) => setFormData({ ...formData, cheque_number: e.target.value })}
                                fullWidth
                                sx={{ mb: 2 }}
                            />
                            <TextField
                                label="تاريخ الإصدار"
                                type="date"
                                InputLabelProps={{ shrink: true }}
                                value={formData.issue_date?.slice(0, 10) || ""}
                                onChange={(e) => setFormData({ ...formData, issue_date: e.target.value })}
                                fullWidth
                                sx={{ mb: 2 }}
                            />
                            <TextField
                                label="تاريخ الاستحقاق"
                                type="date"
                                required
                                InputLabelProps={{ shrink: true }}
                                value={formData.due_date?.slice(0, 10) || ""}
                                onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
                                fullWidth
                            />
                        </Box>
                    )}
                    <TextField
                        label="ملاحظات"
                        multiline
                        rows={2}
                        value={formData.note}
                        onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                        fullWidth
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDialogOpen(false)}>إلغاء</Button>
                    <Button onClick={handleSave} variant="contained">
                        حفظ
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}
