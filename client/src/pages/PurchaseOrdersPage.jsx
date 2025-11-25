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
import { defaultTableProps } from "../config/tableConfig";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  fetchPurchaseOrders,
  updatePurchaseOrder,
  addPurchaseOrder,
} from "../features/purchaseOrders/purchaseOrdersSlice";
import { fetchItemsByOrder } from "../features/purchaseOrderItems/purchaseOrderItemsSlice";
import PurchaseOrderDialog from "../components/PurchaseOrderDialog";

// دالة لتنسيق العملة
const formatCurrency = (value) => {
  return new Intl.NumberFormat('ar-EG', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2
  }).format(Number(value) || 0);
};

// دالة لتنسيق النسبة المئوية
const formatPercentage = (value) => {
  return `${Number(value) || 0}%`;
};

// ألوان الحالات
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

  const {
    items: orders = [],
    loading,
    error
  } = useSelector((state) => state.purchaseOrders);

  const [openDialog, setOpenDialog] = useState(false);
  const [editingOrder, setEditingOrder] = useState(null);
  const [editingItems, setEditingItems] = useState([]);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    dispatch(fetchPurchaseOrders());
  }, [dispatch]);

  const handleEdit = useCallback(async (order) => {
    try {
      setActionLoading(true);
      const res = await dispatch(fetchItemsByOrder(order.id)).unwrap();
      setEditingOrder(order);
      setEditingItems(res);
      setOpenDialog(true);
    } catch (error) {
      console.error('فشل في جلب عناصر الطلب:', error);
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
    } catch (error) {
      console.error('فشل في تحديث أمر الشراء:', error);
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
    } catch (error) {
      console.error('فشل في إضافة أمر الشراء:', error);
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

  const columns = useMemo(() => [
    {
      accessorKey: "order_number",
      header: "رقم الطلب",
      size: 150,
    },
    {
      accessorKey: "order_date",
      header: "تاريخ الطلب",
      size: 120,
      Cell: ({ cell }) => {
        const date = new Date(cell.getValue());
        return date.toLocaleDateString('ar-EG');
      }
    },
    {
      accessorKey: "status",
      header: "الحالة",
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
      header: "الإجمالي قبل الضريبة",
      size: 120,
      Cell: ({ cell }) => formatCurrency(cell.getValue())
    },
    {
      accessorKey: "additional_discount",
      header: "الخصم الإضافي",
      size: 130,
      Cell: ({ cell }) => formatCurrency(cell.getValue())
    },
    {
      accessorKey: "vat_rate",
      header: "نسبة الضريبة المضافة",
      size: 130,
      Cell: ({ cell }) => formatPercentage(cell.getValue())
    },
    {
      accessorKey: "vat_amount",
      header: "قيمة الضريبة المضافة",
      size: 140,
      Cell: ({ cell }) => formatCurrency(cell.getValue())
    },
    {
      accessorKey: "tax_rate",
      header: "نسبة الضريبة",
      size: 100,
      Cell: ({ cell }) => formatPercentage(cell.getValue())
    },
    {
      accessorKey: "tax_amount",
      header: "قيمة الضريبة",
      size: 120,
      Cell: ({ cell }) => formatCurrency(cell.getValue())
    },
    {
      accessorKey: "total_amount",
      header: "الإجمالي النهائي",
      size: 140,
      Cell: ({ cell }) => (
        <Typography variant="body2" fontWeight="bold">
          {formatCurrency(cell.getValue())}
        </Typography>
      )
    },
    {
      header: "العمليات",
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
            تعديل
          </Button>
          <Button
            size="small"
            variant="contained"
            color="secondary"
            onClick={() => handleViewInvoice(row.original.id)}
          >
            عرض الفاتورة
          </Button>
        </Box>
      ),
    },
  ], [handleEdit, handleViewInvoice, actionLoading]);

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

  if (error) {
    return (
      <Box p={2}>
        <Alert severity="error" sx={{ mb: 2 }}>
          فشل في تحميل أوامر الشراء: {error}
        </Alert>
        <Button
          variant="contained"
          onClick={() => dispatch(fetchPurchaseOrders())}
        >
          إعادة المحاولة
        </Button>
      </Box>
    );
  }

  return (
    <Box p={2}>
      <Box sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        mb: 3
      }}>
        <Typography variant="h4" component="h1">
          أوامر الشراء
        </Typography>
        <Button
          variant="contained"
          onClick={handleCreate}
          disabled={actionLoading}
        >
          إضافة أمر شراء
        </Button>
      </Box>

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
