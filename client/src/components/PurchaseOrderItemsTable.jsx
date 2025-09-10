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
} from "@mui/material";
import { MaterialReactTable } from "material-react-table";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchItemsByOrder,
  createItem,
  updateItem,
  deleteItem,
  clearItems,
} from "../features/purchaseOrderItems/purchaseOrderItemsSlice";
import { fetchProducts } from "../features/products/productsSlice"; // assuming you already have productsSlice

const PurchaseOrderItemsTable = ({ orderId }) => {
  const dispatch = useDispatch();


   const { items = [], loading: itemsStatus } = useSelector(
  (state) => state.purchaseOrderItems || {}
);

const { items: products = [], loading: productsStatus } = useSelector(
  (state) => state.products || {}
);

  const [openDialog, setOpenDialog] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [formData, setFormData] = useState({
    product_id: "",
    batch_number: "",
    expiry_date: "",
    quantity: "",
    unit_price: "",
    discount: "",
    expected_date: "",
  });

  useEffect(() => {
    if (orderId) {

      dispatch(fetchItemsByOrder(orderId));
      dispatch(fetchProducts());
    }
    return () => {
      dispatch(clearItems());
    };
  }, [dispatch, orderId]);

  const handleOpenDialog = (item = null) => {
    setEditItem(item);
    setFormData(
      item
        ? {
          product_id: item.product_id,
          batch_number: item.batch_number || "",
          expiry_date: item.expiry_date || "",
          quantity: item.quantity,
          unit_price: item.unit_price,
          discount: item.discount,
          expected_date: item.expected_date || "",
        }
        : {
          product_id: "",
          batch_number: "",
          expiry_date: "",
          quantity: "",
          unit_price: "",
          discount: "",
          expected_date: "",
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
      dispatch(updateItem({ id: editItem.id, data: { ...formData, purchase_order_id: orderId } }));
    } else {
      dispatch(createItem({ ...formData, purchase_order_id: orderId }));
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
    { accessorKey: "unit_price", header: "Unit Price" },
    { accessorKey: "discount", header: "Discount" },
    { accessorKey: "total_price", header: "Total Price" },
    { accessorKey: "expected_date", header: "Expected Date" },
    {
      header: "Actions",
      Cell: ({ row }) => (
        <Box sx={{ display: "flex", gap: 1 }}>
          <Button size="small" variant="outlined" onClick={() => handleOpenDialog(row.original)}>
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
  const isLoading = productsStatus === "loading" || itemsStatus === "loading";
  return (
    <Box>
      <Box sx={{ mb: 2 }}>
        <Button variant="contained" onClick={() => handleOpenDialog()}>
          Add Item
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
            ) :(
      <MaterialReactTable columns={columns} data={items} />
            )}
      {/* Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} fullWidth maxWidth="sm">
        <DialogTitle>{editItem ? "Edit Item" : "Add Item"}</DialogTitle>
        <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
          <TextField
            select
            label="Product"
            value={formData.product_id}
            onChange={(e) => setFormData({ ...formData, product_id: e.target.value })}
          >
            {products.map((p) => (
              <MenuItem key={p.id} value={p.id}>
                {p.name}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            label="Batch Number"
            value={formData.batch_number}
            onChange={(e) => setFormData({ ...formData, batch_number: e.target.value })}
          />
          <TextField
            type="date"
            label="Expiry Date"
            InputLabelProps={{ shrink: true }}
            value={formData.expiry_date}
            onChange={(e) => setFormData({ ...formData, expiry_date: e.target.value })}
          />
          <TextField
            label="Quantity"
            type="number"
            value={formData.quantity}
            onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
          />
          <TextField
            label="Unit Price"
            type="number"
            value={formData.unit_price}
            onChange={(e) => setFormData({ ...formData, unit_price: e.target.value })}
          />
          <TextField
            label="Discount"
            type="number"
            value={formData.discount}
            onChange={(e) => setFormData({ ...formData, discount: e.target.value })}
          />
          <TextField
            type="date"
            label="Expected Date"
            InputLabelProps={{ shrink: true }}
            value={formData.expected_date}
            onChange={(e) => setFormData({ ...formData, expected_date: e.target.value })}
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

export default PurchaseOrderItemsTable;
