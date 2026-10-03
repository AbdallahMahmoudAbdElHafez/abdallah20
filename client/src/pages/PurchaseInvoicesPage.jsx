import React, { useEffect, useState } from "react";
import { Box, Button, CircularProgress, Dialog, DialogTitle, DialogContent, DialogActions } from "@mui/material";
import { MaterialReactTable } from "material-react-table";
import { defaultTableProps } from "../config/tableConfig";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";

import {
  fetchPurchaseInvoices,
  updatePurchaseInvoice,
  addPurchaseInvoice,
} from "../features/purchaseInvoices/purchaseInvoicesSlice";
import { fetchItemsByInvoice } from "../features/purchaseInvoiceItems/purchaseInvoiceItemsSlice";
import { fetchProducts } from "../features/products/productsSlice";
import PurchaseInvoiceDialog from "../components/PurchaseInvoiceDialog";
import PurchaseInvoicePaymentsManager from "../components/PurchaseInvoicePaymentsManager";
import InvoicePreviewDialog from "../components/InvoicePreview/InvoicePreviewDialog";

export default function PurchaseInvoicesPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const filterOrderId = params.get("purchase_order_id"); // 👈 الفلترة

  const { items: invoices = [], loading } = useSelector(
    (state) => state.purchaseInvoices
  );
  const products = useSelector((state) => state.products?.items || []);

  const [openDialog, setOpenDialog] = useState(false);
  const [editingInvoice, setEditingInvoice] = useState(null);
  const [editingItems, setEditingItems] = useState([]);

  // Payments Dialog State
  const [paymentsOpen, setPaymentsOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);

  const handleOpenPayments = (invoice) => {
    setSelectedInvoice(invoice);
    setPaymentsOpen(true);
  };

  // Preview State
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewInvoice, setPreviewInvoice] = useState(null);
  const [previewItems, setPreviewItems] = useState([]);

  const handlePreview = async (invoice) => {
    const res = await dispatch(
      fetchItemsByInvoice(invoice.id)
    ).unwrap();

    // Map items to include product names
    const mappedItems = res.map(item => ({
      ...item,
      product_name: item.product?.name || products.find(p => p.id === item.product_id)?.name || "Unknown Product"
    }));

    setPreviewInvoice(invoice);
    setPreviewItems(mappedItems);
    setPreviewOpen(true);
  };

  useEffect(() => {
    // جلب الفواتير مفلترة (إن وجد purchase_order_id)
    dispatch(fetchPurchaseInvoices({ purchase_order_id: filterOrderId }));
    dispatch(fetchProducts());
  }, [dispatch, filterOrderId]);

  const handleEdit = async (invoice) => {
    const res = await dispatch(
      fetchItemsByInvoice(invoice.id)
    ).unwrap();
    setEditingInvoice(invoice);
    setEditingItems(res);
    setOpenDialog(true);
  };

  const handleUpdate = (payload) => {
    dispatch(updatePurchaseInvoice({ id: editingInvoice.id, data: payload }));
    setOpenDialog(false);
  };

  const handleCreate = () => {
    setEditingInvoice(null);
    setEditingItems([]);
    setOpenDialog(true);
  };

  const handleAdd = (payload) => {
    dispatch(addPurchaseInvoice(payload));
    setOpenDialog(false);
  };

  const columns = [
    { accessorKey: "invoice_number", header: "رقم الفاتورة" },
    { accessorKey: "supplier.name", header: "المورد" },
    { accessorKey: "invoice_date", header: "تاريخ الفاتورة" },
    { accessorKey: "status", header: "الحالة" },
    { accessorKey: "total_amount", header: "الإجمالي" },
    {
      header: "إجراءات",
      Cell: ({ row }) => (
        <Box sx={{ display: "flex", gap: 1 }}>
          <Button
            size="small"
            variant="outlined"
            onClick={() => handleEdit(row.original)}
          >
            تعديل
          </Button>
          <Button
            size="small"
            variant="contained"
            color="secondary"
            onClick={() =>
              navigate(`/purchase-orders?order_id=${row.original.purchase_order_id}`)
            }
          >
            عرض الطلب
          </Button>
          <Button
            size="small"
            variant="outlined"
            color="info"
            onClick={() => handleOpenPayments(row.original)}
          >
            المدفوعات
          </Button>
          <Button
            size="small"
            variant="contained"
            color="warning"
            onClick={() => handlePreview(row.original)}
          >
            معاينة
          </Button>
        </Box>
      ),
    },
  ];

  if (loading === "loading") {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box p={2}>
      <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
        <Button variant="contained" onClick={handleCreate}>
          إضافة فاتورة شراء
        </Button>
      </Box>

      <MaterialReactTable {...defaultTableProps} columns={columns} data={invoices} />

      {openDialog && (
        <PurchaseInvoiceDialog
          open={openDialog}
          onClose={() => setOpenDialog(false)}
          invoice={editingInvoice}
          itemsInit={editingItems}
          onSave={editingInvoice ? handleUpdate : handleAdd}
        />
      )}

      {/* Payments Dialog */}
      <Dialog open={paymentsOpen} onClose={() => setPaymentsOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle sx={{ fontWeight: 800 }}>مدفوعات فاتورة {selectedInvoice?.invoice_number}</DialogTitle>
        <DialogContent>
          {selectedInvoice && <PurchaseInvoicePaymentsManager invoiceId={selectedInvoice.id} invoice={selectedInvoice} />}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPaymentsOpen(false)}>إغلاق</Button>
        </DialogActions>
      </Dialog>

      {/* Invoice Preview Dialog */}
      {previewOpen && (
        <InvoicePreviewDialog
          open={previewOpen}
          onClose={() => setPreviewOpen(false)}
          invoice={previewInvoice}
          items={previewItems}
          type="purchase"
        />
      )}
    </Box>
  );
}
