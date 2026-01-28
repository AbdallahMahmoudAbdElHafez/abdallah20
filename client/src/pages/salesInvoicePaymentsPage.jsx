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
    Typography,
} from "@mui/material";
import { MaterialReactTable } from "material-react-table";
import { useDispatch, useSelector } from "react-redux";
import {
    fetchAllPayments,
    fetchPaymentsByInvoice,
    deletePayment,
    updatePayment,
} from "../features/salesInvoicePayments/salesInvoicePaymentsSlice";
import { defaultTableProps } from "../config/tableConfig";
import { exportToExcel } from "../utils/exportUtils";
import { Download as DownloadIcon } from "@mui/icons-material";

export default function SalesInvoicePaymentsPage() {
    const dispatch = useDispatch();
    const { byInvoice, status } = useSelector((s) => s.salesInvoicePayments);

    // ====== Date Range Dialog State ======
    const [dateDialogOpen, setDateDialogOpen] = useState(true);
    const [dateRange, setDateRange] = useState({ startDate: "", endDate: "" });
    const [error, setError] = useState("");

    // ====== state for editing ======
    const [editOpen, setEditOpen] = useState(false);
    const [editData, setEditData] = useState({
        id: "",
        amount: "",
        payment_date: "",
        note: "",
    });

    // Fetch data only when date range is valid and submitted
    const handleDateSubmit = () => {
        const { startDate, endDate } = dateRange;
        if (!startDate || !endDate) {
            setError("يرجى تحديد تاريخ البدء والانتهاء.");
            return;
        }
        if (new Date(startDate) > new Date(endDate)) {
            setError("تاريخ البدء يجب أن يكون قبل تاريخ الانتهاء.");
            return;
        }
        setError("");
        dispatch(fetchAllPayments({ startDate, endDate }));
        setDateDialogOpen(false);
    };

    // دمج كل المدفوعات (Assuming 'all' key or flat map if structure differs)
    // The slice puts fetchAll result into byInvoice.all
    const allPayments = byInvoice.all || [];

    // حذف
    const handleDelete = (id) => {
        if (window.confirm("هل أنت متأكد من حذف هذا السند؟")) {
            dispatch(deletePayment(id));
        }
    };

    // فتح نافذة التعديل
    const handleEditOpen = (row) => {
        setEditData({
            id: row.id,
            amount: row.amount,
            payment_date: row.payment_date,
            note: row.note || "",
        });
        setEditOpen(true);
    };

    // حفظ التعديل
    const handleEditSave = () => {
        const { id, ...fields } = editData;
        dispatch(updatePayment({ id, data: fields }));
        setEditOpen(false);
    };

    const handleExport = async (table) => {
        try {
            await exportToExcel(
                table.getFilteredRowModel().rows,
                table.getVisibleLeafColumns(),
                "Sales_Payments_Report"
            );
        } catch (error) {
            console.error("Export failed:", error);
            alert("حدث خطأ أثناء تصدير الملف.");
        }
    };

    const columns = [
        { accessorKey: "id", header: "المعرف" },
        { accessorKey: "sales_invoice.invoice_number", header: "رقم الفاتورة" },
        { accessorKey: "sales_invoice.party.name", header: "اسم العميل" },
        { accessorKey: "amount", header: "المبلغ" },
        { accessorKey: "payment_date", header: "تاريخ السداد" },
        { accessorKey: "payment_method", header: "طريقة السداد" },
        { accessorKey: "note", header: "ملاحظات" },
        {
            header: "إجراءات",
            Cell: ({ row }) => (
                <Box sx={{ display: "flex", gap: 1 }}>
                    <Button
                        size="small"
                        variant="outlined"
                        color="primary"
                        onClick={() => handleEditOpen(row.original)}
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

    return (
        <Box p={2}>
            <Button variant="contained" onClick={() => setDateDialogOpen(true)} sx={{ mb: 2 }}>
                تغيير نطاق التاريخ
            </Button>

            {status === "loading" ? (
                <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
                    <CircularProgress />
                </Box>
            ) : (
                <MaterialReactTable
                    {...defaultTableProps}
                    columns={columns}
                    data={allPayments}
                    enableExporting
                    renderTopToolbarCustomActions={({ table }) => (
                        <Button
                            variant="contained"
                            color="success"
                            startIcon={<DownloadIcon />}
                            onClick={() => handleExport(table)}
                        >
                            تصدير لإكسل
                        </Button>
                    )}
                />
            )}

            {/* ===== Date Range Dialog ===== */}
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
                    {error && <Typography color="error" variant="body2">{error}</Typography>}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleDateSubmit} variant="contained" disabled={!dateRange.startDate || !dateRange.endDate}>
                        عرض المدفوعات
                    </Button>
                </DialogActions>
            </Dialog>

            {/* ===== Dialog for Editing ===== */}
            <Dialog open={editOpen} onClose={() => setEditOpen(false)} fullWidth>
                <DialogTitle>تعديل السند</DialogTitle>
                <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
                    <TextField
                        label="المبلغ"
                        type="number"
                        value={editData.amount}
                        onChange={(e) => setEditData({ ...editData, amount: e.target.value })}
                    />
                    <TextField
                        label="تاريخ السداد"
                        type="date"
                        InputLabelProps={{ shrink: true }}
                        value={editData.payment_date?.slice(0, 10) || ""}
                        onChange={(e) => setEditData({ ...editData, payment_date: e.target.value })}
                    />
                    <TextField
                        label="ملاحظات"
                        value={editData.note}
                        onChange={(e) => setEditData({ ...editData, note: e.target.value })}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setEditOpen(false)}>إلغاء</Button>
                    <Button onClick={handleEditSave} variant="contained">
                        حفظ
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}
