// src/pages/PurchasePaymentsPage.jsx
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
import { defaultTableProps } from "../config/tableConfig";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAllPayments,
  fetchPaymentsByInvoice,
  deletePayment,
  updatePayment,
} from "../features/purchasePayments/purchasePaymentsSlice";

export default function PurchasePaymentsPage() {
  const dispatch = useDispatch();
  const { byInvoice, status } = useSelector((s) => s.purchasePayments);

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
    notes: "",
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

  // دمج كل المدفوعات
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
      notes: row.notes || "",
    });
    setEditOpen(true);
  };

  // حفظ التعديل
  const handleEditSave = () => {
    const { id, ...fields } = editData;
    dispatch(updatePayment({ id, data: fields }));
    setEditOpen(false);
  };

  const columns = [
    { accessorKey: "id", header: "المعرف" },
    { accessorKey: "purchase_invoice.invoice_number", header: "رقم الفاتورة" },
    { accessorKey: "purchase_invoice.supplier.name", header: "اسم المورد" },
    { accessorKey: "amount", header: "المبلغ" },
    { accessorKey: "payment_date", header: "تاريخ السداد" },
    { accessorKey: "payment_method", header: "طريقة السداد" },
    { accessorKey: "notes", header: "ملاحظات" },
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
        <MaterialReactTable {...defaultTableProps} columns={columns} data={allPayments} />
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
            value={editData.notes}
            onChange={(e) => setEditData({ ...editData, notes: e.target.value })}
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
