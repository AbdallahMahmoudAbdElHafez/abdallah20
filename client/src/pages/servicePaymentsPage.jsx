import React, { useEffect, useState } from "react";
import {
    Box,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    CircularProgress,
    Typography,
    Chip
} from "@mui/material";
import { MaterialReactTable } from "material-react-table";
import { defaultTableProps } from "../config/tableConfig";
import axiosClient from "../api/axiosClient";

export default function ServicePaymentsPage() {
    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(false);

    // Dropdown Data (for display only)
    const [accounts, setAccounts] = useState([]);
    const [employees, setEmployees] = useState([]);

    // Date Range State
    const [dateDialogOpen, setDateDialogOpen] = useState(true);
    const [dateRange, setDateRange] = useState({
        startDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0],
        endDate: new Date().toISOString().split('T')[0]
    });
    const [dateError, setDateError] = useState("");

    useEffect(() => {
        fetchDropdowns();
    }, []);

    const fetchDropdowns = async () => {
        try {
            const [accountsRes, employeesRes] = await Promise.all([
                axiosClient.get("/accounts"),
                axiosClient.get("/employees")
            ]);
            setAccounts(accountsRes.data);
            setEmployees(employeesRes.data);
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

    const getMethodLabel = (method) => {
        switch (method) {
            case 'cash': return 'نقدي';
            case 'bank': return 'تحويل بنكي';
            case 'cheque': return 'شيك';
            case 'other': return 'أخرى';
            default: return method;
        }
    };

    // Calculate total paid
    const totalPaid = payments.reduce((sum, p) => sum + Number(p.amount || 0), 0);

    const columns = [
        { accessorKey: "id", header: "ID", size: 50 },
        {
            accessorFn: (row) => row.invoice?.invoice_no || row.external_service_invoice_id,
            id: "invoice_no",
            header: "رقم الفاتورة",
        },
        {
            accessorFn: (row) => row.invoice?.party?.name || "-",
            id: "supplier_name",
            header: "المورد/الجهة",
        },
        {
            accessorKey: "amount",
            header: "المبلغ",
            Cell: ({ cell }) => parseFloat(cell.getValue() || 0).toLocaleString()
        },
        { accessorKey: "payment_date", header: "التاريخ" },
        {
            accessorKey: "payment_method",
            header: "طريقة الدفع",
            Cell: ({ cell }) => (
                <Chip
                    label={getMethodLabel(cell.getValue())}
                    size="small"
                    variant="outlined"
                    color={cell.getValue() === 'cheque' ? 'warning' : 'default'}
                />
            )
        },
        {
            accessorFn: (row) => row.account?.name || accounts.find(a => a.id === row.account_id)?.name || row.account_id,
            id: "account_name",
            header: "حساب الدفع",
        },
        {
            accessorFn: (row) => row.employee?.name || employees.find(e => e.id === row.employee_id)?.name || "-",
            id: "employee_name",
            header: "الموظف",
        },
        { accessorKey: "note", header: "ملاحظات" },
    ];

    return (
        <Box p={2}>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                <Typography variant="h5">تقرير مدفوعات الخدمات</Typography>
                <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
                    {payments.length > 0 && (
                        <Chip
                            label={`إجمالي المدفوعات: ${totalPaid.toLocaleString()}`}
                            color="primary"
                            variant="outlined"
                            sx={{ fontWeight: 'bold', fontSize: '0.9rem' }}
                        />
                    )}
                    <Button variant="outlined" onClick={() => setDateDialogOpen(true)}>
                        تغيير نطاق التاريخ
                    </Button>
                </Box>
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
        </Box>
    );
}
