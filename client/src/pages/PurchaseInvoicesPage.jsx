import React, { useEffect, useState } from "react";
import { Box, Button, CircularProgress } from "@mui/material";
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
import PurchaseInvoiceDialog from "../components/PurchaseInvoiceDialog";

export default function PurchaseInvoicesPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const filterOrderId = params.get("purchase_order_id"); // 👈 الفلترة

  const { items: invoices = [], loading } = useSelector(
    (state) => state.purchaseInvoices
  );

  const [openDialog, setOpenDialog] = useState(false);
  const [editingInvoice, setEditingInvoice] = useState(null);
  const [editingItems, setEditingItems] = useState([]);

  useEffect(() => {
    // جلب الفواتير مفلترة (إن وجد purchase_order_id)
    dispatch(fetchPurchaseInvoices({ purchase_order_id: filterOrderId }));
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

      <MaterialReactTable columns={columns} data={invoices} />

      {openDialog && (
        <PurchaseInvoiceDialog
          open={openDialog}
          onClose={() => setOpenDialog(false)}
          invoice={editingInvoice}
          itemsInit={editingItems}
          onSave={editingInvoice ? handleUpdate : handleAdd}
        />
      )}
    </Box>
  );
}
