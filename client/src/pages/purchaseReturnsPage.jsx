import React, { useEffect, useMemo, useState } from "react";
import {
    Box,
    CircularProgress,
    Alert,
    Typography,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    MenuItem,
    IconButton,
    Tooltip,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Checkbox,
    Paper
} from "@mui/material";
import { MaterialReactTable } from "material-react-table";
import { useDispatch, useSelector } from "react-redux";
import {
    fetchPurchaseReturns,
    addPurchaseReturn,
    updatePurchaseReturn,
    deletePurchaseReturn
} from "../features/purchaseReturns/purchaseReturnsSlice";
import { fetchPurchaseInvoices } from "../features/purchaseInvoices/purchaseInvoicesSlice";
import { fetchItemsByInvoice } from "../features/purchaseInvoiceItems/purchaseInvoiceItemsSlice";
import { createPurchaseReturnItem } from "../features/purchaseReturnItems/PurchaseReturnItemsSlice";
import { Edit as EditIcon, Delete as DeleteIcon, Add as AddIcon } from "@mui/icons-material";

// دالة لتنسيق العملة
const formatCurrency = (value) => {
    return new Intl.NumberFormat('ar-EG', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2
    }).format(Number(value) || 0);
};

export default function PurchaseReturnsPage() {
    const dispatch = useDispatch();

    const {
        items: returns = [],
        loading,
        error
    } = useSelector((state) => state.purchaseReturns);

    const {
        items: invoices = []
    } = useSelector((state) => state.purchaseInvoices);

    const {
        items: invoiceItems = []
    } = useSelector((state) => state.purchaseInvoiceItems);

    const [open, setOpen] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [editingReturn, setEditingReturn] = useState(null);
    const [itemToDelete, setItemToDelete] = useState(null);
    const [formData, setFormData] = useState({
        purchase_invoice_id: "",
        return_date: new Date().toISOString().split('T')[0],
        notes: "",
        total_amount: "",
        tax_amount: ""
    });

    // State for selected items to return
    const [selectedItems, setSelectedItems] = useState({}); // { itemId: { isSelected: true, quantity: 1 } }

    useEffect(() => {
        dispatch(fetchPurchaseReturns());
        dispatch(fetchPurchaseInvoices());
    }, [dispatch]);

    const handleOpen = (returnItem = null) => {
        if (returnItem) {
            setEditingReturn(returnItem);
            setFormData({
                purchase_invoice_id: returnItem.purchase_invoice_id,
                return_date: new Date(returnItem.return_date).toISOString().split('T')[0],
                notes: returnItem.notes || "",
                total_amount: returnItem.total_amount,
                tax_amount: returnItem.tax_amount || ""
            });
            // TODO: Fetch existing return items if editing
        } else {
            setEditingReturn(null);
            setFormData({
                purchase_invoice_id: "",
                return_date: new Date().toISOString().split('T')[0],
                notes: "",
                total_amount: "",
                tax_amount: ""
            });
            setSelectedItems({});
        }
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setEditingReturn(null);
        setSelectedItems({});
    };

    const handleInvoiceChange = (invoiceId) => {
        setFormData({ ...formData, purchase_invoice_id: invoiceId });
        dispatch(fetchItemsByInvoice(invoiceId));
        setSelectedItems({});
    };

    const handleItemSelectionChange = (itemId, isSelected) => {
        setSelectedItems(prev => ({
            ...prev,
            [itemId]: {
                ...prev[itemId],
                isSelected,
                quantity: isSelected ? (prev[itemId]?.quantity || 1) : 0
            }
        }));
    };

    const handleItemQuantityChange = (itemId, quantity) => {
        setSelectedItems(prev => ({
            ...prev,
            [itemId]: {
                ...prev[itemId],
                quantity: Number(quantity)
            }
        }));
    };

    const handleSave = async () => {
        let returnId;
        if (editingReturn) {
            const res = await dispatch(updatePurchaseReturn({ id: editingReturn.id, data: formData }));
            returnId = res.payload.id;
        } else {
            const res = await dispatch(addPurchaseReturn(formData));
            returnId = res.payload.id;
        }

        // Create return items
        if (returnId) {
            const promises = Object.entries(selectedItems)
                .filter(([_, data]) => data.isSelected && data.quantity > 0)
                .map(([itemId, data]) => {
                    const item = invoiceItems.find(i => i.id === Number(itemId));
                    return dispatch(createPurchaseReturnItem({
                        purchase_return_id: returnId,
                        purchase_invoice_item_id: Number(itemId),
                        product_id: item.product_id,
                        quantity: data.quantity,
                        reason: "" // Optional: Add reason field if needed
                    }));
                });

            await Promise.all(promises);
        }

        handleClose();
    };

    const handleDeleteClick = (item) => {
        setItemToDelete(item);
        setDeleteDialogOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (itemToDelete) {
            await dispatch(deletePurchaseReturn(itemToDelete.id));
            setDeleteDialogOpen(false);
            setItemToDelete(null);
        }
    };

    const columns = useMemo(() => [
        {
            accessorKey: "id",
            header: "ID",
            size: 80,
        },
        {
            accessorKey: "purchase_invoice_id",
            header: "رقم الفاتورة",
            size: 120,
        },
        {
            accessorKey: "return_date",
            header: "تاريخ المرتجع",
            size: 120,
            Cell: ({ cell }) => {
                const date = new Date(cell.getValue());
                return date.toLocaleDateString('ar-EG');
            }
        },
        {
            accessorKey: "total_amount",
            header: "الإجمالي",
            size: 140,
            Cell: ({ cell }) => (
                <Typography variant="body2" fontWeight="bold">
                    {formatCurrency(cell.getValue())}
                </Typography>
            )
        },
        {
            accessorKey: "tax_amount",
            header: "الضريبة",
            size: 140,
            Cell: ({ cell }) => (
                <Typography variant="body2">
                    {formatCurrency(cell.getValue())}
                </Typography>
            )
        },
        {
            accessorKey: "notes",
            header: "ملاحظات",
            size: 200,
        },
    ], []);

    if (loading === "loading" && returns.length === 0) {
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
                    فشل في تحميل مرتجعات الشراء: {error}
                </Alert>
                <Button
                    variant="contained"
                    onClick={() => dispatch(fetchPurchaseReturns())}
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
                    مرتجعات الشراء
                </Typography>
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => handleOpen()}
                >
                    إضافة مرتجع
                </Button>
            </Box>

            <MaterialReactTable
                columns={columns}
                data={returns}
                enableRowSelection={false}
                enableColumnFilters
                enableSorting
                enablePagination
                enableRowActions
                positionActionsColumn="last"
                renderRowActions={({ row }) => (
                    <Box sx={{ display: 'flex', gap: '0.5rem' }}>
                        <Tooltip title="تعديل">
                            <IconButton onClick={() => handleOpen(row.original)}>
                                <EditIcon />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="حذف">
                            <IconButton color="error" onClick={() => handleDeleteClick(row.original)}>
                                <DeleteIcon />
                            </IconButton>
                        </Tooltip>
                    </Box>
                )}
                initialState={{
                    pagination: { pageSize: 25, pageIndex: 0 },
                    sorting: [{ id: 'return_date', desc: true }]
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

            {/* Dialog for Add/Edit */}
            <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
                <DialogTitle>
                    {editingReturn ? "تعديل مرتجع" : "إضافة مرتجع جديد"}
                </DialogTitle>
                <DialogContent>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
                        <Box sx={{ display: 'flex', gap: 2 }}>
                            <TextField
                                select
                                label="رقم فاتورة الشراء"
                                value={formData.purchase_invoice_id}
                                onChange={(e) => handleInvoiceChange(e.target.value)}
                                fullWidth
                            >
                                {invoices.map((invoice) => (
                                    <MenuItem key={invoice.id} value={invoice.id}>
                                        {invoice.id} - {invoice.supplier_name || `فاتورة ${invoice.id}`}
                                    </MenuItem>
                                ))}
                            </TextField>
                            <TextField
                                label="تاريخ المرتجع"
                                type="date"
                                value={formData.return_date}
                                onChange={(e) => setFormData({ ...formData, return_date: e.target.value })}
                                fullWidth
                                InputLabelProps={{ shrink: true }}
                            />
                        </Box>

                        {/* Invoice Items Table */}
                        {formData.purchase_invoice_id && (
                            <TableContainer component={Paper} variant="outlined">
                                <Table size="small">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell padding="checkbox">
                                                <Checkbox disabled />
                                            </TableCell>
                                            <TableCell>المنتج</TableCell>
                                            <TableCell>الكمية المتاحة</TableCell>
                                            <TableCell>الكمية المرتجعة</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {invoiceItems.map((item) => (
                                            <TableRow key={item.id}>
                                                <TableCell padding="checkbox">
                                                    <Checkbox
                                                        checked={!!selectedItems[item.id]?.isSelected}
                                                        onChange={(e) => handleItemSelectionChange(item.id, e.target.checked)}
                                                    />
                                                </TableCell>
                                                <TableCell>{item.product?.name || item.product_id}</TableCell>
                                                <TableCell>{item.quantity}</TableCell>
                                                <TableCell>
                                                    <TextField
                                                        type="number"
                                                        size="small"
                                                        value={selectedItems[item.id]?.quantity || ""}
                                                        onChange={(e) => handleItemQuantityChange(item.id, e.target.value)}
                                                        disabled={!selectedItems[item.id]?.isSelected}
                                                        inputProps={{ max: item.quantity, min: 1 }}
                                                    />
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                        {invoiceItems.length === 0 && (
                                            <TableRow>
                                                <TableCell colSpan={4} align="center">
                                                    لا توجد عناصر لهذه الفاتورة
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        )}

                        <Box sx={{ display: 'flex', gap: 2 }}>
                            <TextField
                                label="الإجمالي"
                                type="number"
                                value={formData.total_amount}
                                onChange={(e) => setFormData({ ...formData, total_amount: e.target.value })}
                                fullWidth
                            />
                            <TextField
                                label="الضريبة"
                                type="number"
                                value={formData.tax_amount}
                                onChange={(e) => setFormData({ ...formData, tax_amount: e.target.value })}
                                fullWidth
                            />
                        </Box>
                        <TextField
                            label="ملاحظات"
                            multiline
                            rows={3}
                            value={formData.notes}
                            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                            fullWidth
                        />
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>إلغاء</Button>
                    <Button onClick={handleSave} variant="contained">حفظ</Button>
                </DialogActions>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
                <DialogTitle>تأكيد الحذف</DialogTitle>
                <DialogContent>
                    <Typography>
                        هل أنت متأكد من حذف المرتجع رقم {itemToDelete?.id}؟
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDeleteDialogOpen(false)}>إلغاء</Button>
                    <Button onClick={handleConfirmDelete} color="error" variant="contained">
                        حذف
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}
