import React, { useEffect, useState } from "react";
import {
    Box,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    MenuItem,
    Grid,
    CircularProgress,
    Typography
} from "@mui/material";
import { MaterialReactTable } from "material-react-table";
import { defaultTableProps } from "../config/tableConfig";
import axiosClient from "../api/axiosClient";

export default function ServicePaymentsPage() {
    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(false); // Start false to show Date Dialog first, or true if we auto-fetch

    // Dropdown Data
    const [parties, setParties] = useState([]);
    const [accounts, setAccounts] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [jobOrders, setJobOrders] = useState([]);

    // Date Range State
    const [dateDialogOpen, setDateDialogOpen] = useState(true);
    const [dateRange, setDateRange] = useState({
        startDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0], // First day of current month
        endDate: new Date().toISOString().split('T')[0]
    });
    const [dateError, setDateError] = useState("");

    // Create/Edit Dialog State
    const [dialogOpen, setDialogOpen] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState({
        party_id: "",
        amount: "",
        payment_date: new Date().toISOString().split("T")[0],
        payment_method: "cash",
        account_id: "",
        credit_account_id: "",
        external_job_order_id: "",
        reference_number: "",
        note: "",
        cheque_number: "",
        issue_date: "",
        due_date: "",
        employee_id: ""
    });

    useEffect(() => {
        fetchDropdowns();
        // Optionally fetch all initially or wait for date range
        // fetchPayments(); 
    }, []);

    const fetchDropdowns = async () => {
        try {
            const [partiesRes, accountsRes, employeesRes, jobOrdersRes] = await Promise.all([
                axiosClient.get("/parties"),
                axiosClient.get("/accounts"),
                axiosClient.get("/employees"),
                axiosClient.get("/external-job-orders")
            ]);
            setParties(partiesRes.data);
            setAccounts(accountsRes.data);
            setEmployees(employeesRes.data);
            setJobOrders(jobOrdersRes.data);
        } catch (err) {
            console.error(err);
        }
    };

    const fetchPayments = async (start, end) => {
        setLoading(true);
        try {
            const params = {};
            if (start && end) {
                params.startDate = start;
                params.endDate = end;
            }
            const res = await axiosClient.get("/service-payments", { params });
            setPayments(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleDateSubmit = () => {
        const { startDate, endDate } = dateRange;
        if (!startDate || !endDate) {
            setDateError("يرجى تحديد تاريخ البدء والانتهاء.");
            return;
        }
        if (new Date(startDate) > new Date(endDate)) {
            setDateError("تاريخ البدء يجب أن يكون قبل تاريخ الانتهاء.");
            return;
        }
        setDateError("");
        fetchPayments(startDate, endDate);
        setDateDialogOpen(false);
    };

    const handleOpenCreate = () => {
        setEditingId(null);
        setFormData({
            party_id: "",
            amount: "",
            payment_date: new Date().toISOString().split("T")[0],
            payment_method: "cash",
            account_id: "",
            credit_account_id: "",
            external_job_order_id: "",
            reference_number: "",
            note: "",
            cheque_number: "",
            issue_date: "",
            due_date: "",
            employee_id: ""
        });
        setDialogOpen(true);
    };

    const handleOpenEdit = (row) => {
        setEditingId(row.id);
        setFormData({
            party_id: row.party_id,
            amount: row.amount,
            payment_date: row.payment_date,
            payment_method: row.payment_method,
            account_id: row.account_id,
            credit_account_id: row.credit_account_id,
            external_job_order_id: row.external_job_order_id || "",
            reference_number: row.reference_number || "",
            note: row.note || "",
            cheque_number: row.cheque_number || "",
            issue_date: row.issue_date || "",
            due_date: row.due_date || "",
            employee_id: row.employee_id || ""
        });
        setDialogOpen(true);
    };

    const handleSave = async () => {
        try {
            if (editingId) {
                await axiosClient.put(`/service-payments/${editingId}`, formData);
                alert("تم تحديث الدفعة بنجاح");
            } else {
                await axiosClient.post("/service-payments", formData);
                alert("تم تسجيل الدفعة بنجاح");
            }
            setDialogOpen(false);
            fetchPayments(dateRange.startDate, dateRange.endDate);
        } catch (err) {
            alert("Error saving payment: " + (err.response?.data?.message || err.message));
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("هل أنت متأكد من حذف هذا السند؟")) {
            try {
                await axiosClient.delete(`/service-payments/${id}`);
                fetchPayments(dateRange.startDate, dateRange.endDate);
            } catch (err) {
                alert("Error deleting payment");
            }
        }
    };

    const columns = [
        { accessorKey: "id", header: "ID", size: 50 },
        {
            accessorKey: "party_id",
            header: "المورد/الجهة",
            Cell: ({ cell }) => parties.find(p => p.id === cell.getValue())?.name || cell.getValue()
        },
        { accessorKey: "amount", header: "المبلغ" },
        { accessorKey: "payment_date", header: "التاريخ" },
        { accessorKey: "payment_method", header: "طريقة الدفع" },
        {
            accessorKey: "account_id",
            header: "حساب الخدمة (المدين)",
            Cell: ({ cell }) => accounts.find(a => a.id === cell.getValue())?.name || cell.getValue()
        },
        {
            accessorKey: "credit_account_id",
            header: "حساب الدفع (الدائن)",
            Cell: ({ cell }) => accounts.find(a => a.id === cell.getValue())?.name || cell.getValue()
        },
        {
            accessorKey: "external_job_order_id",
            header: "أمر، شغل خارجي",
            Cell: ({ cell }) => jobOrders.find(j => j.id === cell.getValue())?.job_order_number || "-"
        },
        {
            accessorKey: "employee_id",
            header: "الموظف",
            Cell: ({ cell }) => employees.find(e => e.id === cell.getValue())?.name || "-"
        },
        { accessorKey: "note", header: "ملاحظات" },
        {
            header: "إجراءات",
            Cell: ({ row }) => (
                <Box sx={{ display: "flex", gap: 1 }}>
                    <Button
                        size="small"
                        variant="outlined"
                        onClick={() => handleOpenEdit(row.original)}
                    >
                        تعديل
                    </Button>
                    <Button
                        size="small"
                        variant="outlined"
                        color="error"
                        onClick={() => handleDelete(row.original.id)}
                    >
                        حذف
                    </Button>
                </Box>
            ),
        }
    ];

    return (
        <Box p={2}>
            <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
                <Button variant="contained" onClick={handleOpenCreate}>
                    تسجيل دفعة خدمة
                </Button>
                <Button variant="outlined" onClick={() => setDateDialogOpen(true)}>
                    تغيير نطاق التاريخ
                </Button>
            </Box>

            {loading ? (
                <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
                    <CircularProgress />
                </Box>
            ) : (
                <MaterialReactTable {...defaultTableProps} columns={columns} data={payments} />
            )}

            {/* Date Range Dialog */}
            <Dialog open={dateDialogOpen} disableEscapeKeyDown>
                <DialogTitle>تحديد نطاق التاريخ</DialogTitle>
                <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1, minWidth: 300 }}>
                    <TextField
                        label="من تاريخ"
                        type="date"
                        InputLabelProps={{ shrink: true }}
                        value={dateRange.startDate}
                        onChange={(e) => setDateRange({ ...dateRange, startDate: e.target.value })}
                        fullWidth
                    />
                    <TextField
                        label="إلى تاريخ"
                        type="date"
                        InputLabelProps={{ shrink: true }}
                        value={dateRange.endDate}
                        onChange={(e) => setDateRange({ ...dateRange, endDate: e.target.value })}
                        fullWidth
                    />
                    {dateError && <Typography color="error" variant="body2">{dateError}</Typography>}
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={handleDateSubmit}
                        variant="contained"
                        disabled={!dateRange.startDate || !dateRange.endDate}
                    >
                        عرض المدفوعات
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Create/Edit Dialog */}
            <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} fullWidth maxWidth="md">
                <DialogTitle>{editingId ? "تعديل دفعة خدمة" : "تسجيل دفعة خدمة جديدة"}</DialogTitle>
                <DialogContent>
                    <Grid container spacing={2} sx={{ mt: 1 }}>
                        <Grid item xs={6}>
                            <TextField
                                select
                                label="المورد / الجهة"
                                fullWidth
                                value={formData.party_id}
                                onChange={(e) => setFormData({ ...formData, party_id: e.target.value })}
                            >
                                {parties.map(p => <MenuItem key={p.id} value={p.id}>{p.name}</MenuItem>)}
                            </TextField>
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                label="المبلغ"
                                type="number"
                                fullWidth
                                value={formData.amount}
                                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                label="التاريخ"
                                type="date"
                                fullWidth
                                value={formData.payment_date}
                                onChange={(e) => setFormData({ ...formData, payment_date: e.target.value })}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                select
                                label="حساب الخدمة (المدين)"
                                fullWidth
                                value={formData.account_id}
                                onChange={(e) => setFormData({ ...formData, account_id: e.target.value })}
                            >
                                {accounts.map(a => <MenuItem key={a.id} value={a.id}>{a.name}</MenuItem>)}
                            </TextField>
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                select
                                label="حساب الدفع (الخزينة/البنك)"
                                fullWidth
                                value={formData.credit_account_id}
                                onChange={(e) => setFormData({ ...formData, credit_account_id: e.target.value })}
                            >
                                {accounts.map(a => <MenuItem key={a.id} value={a.id}>{a.name}</MenuItem>)}
                            </TextField>
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                select
                                label="طريقة الدفع"
                                fullWidth
                                value={formData.payment_method}
                                onChange={(e) => setFormData({ ...formData, payment_method: e.target.value })}
                            >
                                <MenuItem value="cash">نقدي</MenuItem>
                                <MenuItem value="bank">تحويل بنكي</MenuItem>
                                <MenuItem value="cheque">شيك</MenuItem>
                                <MenuItem value="other">أخرى</MenuItem>
                            </TextField>
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                label="رقم مرجعي"
                                fullWidth
                                value={formData.reference_number}
                                onChange={(e) => setFormData({ ...formData, reference_number: e.target.value })}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                select
                                label="أمر شغل خارجي"
                                fullWidth
                                value={formData.external_job_order_id}
                                onChange={(e) => setFormData({ ...formData, external_job_order_id: e.target.value })}
                            >
                                <MenuItem value=""><em>لا يوجد</em></MenuItem>
                                {jobOrders.map(j => <MenuItem key={j.id} value={j.id}>{j.job_order_number || j.id}</MenuItem>)}
                            </TextField>
                        </Grid>

                        <Grid item xs={6}>
                            <TextField
                                select
                                label="الموظف"
                                fullWidth
                                value={formData.employee_id}
                                onChange={(e) => setFormData({ ...formData, employee_id: e.target.value })}
                            >
                                <MenuItem value=""><em>لا يوجد</em></MenuItem>
                                {employees.map(e => <MenuItem key={e.id} value={e.id}>{e.name}</MenuItem>)}
                            </TextField>
                        </Grid>

                        {/* Cheque Fields */}
                        {formData.payment_method === 'cheque' && (
                            <>
                                <Grid item xs={12}>
                                    <Box sx={{ p: 1, bgcolor: '#f5f5f5', borderRadius: 1, mb: 1 }}>
                                        <strong>بيانات الشيك</strong>
                                    </Box>
                                </Grid>
                                <Grid item xs={4}>
                                    <TextField
                                        label="رقم الشيك"
                                        fullWidth
                                        required
                                        value={formData.cheque_number || ''}
                                        onChange={(e) => setFormData({ ...formData, cheque_number: e.target.value })}
                                    />
                                </Grid>
                                <Grid item xs={4}>
                                    <TextField
                                        label="تاريخ الإصدار"
                                        type="date"
                                        fullWidth
                                        InputLabelProps={{ shrink: true }}
                                        value={formData.issue_date || formData.payment_date}
                                        onChange={(e) => setFormData({ ...formData, issue_date: e.target.value })}
                                    />
                                </Grid>
                                <Grid item xs={4}>
                                    <TextField
                                        label="تاريخ الاستحقاق"
                                        type="date"
                                        fullWidth
                                        required
                                        InputLabelProps={{ shrink: true }}
                                        value={formData.due_date || ''}
                                        onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
                                    />
                                </Grid>
                            </>
                        )}
                        <Grid item xs={12}>
                            <TextField
                                label="ملاحظات"
                                fullWidth
                                multiline
                                rows={2}
                                value={formData.note}
                                onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                            />
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDialogOpen(false)}>إلغاء</Button>
                    <Button variant="contained" onClick={handleSave}>حفظ</Button>
                </DialogActions>
            </Dialog>
        </Box >
    );
}
