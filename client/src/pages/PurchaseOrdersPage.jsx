import React, { useEffect, useState } from "react";
import { Box, Button, CircularProgress } from "@mui/material";
import { MaterialReactTable } from "material-react-table";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";              // ⬅️ استيراد
import {
  fetchPurchaseOrders,
  updatePurchaseOrder,
  addPurchaseOrder,
} from "../features/purchaseOrders/purchaseOrdersSlice";
import { fetchItemsByOrder } from "../features/purchaseOrderItems/purchaseOrderItemsSlice";
import PurchaseOrderDialog from "../components/PurchaseOrderDialog";

// ... باقي الاستيرادات نفسها

export default function PurchaseOrdersPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items: orders = [], loading } = useSelector(
    (state) => state.purchaseOrders
  );

  const [openDialog, setOpenDialog] = useState(false);
  const [editingOrder, setEditingOrder] = useState(null);
  const [editingItems, setEditingItems] = useState([]);

  useEffect(() => {
    dispatch(fetchPurchaseOrders());
  }, [dispatch]);

  const handleEdit = async (order) => {
    const res = await dispatch(fetchItemsByOrder(order.id)).unwrap();
    setEditingOrder(order);
    setEditingItems(res);
    setOpenDialog(true);
  };

  const handleUpdate = (payload) => {
    dispatch(updatePurchaseOrder({ id: editingOrder.id, data: payload }));
  };

  const handleCreate = () => {
    setEditingOrder(null);
    setEditingItems([]);
    setOpenDialog(true);
  };

  const handleAdd = (payload) => {
    dispatch(addPurchaseOrder(payload));
  };

  const columns = [
    { accessorKey: "order_number", header: "Order Number" },
    { accessorKey: "order_date", header: "Order Date" },
    { accessorKey: "status", header: "Status" },

    // ⬇️ الأعمدة الجديدة
    { accessorKey: "subtotal", header: "Subtotal", Cell: ({ cell }) => Number(cell.getValue()).toFixed(2) },
    { accessorKey: "additional_discount", header: "Add. Discount", Cell: ({ cell }) => Number(cell.getValue()).toFixed(2) },
    { accessorKey: "vat_rate", header: "VAT %", Cell: ({ cell }) => `${cell.getValue()} %` },
    { accessorKey: "vat_amount", header: "VAT Amount", Cell: ({ cell }) => Number(cell.getValue()).toFixed(2) },
    { accessorKey: "tax_rate", header: "Tax %", Cell: ({ cell }) => `${cell.getValue()} %` },
    { accessorKey: "tax_amount", header: "Tax Amount", Cell: ({ cell }) => Number(cell.getValue()).toFixed(2) },

    { accessorKey: "total_amount", header: "Total Amount", Cell: ({ cell }) => Number(cell.getValue()).toFixed(2) },

    {
      header: "Actions",
      Cell: ({ row }) => (
        <Box sx={{ display: "flex", gap: 1 }}>
          <Button
            size="small"
            variant="outlined"
            onClick={() => handleEdit(row.original)}
          >
            Edit
          </Button>

          <Button
            size="small"
            variant="contained"
            color="secondary"
            onClick={() =>
              navigate(`/purchase-invoices?purchase_order_id=${row.original.id}`)
            }
          >
            View Invoice
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
          Add Purchase Order
        </Button>
      </Box>

      <MaterialReactTable columns={columns} data={orders} />

      {openDialog && (
        <PurchaseOrderDialog
          open={openDialog}
          onClose={() => setOpenDialog(false)}
          order={editingOrder}
          itemsInit={editingItems}
          onSave={editingOrder ? handleUpdate : handleAdd}
        />
      )}
    </Box>
  );
}

