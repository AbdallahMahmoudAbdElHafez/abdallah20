import React, { useEffect, useState, useCallback, useMemo } from "react";
import { 
  Box, 
  Button, 
  CircularProgress, 
  Alert,
  Typography,
  Chip
} from "@mui/material";
import { MaterialReactTable } from "material-react-table";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  fetchPurchaseOrders,
  updatePurchaseOrder,
  addPurchaseOrder,
} from "../features/purchaseOrders/purchaseOrdersSlice";
import { fetchItemsByOrder } from "../features/purchaseOrderItems/purchaseOrderItemsSlice";
import PurchaseOrderDialog from "../components/PurchaseOrderDialog";

// Helper function to format currency
const formatCurrency = (value) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2
  }).format(Number(value) || 0);
};

// Helper function to format percentage
const formatPercentage = (value) => {
  return `${Number(value) || 0}%`;
};

// Status color mapping
const getStatusColor = (status) => {
  const statusColors = {
    'pending': 'warning',
    'approved': 'success',
    'rejected': 'error',
    'completed': 'info',
    'draft': 'default'
  };
  return statusColors[status?.toLowerCase()] || 'default';
};

export default function PurchaseOrdersPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  // Redux state
  const { 
    items: orders = [], 
    loading, 
    error 
  } = useSelector((state) => state.purchaseOrders);

  // Local state
  const [openDialog, setOpenDialog] = useState(false);
  const [editingOrder, setEditingOrder] = useState(null);
  const [editingItems, setEditingItems] = useState([]);
  const [actionLoading, setActionLoading] = useState(false);

  // Fetch orders on component mount
  useEffect(() => {
    dispatch(fetchPurchaseOrders());
  }, [dispatch]);

  // Memoized handlers to prevent unnecessary re-renders
  const handleEdit = useCallback(async (order) => {
    try {
      setActionLoading(true);
      const res = await dispatch(fetchItemsByOrder(order.id)).unwrap();
      setEditingOrder(order);
      setEditingItems(res);
      setOpenDialog(true);
    } catch (error) {
      console.error('Failed to fetch order items:', error);
      // You might want to show a toast notification here
    } finally {
      setActionLoading(false);
    }
  }, [dispatch]);

  const handleUpdate = useCallback(async (payload) => {
    try {
      setActionLoading(true);
      await dispatch(updatePurchaseOrder({ 
        id: editingOrder.id, 
        data: payload 
      })).unwrap();
      setOpenDialog(false);
      // Optionally show success message
    } catch (error) {
      console.error('Failed to update purchase order:', error);
      // Handle error (show toast, etc.)
    } finally {
      setActionLoading(false);
    }
  }, [dispatch, editingOrder?.id]);

  const handleCreate = useCallback(() => {
    setEditingOrder(null);
    setEditingItems([]);
    setOpenDialog(true);
  }, []);

  const handleAdd = useCallback(async (payload) => {
    try {
      setActionLoading(true);
      await dispatch(addPurchaseOrder(payload)).unwrap();
      setOpenDialog(false);
      // Optionally show success message
    } catch (error) {
      console.error('Failed to add purchase order:', error);
      // Handle error (show toast, etc.)
    } finally {
      setActionLoading(false);
    }
  }, [dispatch]);

  const handleCloseDialog = useCallback(() => {
    setOpenDialog(false);
    setEditingOrder(null);
    setEditingItems([]);
  }, []);

  const handleViewInvoice = useCallback((orderId) => {
    navigate(`/purchase-invoices?purchase_order_id=${orderId}`);
  }, [navigate]);

  // Memoized columns definition
  const columns = useMemo(() => [
    { 
      accessorKey: "order_number", 
      header: "Order Number",
      size: 150,
    },
    { 
      accessorKey: "order_date", 
      header: "Order Date",
      size: 120,
      Cell: ({ cell }) => {
        const date = new Date(cell.getValue());
        return date.toLocaleDateString();
      }
    },
    { 
      accessorKey: "status", 
      header: "Status",
      size: 120,
      Cell: ({ cell }) => (
        <Chip 
          label={cell.getValue()} 
          color={getStatusColor(cell.getValue())}
          size="small"
        />
      )
    },
    { 
      accessorKey: "subtotal", 
      header: "Subtotal",
      size: 120,
      Cell: ({ cell }) => formatCurrency(cell.getValue())
    },
    { 
      accessorKey: "additional_discount", 
      header: "Add. Discount",
      size: 130,
      Cell: ({ cell }) => formatCurrency(cell.getValue())
    },
    { 
      accessorKey: "vat_rate", 
      header: "VAT %",
      size: 100,
      Cell: ({ cell }) => formatPercentage(cell.getValue())
    },
    { 
      accessorKey: "vat_amount", 
      header: "VAT Amount",
      size: 120,
      Cell: ({ cell }) => formatCurrency(cell.getValue())
    },
    { 
      accessorKey: "tax_rate", 
      header: "Tax %",
      size: 100,
      Cell: ({ cell }) => formatPercentage(cell.getValue())
    },
    { 
      accessorKey: "tax_amount", 
      header: "Tax Amount",
      size: 120,
      Cell: ({ cell }) => formatCurrency(cell.getValue())
    },
    { 
      accessorKey: "total_amount", 
      header: "Total Amount",
      size: 140,
      Cell: ({ cell }) => (
        <Typography variant="body2" fontWeight="bold">
          {formatCurrency(cell.getValue())}
        </Typography>
      )
    },
    {
      header: "Actions",
      size: 200,
      enableColumnActions: false,
      Cell: ({ row }) => (
        <Box sx={{ display: "flex", gap: 1, flexWrap: 'wrap' }}>
          <Button
            size="small"
            variant="outlined"
            onClick={() => handleEdit(row.original)}
            disabled={actionLoading}
          >
            Edit
          </Button>
          <Button
            size="small"
            variant="contained"
            color="secondary"
            onClick={() => handleViewInvoice(row.original.id)}
          >
            View Invoice
          </Button>
        </Box>
      ),
    },
  ], [handleEdit, handleViewInvoice, actionLoading]);

  // Loading state
  if (loading === "loading") {
    return (
      <Box sx={{ 
        display: "flex", 
        justifyContent: "center", 
        alignItems: "center",
        minHeight: "400px"
      }}>
        <CircularProgress />
      </Box>
    );
  }

  // Error state
  if (error) {
    return (
      <Box p={2}>
        <Alert severity="error" sx={{ mb: 2 }}>
          Failed to load purchase orders: {error}
        </Alert>
        <Button 
          variant="contained" 
          onClick={() => dispatch(fetchPurchaseOrders())}
        >
          Retry
        </Button>
      </Box>
    );
  }

  return (
    <Box p={2}>
      {/* Header */}
      <Box sx={{ 
        display: "flex", 
        justifyContent: "space-between", 
        alignItems: "center",
        mb: 3 
      }}>
        <Typography variant="h4" component="h1">
          Purchase Orders
        </Typography>
        <Button 
          variant="contained" 
          onClick={handleCreate}
          disabled={actionLoading}
        >
          Add Purchase Order
        </Button>
      </Box>

      {/* Data Table */}
      <MaterialReactTable 
        columns={columns} 
        data={orders}
        enableRowSelection={false}
        enableColumnFilters
        enableSorting
        enablePagination
        initialState={{
          pagination: { pageSize: 25, pageIndex: 0 },
          sorting: [{ id: 'order_date', desc: true }]
        }}
        muiTableProps={{
          sx: {
            '& .MuiTableCell-root': {
              borderBottom: '1px solid rgba(224, 224, 224, 1)',
            },
          },
        }}
        muiTableHeadCellProps={{
          sx: {
            fontWeight: 'bold',
            backgroundColor: 'rgba(0, 0, 0, 0.04)',
          },
        }}
      />

      {/* Dialog */}
      {openDialog && (
        <PurchaseOrderDialog
          open={openDialog}
          onClose={handleCloseDialog}
          order={editingOrder}
          itemsInit={editingItems}
          onSave={editingOrder ? handleUpdate : handleAdd}
          loading={actionLoading}
        />
      )}
    </Box>
  );
}