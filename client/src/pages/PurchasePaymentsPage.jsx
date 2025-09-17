// src/pages/PurchasePaymentsPage.jsx
import React, { useEffect } from "react";
import { Box, Button, CircularProgress } from "@mui/material";
import { MaterialReactTable } from "material-react-table";
import { useDispatch, useSelector } from "react-redux";
import { fetchPaymentsByInvoice, deletePayment } from "../features/purchasePayments/purchasePaymentsSlice";

export default function PurchasePaymentsPage() {
  const dispatch = useDispatch();
  const { byInvoice, status } = useSelector((s) => s.purchasePayments);

  // في هذا المثال نعرض كل المدفوعات لجميع الفواتير
  // backend endpoint ممكن يكون /payments/all
  useEffect(() => {
    // لو عندك thunk fetchAllPayments استخدمه
    // هنا نفترض إنك عامل fetchPaymentsByInvoice(null) أو تعمل thunk جديد
    dispatch(fetchPaymentsByInvoice("all"));
  }, [dispatch]);

  // نجمع كل المدفوعات من جميع الفواتير
  const allPayments = Object.values(byInvoice).flat();

  const handleDelete = (id) => {
    if (window.confirm("Delete this payment?")) {
      dispatch(deletePayment(id));
    }
  };

  const columns = [
    { accessorKey: "id", header: "ID" },
    { accessorKey: "purchase_invoice_id", header: "Invoice ID" },
    { accessorKey: "amount", header: "Amount" },
    { accessorKey: "payment_date", header: "Payment Date" },
    { accessorKey: "payment_method", header: "Method" },
    { accessorKey: "notes", header: "Notes" },
    {
      header: "Actions",
      Cell: ({ row }) => (
        <Button
          size="small"
          color="error"
          variant="outlined"
          onClick={() => handleDelete(row.original.id)}
        >
          Delete
        </Button>
      ),
    },
  ];

  if (status === "loading") {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box p={2}>
      <MaterialReactTable columns={columns} data={allPayments} />
    </Box>
  );
}
