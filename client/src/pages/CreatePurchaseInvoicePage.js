// src/pages/CreatePurchaseInvoicePage.jsx
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createPurchaseInvoice } from "../features/purchaseInvoices/purchaseInvoicesSlice";
import {
  Button,
  TextField,
  Paper,
  Typography,
  Box,
} from "@mui/material";
import PurchaseInvoiceItemsTable from "../components/PurchaseInvoiceItemsTable";

const CreatePurchaseInvoicePage = () => {
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.purchaseInvoices);

  // بيانات الفاتورة
  const [invoice, setInvoice] = useState({
    invoice_number: "",
    party_id: "",
    warehouse_id: "",
    note: "",
  });

  // البنود (مخزّنة محليًا قبل الحفظ)
  const [items, setItems] = useState([]);

  const handleInvoiceChange = (field, value) => {
    setInvoice((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    dispatch(createPurchaseInvoice({ invoice, items }));
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        Create New Purchase Invoice
      </Typography>

      {/* بيانات الفاتورة */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Typography variant="h6">Invoice Info</Typography>
        <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2, mt: 2 }}>
          <TextField
            label="Invoice Number"
            value={invoice.invoice_number}
            onChange={(e) => handleInvoiceChange("invoice_number", e.target.value)}
          />
          <TextField
            label="Party ID"
            value={invoice.party_id}
            onChange={(e) => handleInvoiceChange("party_id", e.target.value)}
          />
          <TextField
            label="Warehouse ID"
            value={invoice.warehouse_id}
            onChange={(e) => handleInvoiceChange("warehouse_id", e.target.value)}
          />
          <TextField
            label="Note"
            value={invoice.note}
            onChange={(e) => handleInvoiceChange("note", e.target.value)}
          />
        </Box>
      </Paper>

      {/* جدول البنود */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Invoice Items
        </Typography>
        <PurchaseInvoiceItemsTable
          invoiceId={null} // ما فيش ID لسه (فاتورة جديدة)
          localItems={items}
          setLocalItems={setItems}
        />
      </Paper>

      {/* زرار الحفظ */}
      <Button
        variant="contained"
        color="primary"
        onClick={handleSave}
        disabled={loading}
      >
        {loading ? "Saving..." : "Save Invoice"}
      </Button>
    </Box>
  );
};

export default CreatePurchaseInvoicePage;
