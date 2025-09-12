// client/src/pages/PurchaseInvoicesPage.jsx
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
  deletePurchaseInvoice,
  fetchPurchaseInvoices,
  addPurchaseInvoice,
  updatePurchaseInvoice,
} from "../features/purchaseInvoices/purchaseInvoicesSlice";
import { fetchParties } from "../features/parties/partiesSlice";
import { fetchPurchaseOrders } from "../features/purchaseOrders/purchaseOrdersSlice";
import PurchaseInvoiceItemsTable from "../components/PurchaseInvoiceItemsTable";
import { useLocation } from "react-router-dom";

const PurchaseInvoicesPage = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const filterPurchaseOrderId = params.get("purchase_order_id");

  const { items: invoices, loading: invoicesStatus } = useSelector(
    (state) => state.purchaseInvoices
  );
  const { items: purchaseOrders, loading: purchaseOrdersStatus } = useSelector(
    (state) => state.purchaseOrders
  );
  const { items: suppliers, loading: suppliersStatus } = useSelector(
    (state) => state.parties
  );

  const [openDialog, setOpenDialog] = useState(false);
  const [editInvoice, setEditInvoice] = useState(null);
  const [formData, setFormData] = useState({
    supplier_id: "",
    invoice_number: "",
    invoice_date: "",
    due_date: "",
    status: "unpaid",
    subtotal: 0,
    additional_discount: 0,
    vat_rate: 0,
    vat_amount: 0,
    tax_rate: 0,
    tax_amount: 0,
    total_amount: 0,
  });

  useEffect(() => {
    dispatch(fetchPurchaseInvoices());
    dispatch(fetchPurchaseOrders());
    dispatch(fetchParties());
  }, [dispatch]);

  const handleOpenDialog = (invoice = null) => {
    setEditInvoice(invoice);
    setFormData(
      invoice
        ? {
            supplier_id: invoice.supplier_id || "",
            invoice_number: invoice.invoice_number || "",
            invoice_date: invoice.invoice_date || "",
            due_date: invoice.due_date || "",
            status: invoice.status || "unpaid",
            subtotal: invoice.subtotal || 0,
            additional_discount: invoice.additional_discount || 0,
            vat_rate: invoice.vat_rate || 0,
            vat_amount: invoice.vat_amount || 0,
            tax_rate: invoice.tax_rate || 0,
            tax_amount: invoice.tax_amount || 0,
            total_amount: invoice.total_amount || 0,
          }
        : {
            supplier_id: "",
            invoice_number: "",
            invoice_date: "",
            due_date: "",
            status: "unpaid",
            subtotal: 0,
            additional_discount: 0,
            vat_rate: 0,
            vat_amount: 0,
            tax_rate: 0,
            tax_amount: 0,
            total_amount: 0,
          }
    );
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditInvoice(null);
  };

  const handleSave = () => {
    // نضيف purchase_order_id من الـparams عند الإضافة
    const payload = editInvoice
      ? formData
      : { ...formData, purchase_order_id: filterPurchaseOrderId || null };

    if (editInvoice) {
      dispatch(updatePurchaseInvoice({ id: editInvoice.id, data: payload }));
    } else {
      dispatch(addPurchaseInvoice(payload));
    }
    handleCloseDialog();
  };

  const handleDelete = (id) => {
    dispatch(deletePurchaseInvoice(id));
  };

  const columns = [
    { accessorKey: "invoice_number", header: "Invoice Number" },
    {
      accessorKey: "supplier_id",
      header: "Supplier",
      Cell: ({ cell }) => {
        const supplier = suppliers.find((s) => s.id === cell.getValue());
        return supplier?.name || "—";
      },
    },
    {
      accessorKey: "purchase_order_id",
      header: "Purchase Order",
      Cell: ({ cell }) => {
        const po = purchaseOrders.find((p) => p.id === cell.getValue());
        return po?.order_number || "—";
      },
    },
    { accessorKey: "invoice_date", header: "Invoice Date" },
    { accessorKey: "due_date", header: "Due Date" },
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

  const filteredInvoices = filterPurchaseOrderId
    ? invoices.filter(
        (inv) => inv.purchase_order_id === Number(filterPurchaseOrderId)
      )
    : invoices;

  const isLoading =
    invoicesStatus === "loading" ||
    purchaseOrdersStatus === "loading" ||
    suppliersStatus === "loading";

  return (
    <Box p={2}>
      {/* Breadcrumbs */}
      <Breadcrumbs sx={{ mb: 2 }}>
        <Link underline="hover" color="inherit" href="/">
          Home
        </Link>
        <Typography color="text.primary">Purchase Invoices</Typography>
      </Breadcrumbs>

      <Box sx={{ mb: 2 }}>
        <Button variant="contained" onClick={() => handleOpenDialog()}>
          Add Invoice
        </Button>
      </Box>

      {isLoading ? (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
          <CircularProgress />
        </Box>
      ) : (
        <MaterialReactTable
          columns={columns}
          data={Array.isArray(filteredInvoices) ? filteredInvoices : []}
          enableExpanding
          renderDetailPanel={({ row }) => (
            <Box sx={{ p: 2, backgroundColor: "#fafafa", borderRadius: 2 }}>
              <Typography variant="subtitle1" gutterBottom>
                Invoice Items
              </Typography>
              <PurchaseInvoiceItemsTable invoiceId={row.original.id} />
            </Box>
          )}
        />
      )}

      {/* Dialog for Add/Edit */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>
          {editInvoice ? "Edit Purchase Invoice" : "Add Purchase Invoice"}
        </DialogTitle>
        <DialogContent
          sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}
        >
          <TextField
            select
            label="Supplier"
            value={formData.supplier_id}
            onChange={(e) =>
              setFormData({ ...formData, supplier_id: e.target.value })
            }
          >
            <MenuItem value="">None</MenuItem>
            {Array.isArray(suppliers) &&
              suppliers
                .filter((s) => s.party_type === "supplier")
                .map((s) => (
                  <MenuItem key={s.id} value={s.id}>
                    {s.name}
                  </MenuItem>
                ))}
          </TextField>

          <TextField
            label="Invoice Number"
            value={formData.invoice_number}
            onChange={(e) =>
              setFormData({ ...formData, invoice_number: e.target.value })
            }
          />
          <TextField
            type="date"
            label="Invoice Date"
            InputLabelProps={{ shrink: true }}
            value={formData.invoice_date}
            onChange={(e) =>
              setFormData({ ...formData, invoice_date: e.target.value })
            }
          />
          <TextField
            type="date"
            label="Due Date"
            InputLabelProps={{ shrink: true }}
            value={formData.due_date || ""}
            onChange={(e) =>
              setFormData({ ...formData, due_date: e.target.value })
            }
          />

          <TextField
            select
            label="Status"
            value={formData.status}
            onChange={(e) =>
              setFormData({ ...formData, status: e.target.value })
            }
          >
            <MenuItem value="unpaid">Unpaid</MenuItem>
            <MenuItem value="paid">Paid</MenuItem>
            <MenuItem value="partially_paid">Partially Paid</MenuItem>
            <MenuItem value="cancelled">Cancelled</MenuItem>
          </TextField>

          <TextField
            label="Subtotal"
            type="number"
            value={formData.subtotal}
            onChange={(e) =>
              setFormData({ ...formData, subtotal: e.target.value })
            }
          />
          <TextField
            label="Additional Discount"
            type="number"
            value={formData.additional_discount}
            onChange={(e) =>
              setFormData({
                ...formData,
                additional_discount: e.target.value,
              })
            }
          />
          <TextField
            label="VAT Rate (%)"
            type="number"
            value={formData.vat_rate}
            onChange={(e) =>
              setFormData({ ...formData, vat_rate: e.target.value })
            }
          />
          <TextField
            label="Tax Rate (%)"
            type="number"
            value={formData.tax_rate}
            onChange={(e) =>
              setFormData({ ...formData, tax_rate: e.target.value })
            }
          />
          <TextField
            label="Total Amount"
            type="number"
            value={formData.total_amount}
            onChange={(e) =>
              setFormData({ ...formData, total_amount: e.target.value })
            }
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSave} variant="contained">
            {editInvoice ? "Update" : "Save"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default PurchaseInvoicesPage;
