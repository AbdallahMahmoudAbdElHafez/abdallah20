import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  MenuItem,
  Breadcrumbs,
  Typography,
  Link,
  CircularProgress,
} from "@mui/material";
import { MaterialReactTable } from "material-react-table";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchPurchaseOrders,
  addPurchaseOrder,
  updatePurchaseOrder,
  deletePurchaseOrder,
} from "../features/purchaseOrders/purchaseOrdersSlice";
import { fetchParties } from "../features/parties/partiesSlice"; // suppliers
import PurchaseOrderItemsTable from "../components/PurchaseOrderItemsTable";

const PurchaseOrdersPage = () => {
  const dispatch = useDispatch();

  const { items:orders , loading: ordersStatus } = useSelector(
    (state) => state.purchaseOrders
  );
const { items: parties, loading: partiesStatus } = useSelector(
  (state) => state.parties
);

  const [openDialog, setOpenDialog] = useState(false);
  const [editOrder, setEditOrder] = useState(null);
  const [formData, setFormData] = useState({
    supplier_id: "",
    order_number: "",
    order_date: "",
    status: "draft",
    total_amount: 0,
  });

  useEffect(() => {
    dispatch(fetchPurchaseOrders());
    dispatch(fetchParties());
  }, [dispatch]);

  const handleOpenDialog = (order = null) => {
    setEditOrder(order);
    setFormData(
      order
        ? {
            supplier_id: order.supplier_id || "",
            order_number: order.order_number || "",
            order_date: order.order_date || "",
            status: order.status || "draft",
            total_amount: order.total_amount || 0,
          }
        : {
            supplier_id: "",
            order_number: "",
            order_date: "",
            status: "draft",
            total_amount: 0,
          }
    );
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditOrder(null);
  };

  const handleSave = () => {
    if (editOrder) {
      dispatch(updatePurchaseOrder({ id: editOrder.id, data: formData }));
    } else {
      dispatch(addPurchaseOrder(formData));
    }
    handleCloseDialog();
  };

  const handleDelete = (id) => {
    dispatch(deletePurchaseOrder(id));
  };

  const columns = [
    {
      accessorKey: "supplier_id",
      header: "Supplier",
      Cell: ({ cell }) => {
        const supplier = parties.find((p) => p.id === cell.getValue());
        return supplier?.name || "—";
      },
    },
    { accessorKey: "order_number", header: "Order Number" },
    { accessorKey: "order_date", header: "Order Date" },
    { accessorKey: "status", header: "Status" },
    { accessorKey: "total_amount", header: "Total Amount" },
    {
      header: "Actions",
      Cell: ({ row }) => (
        <Box sx={{ display: "flex", gap: 1 }}>
          <Button
            size="small"
            variant="outlined"
            onClick={() => handleOpenDialog(row.original)}
          >
            Edit
          </Button>
          <Button
            size="small"
            variant="outlined"
            color="error"
            onClick={() => handleDelete(row.original.id)}
          >
            Delete
          </Button>
        </Box>
      ),
    },
  ];

  const isLoading = ordersStatus === "loading" || partiesStatus === "loading";

  return (
    <Box p={2}>
      {/* Breadcrumbs */}
      <Breadcrumbs sx={{ mb: 2 }}>
        <Link underline="hover" color="inherit" href="/">
          Home
        </Link>
        <Typography color="text.primary">Purchase Orders</Typography>
      </Breadcrumbs>

      <Box sx={{ mb: 2 }}>
        <Button variant="contained" onClick={() => handleOpenDialog()}>
          Add Purchase Order
        </Button>
      </Box>

      {isLoading ? (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            mt: 5,
          }}
        >
          <CircularProgress />
        </Box>
      ) : (
        <MaterialReactTable
          columns={columns}
          data={Array.isArray(orders) ? orders : []}
          enableExpanding
          renderDetailPanel={({ row }) => (
            <Box sx={{ p: 2, bgcolor: "#f9f9f9", borderRadius: 2 }}>
              <Typography variant="h6" gutterBottom>
              
                Items for Order #{row.original.order_number}
              </Typography>
              <PurchaseOrderItemsTable orderId={row.original.id} />
            </Box>
          )}
        />
      )}

      {/* Dialog for Add/Edit */}
      <Dialog open={openDialog} onClose={handleCloseDialog} fullWidth maxWidth="sm">
        <DialogTitle>
          {editOrder ? "Edit Purchase Order" : "Add Purchase Order"}
        </DialogTitle>
        <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
          <TextField
            select
            label="Supplier"
            value={formData.supplier_id}
            onChange={(e) => setFormData({ ...formData, supplier_id: e.target.value })}
          >
            <MenuItem value="">None</MenuItem>
            {Array.isArray(parties) &&
              parties
                .filter((p) => p.party_type === "supplier")
                .map((p) => (
                  <MenuItem key={p.id} value={p.id}>
                    {p.name}
                  </MenuItem>
                ))}
          </TextField>

          <TextField
            label="Order Number"
            value={formData.order_number}
            onChange={(e) => setFormData({ ...formData, order_number: e.target.value })}
          />

          <TextField
            type="date"
            label="Order Date"
            InputLabelProps={{ shrink: true }}
            value={formData.order_date}
            onChange={(e) => setFormData({ ...formData, order_date: e.target.value })}
          />

          <TextField
            select
            label="Status"
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
          >
            <MenuItem value="draft">Draft</MenuItem>
            <MenuItem value="approved">Approved</MenuItem>
            <MenuItem value="closed">Closed</MenuItem>
            <MenuItem value="cancelled">Cancelled</MenuItem>
          </TextField>

          <TextField
            label="Total Amount"
            type="number"
            value={formData.total_amount}
            onChange={(e) => setFormData({ ...formData, total_amount: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSave} variant="contained">
            {editOrder ? "Update" : "Save"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default PurchaseOrdersPage;
