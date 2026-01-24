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
import { useDispatch, useSelector } from "react-redux";
import {
    fetchPaymentsByInvoice,
    deletePayment,
    updatePayment,
    addPayment,
} from "../features/salesInvoicePayments/salesInvoicePaymentsSlice";
import { fetchAccounts } from "../features/accounts/accountsSlice";
import { fetchEmployees } from "../features/employees/employeesSlice";
import ChequeDetailsForm from "./ChequeDetailsForm";

export default function SalesInvoicePaymentsManager({ invoiceId }) {
    const dispatch = useDispatch();
    const { byInvoice, status } = useSelector((s) => s.salesInvoicePayments);
    const { items: accounts } = useSelector((s) => s.accounts);
    const { list: employees } = useSelector((s) => s.employees);

    // ====== state for editing/adding ======
    const [dialogOpen, setDialogOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        id: "",
        sales_invoice_id: invoiceId,
        amount: "",
        payment_date: new Date().toISOString().split("T")[0],
        payment_method: "cash",
        account_id: "",
        note: "",
        cheque_details: {
            bank_name: ""
        },
        employee_id: "",
        withholding_tax_rate: "",
        withholding_tax_amount: ""
    });

    useEffect(() => {
        if (invoiceId) {
            dispatch(fetchPaymentsByInvoice(invoiceId));
        }
        dispatch(fetchAccounts());
        dispatch(fetchEmployees());
    }, [dispatch, invoiceId]);

    const payments = byInvoice[invoiceId] || [];

    const handleDelete = (id) => {
        if (window.confirm("هل أنت متأكد من حذف هذا السند؟")) {
            dispatch(deletePayment(id));
        }
    };

    const handleOpenDialog = (payment = null) => {
        if (payment) {
            setIsEditing(true);
            setFormData({
                id: payment.id,
                sales_invoice_id: payment.sales_invoice_id,
                amount: payment.amount,
                payment_date: payment.payment_date,
                payment_method: payment.payment_method,
                account_id: payment.account_id,
                employee_id: payment.employee_id || "",
                note: payment.note || "",
                withholding_tax_rate: payment.withholding_tax_rate || "",
                withholding_tax_amount: payment.withholding_tax_amount || ""
            });
        } else {
            setIsEditing(false);
            setFormData({
                id: "",
                sales_invoice_id: invoiceId,
                amount: "",
                payment_date: new Date().toISOString().split("T")[0],
                payment_method: "cash",
                account_id: "", // Should be selected by user
                note: "",
                cheque_details: {
                    bank_name: ""
                },
                employee_id: "",
                withholding_tax_rate: "",
                withholding_tax_amount: ""
            });
        }
        setDialogOpen(true);
    };

    const handleSave = async () => {
        const { id, ...data } = formData;
        if (isEditing) {
            await dispatch(updatePayment({ id, data }));
        } else {
            await dispatch(addPayment(data));
        }
        setDialogOpen(false);
        dispatch(fetchPaymentsByInvoice(invoiceId)); // Refresh
    };

    const columns = [
        { accessorKey: "id", header: "المعرف" },
        { accessorKey: "amount", header: "المبلغ المحصل" },
        { accessorKey: "withholding_tax_rate", header: "نسبة خصم المنبع %" },
        { accessorKey: "withholding_tax_amount", header: "قيمة خصم المنبع" },
        { accessorKey: "payment_date", header: "التاريخ" },
        { accessorKey: "payment_method", header: "الطريقة" },
        {
            accessorFn: (row) => row.account?.name || row.account_id,
            header: "الحساب"
        },
        {
            accessorFn: (row) => row.employee?.name || row.employee_id || "-",
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

    if (status === "loading") {
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
                        label="المبلغ المحصل"
                        type="number"
                        value={formData.amount}
                        onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                        fullWidth
                    />
                    <TextField
                        label="نسبة خصم المنبع %"
                        type="number"
                        value={formData.withholding_tax_rate}
                        onChange={(e) => {
                            const rate = Number(e.target.value) || 0;
                            const amount = Number(formData.amount) || 0;
                            // Calculate withholding amount based on rate
                            // Formula: withholding = amount * rate / (100 - rate)
                            const withholdingAmount = rate > 0 && rate < 100 ? (amount * rate / (100 - rate)).toFixed(2) : 0;
                            setFormData({
                                ...formData,
                                withholding_tax_rate: e.target.value,
                                withholding_tax_amount: withholdingAmount
                            });
                        }}
                        fullWidth
                    />
                    <TextField
                        label="قيمة خصم المنبع"
                        type="number"
                        value={formData.withholding_tax_amount}
                        onChange={(e) => setFormData({ ...formData, withholding_tax_amount: e.target.value })}
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
                        <MenuItem value="bank_transfer">تحويل بنكي</MenuItem>
                        <MenuItem value="cheque">شيك</MenuItem>
                    </TextField>
                    <TextField
                        select
                        label="الحساب"
                        value={formData.account_id}
                        onChange={(e) => setFormData({ ...formData, account_id: e.target.value })}
                        fullWidth
                    >
                        {accounts.map((acc) => (
                            <MenuItem key={acc.id} value={acc.id}>{acc.name}</MenuItem>
                        ))}
                    </TextField>
                    <TextField
                        label="ملاحظات"
                        value={formData.note}
                        onChange={(e) => setFormData({ ...formData, note: e.target.value })}
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
                        <ChequeDetailsForm
                            chequeDetails={formData.cheque_details}
                            setChequeDetails={(details) => setFormData({ ...formData, cheque_details: details })}
                        />
                    )}
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
