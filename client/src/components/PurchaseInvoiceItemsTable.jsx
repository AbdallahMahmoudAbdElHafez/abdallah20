// client/src/components/PurchaseInvoiceItemsTable.jsx
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
  CircularProgress,
} from "@mui/material";
import { MaterialReactTable } from "material-react-table";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchItemsByOrder,
  createItem,
  updateItem,
  deleteItem,
  clearItems,
} from "../features/purchaseInvoiceItems/purchaseInvoiceItemsSlice";
import { fetchProducts } from "../features/products/productsSlice";
import { fetchWarehouses } from "../features/warehouses/warehousesSlice";
const PurchaseInvoiceItemsTable = ({ invoiceId }) => {
  const dispatch = useDispatch();

  const { items = [], loading: itemsStatus } = useSelector(
    (state) => state.purchaseInvoiceItems || {}
  );

  const { items: products = [], loading: productsStatus } = useSelector(
    (state) => state.products || {}
  );
  const { items: warehouses = [], loading: warehousesStatus } = useSelector(
    (state) => state.warehouses || {}
  );

  const [openDialog, setOpenDialog] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [formData, setFormData] = useState({
    product_id: "",
    warehouse_id: "",
    batch_number: "",
    expiry_date: "",
    quantity: "",
    bonus_quantity: "",
    unit_price: "",
    discount: "",
  });

  useEffect(() => {
    if (invoiceId) {
      dispatch(fetchItemsByOrder(invoiceId));
      dispatch(fetchProducts());
      dispatch(fetchWarehouses());
    }
    return () => {
      dispatch(clearItems());
    };
  }, [dispatch, invoiceId]);

  const handleOpenDialog = (item = null) => {
    setEditItem(item);
    setFormData(
      item
        ? {
          product_id: item.product_id,
          warehouse_id: item.warehouse_id,
          batch_number: item.batch_number || "",
          expiry_date: item.expiry_date || "",
          quantity: item.quantity,
          bonus_quantity: item.bonus_quantity || "",
          unit_price: item.unit_price,
          discount: item.discount,
        }
        : {
          product_id: "",
          warehouse_id: "",
          batch_number: "",
          expiry_date: "",
          quantity: "",
          bonus_quantity: "",
          unit_price: "",
          discount: "",
        }
    );
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditItem(null);
  };

  const handleSave = () => {
    if (editItem) {
      dispatch(
        updateItem({
          id: editItem.id,
          data: { ...formData, purchase_invoice_id: invoiceId },
        })
      );
    } else {
      dispatch(
        createItem({ ...formData, purchase_invoice_id: invoiceId })
      );
    }
    handleCloseDialog();
  };

  const handleDelete = (id) => {
    dispatch(deleteItem(id));
  };

  const columns = [
    {
      accessorKey: "product_id",
      header: "Product",
      Cell: ({ cell }) => {
        const product = products.find((p) => p.id === cell.getValue());
        return product ? product.name : "—";
      },
    },
    { accessorKey: "batch_number", header: "Batch Number" },
    { accessorKey: "expiry_date", header: "Expiry Date" },
    { accessorKey: "quantity", header: "Quantity" },
    { accessorKey: "bonus_quantity", header: "Bonus Quantity" },
    { accessorKey: "unit_price", header: "Unit Price" },
    { accessorKey: "discount", header: "Discount" },
    { accessorKey: "total_price", header: "Total Price" },
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

  const isLoading = productsStatus === "loading" || itemsStatus === "loading" || warehousesStatus === "loading";

  return (
    <Box>
      <Box sx={{ mb: 2 }}>
        <Button variant="contained" onClick={() => handleOpenDialog()}>
          Add Item
        </Button>
      </Box>

      {isLoading ? (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
          <CircularProgress />
        </Box>
      ) : (
        <MaterialReactTable columns={columns} data={items} />
      )}

      {/* Dialog */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>
          {editItem ? "Edit Purchase Invoice Item" : "Add Purchase Invoice Item"}
        </DialogTitle>
        <DialogContent
          sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}
        >
          <TextField
            select
            label="Product"
            value={formData.product_id}
            onChange={(e) => {
              const selectedId = e.target.value;
              const selectedProduct = products.find(p => p.id === selectedId);
              setFormData({
                ...formData,
                product_id: selectedId,
                // اجلب cost_price من المنتج كقيمة مبدئية للسعر
                unit_price: selectedProduct ? selectedProduct.cost_price : "",
              });
            }}
          >
            {products.map((p) => (
              <MenuItem key={p.id} value={p.id}>
                {p.name}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            select
            label="Warehouse"
            value={formData.warehouse_id}
            onChange={(e) => setFormData({ ...formData, warehouse_id: e.target.value })}
          >
            {warehouses.map((w) => (
              <MenuItem key={w.id} value={w.id}>
                {w.name}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            label="Batch Number"
            value={formData.batch_number}
            onChange={(e) =>
              setFormData({ ...formData, batch_number: e.target.value })
            }
          />
          <TextField
            type="date"
            label="Expiry Date"
            InputLabelProps={{ shrink: true }}
            value={formData.expiry_date}
            onChange={(e) =>
              setFormData({ ...formData, expiry_date: e.target.value })
            }
          />
          <TextField
            label="Quantity"
            type="number"
            value={formData.quantity}
            onChange={(e) =>
              setFormData({ ...formData, quantity: e.target.value })
            }
          />
          <TextField
            label="Bonus Quantity"
            type="number"
            value={formData.bonus_quantity}
            onChange={(e) =>
              setFormData({ ...formData, bonus_quantity: e.target.value })
            }
          />
          <TextField
            label="Unit Price"
            type="number"
            value={formData.unit_price}
            onChange={(e) =>
              setFormData({ ...formData, unit_price: e.target.value })
            }
          />
          <TextField
            label="Discount"
            type="number"
            value={formData.discount}
            onChange={(e) =>
              setFormData({ ...formData, discount: e.target.value })
            }
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSave} variant="contained">
            {editItem ? "Update" : "Save"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default PurchaseInvoiceItemsTable;
