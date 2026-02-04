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
    Paper,
} from "@mui/material";
import { MaterialReactTable } from "material-react-table";
import { useDispatch, useSelector } from "react-redux";
import {
    fetchSalesReturns,
    addSalesReturn,
    updateSalesReturn,
    deleteSalesReturn
} from "../features/salesReturns/salesReturnsSlice";
import { fetchSalesInvoices } from "../features/salesInvoices/salesInvoicesSlice";
import { fetchSalesInvoiceItems } from "../features/salesInvoiceItems/salesInvoiceItemsSlice";
import { fetchParties } from "../features/parties/partiesSlice";
import { fetchWarehouses } from "../features/warehouses/warehousesSlice";
import { fetchProducts } from "../features/products/productsSlice";
import { fetchAccounts } from "../features/accounts/accountsSlice";
import { fetchEmployees } from "../features/employees/employeesSlice";
import { Edit as EditIcon, Delete as DeleteIcon, Add as AddIcon } from "@mui/icons-material";

// دالة لتنسيق العملة
const formatCurrency = (value) => {
    return new Intl.NumberFormat('ar-EG', {
        style: 'currency',
        currency: 'EGP',
        minimumFractionDigits: 2
    }).format(Number(value) || 0);
};

export default function SalesReturnsPage() {
    const dispatch = useDispatch();

    const {
        items: returns = [],
        loading,
        error
    } = useSelector((state) => state.salesReturns);

    const {
        items: invoices = []
    } = useSelector((state) => state.salesInvoices);

    const {
        items: invoiceItems = []
    } = useSelector((state) => state.salesInvoiceItems);

    const {
        items: parties = []
    } = useSelector((state) => state.parties);

    const {
        items: warehouses = []
    } = useSelector((state) => state.warehouses);

    const {
        items: products = []
    } = useSelector((state) => state.products);

    const {
        items: accounts = []
    } = useSelector((state) => state.accounts);

    const {
        list: employees = []
    } = useSelector((state) => state.employees);

    // Filter only customers
    const customers = useMemo(() => parties.filter(p => p.party_type === 'customer' || p.party_type === 'both'), [parties]);

    const [open, setOpen] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [editingReturn, setEditingReturn] = useState(null);
    const [itemToDelete, setItemToDelete] = useState(null);
    const [formData, setFormData] = useState({
        sales_invoice_id: "",
        warehouse_id: "",
        return_date: new Date().toISOString().split('T')[0],
        notes: "",
        return_type: "cash",
        account_id: "",
        employee_id: ""
    });

    // State for selected items to return
    const [selectedItems, setSelectedItems] = useState({}); // { itemId: { isSelected: true, quantity: 1 } }

    // Derived state for customer selection in form
    const [selectedCustomerId, setSelectedCustomerId] = useState("");

    useEffect(() => {
        dispatch(fetchSalesReturns());
        dispatch(fetchSalesInvoices());
        dispatch(fetchParties());
        dispatch(fetchWarehouses());
        dispatch(fetchProducts());
        dispatch(fetchAccounts());
        dispatch(fetchEmployees());
    }, [dispatch]);

    const handleOpen = (returnItem = null) => {
        if (returnItem) {
            setEditingReturn(returnItem);
            // Derive customer from invoice if possible, or leave it empty/disabled
            // For editing, we load formatted data. 
            // NOTE: The current API might not return nested customer in invoice object depending on 'include'.
            // Assuming returnItem.invoice.party_id exists or similar.

            const invoice = invoices.find(i => i.id === returnItem.sales_invoice_id);
            setSelectedCustomerId(invoice?.party_id || "");

            setFormData({
                sales_invoice_id: returnItem.sales_invoice_id,
                warehouse_id: returnItem.warehouse_id,
                return_date: returnItem.return_date ? new Date(returnItem.return_date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
                notes: returnItem.notes || "",
                return_type: returnItem.return_type || "cash",
                account_id: returnItem.account_id || "",
                employee_id: returnItem.employee_id || ""
            });
            // Fetch items for this invoice to show in edit mode? 
            // Editing returns is complex because we need to know what was returned vs what is available.
            // For now, let's just allow editing metadata, or fetch items if we want to allow changing items.
            // PurchaseReturnsPage didn't implement fully fetching existing items for edit ("TODO: Fetch existing return items if editing").
            // So we will mimic that behavior.
        } else {
            setEditingReturn(null);
            setSelectedCustomerId("");
            setFormData({
                sales_invoice_id: "",
                warehouse_id: "",
                return_date: new Date().toISOString().split('T')[0],
                notes: "",
                return_type: "cash",
                account_id: "",
                employee_id: ""
            });
            setSelectedItems({});
        }
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setEditingReturn(null);
        setSelectedItems({});
        setSelectedCustomerId("");
    };

    const handleCustomerChange = (customerId) => {
        setSelectedCustomerId(customerId);
        setFormData({ ...formData, sales_invoice_id: "" });
    };

    const handleInvoiceChange = (invoiceId) => {
        const invoice = invoices.find(i => i.id === invoiceId);
        setFormData({
            ...formData,
            sales_invoice_id: invoiceId,
            warehouse_id: invoice ? invoice.warehouse_id : formData.warehouse_id
        });

        // Fetch invoice items
        if (invoiceId) {
            // Assuming the API supports filtering by sales_invoice_id query param or similar mechanism
            // If fetchSalesInvoiceItems implementation in slice expects an object of filters:
            dispatch(fetchSalesInvoiceItems({ sales_invoice_id: invoiceId }));
        }
        setSelectedItems({});
    };

    const handleAddManualProduct = (productId) => {
        const product = products.find(p => p.id === productId);
        if (!product) return;

        const manualId = `manual-${productId}-${Date.now()}`;
        setSelectedItems(prev => ({
            ...prev,
            [manualId]: {
                isSelected: true,
                quantity: 1,
                return_condition: 'good',
                product_id: product.id,
                product: product,
                price: product.price || 0,
                isManual: true
            }
        }));
    };

    const handleItemSelectionChange = (itemId, isSelected) => {
        setSelectedItems(prev => ({
            ...prev,
            [itemId]: {
                ...prev[itemId],
                isSelected,
                isSelected,
                quantity: isSelected ? (prev[itemId]?.quantity || 1) : 0,
                return_condition: isSelected ? (prev[itemId]?.return_condition || 'good') : 'good'
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

    const handleItemConditionChange = (itemId, condition) => {
        setSelectedItems(prev => ({
            ...prev,
            [itemId]: {
                ...prev[itemId],
                return_condition: condition
            }
        }));
    };

    const handleItemPriceChange = (itemId, price) => {
        setSelectedItems(prev => ({
            ...prev,
            [itemId]: {
                ...prev[itemId],
                price: Number(price)
            }
        }));
    };

    const handleSave = async () => {
        // Prepare items array from selected items
        const itemsArray = Object.entries(selectedItems)
            .filter(([_, data]) => !data.isManual && data.isSelected && data.quantity > 0)
            .map(([itemId, data]) => {
                const item = invoiceItems.find(i => i.id === Number(itemId));
                return {
                    product_id: item.product_id,
                    quantity: data.quantity,
                    price: data.price !== undefined ? data.price : item.price,
                    return_condition: data.return_condition || 'good',
                    batch_number: data.batch_number,
                    expiry_date: data.expiry_date,
                    batch_status: data.batch_status
                };
            });

        // Add manual items
        const manualItemsArray = Object.entries(selectedItems)
            .filter(([_, data]) => data.isManual && data.isSelected && data.quantity > 0)
            .map(([_, data]) => ({
                product_id: data.product_id,
                quantity: data.quantity,
                price: data.price,
                return_condition: data.return_condition || 'good',
                batch_number: data.batch_number,
                expiry_date: data.expiry_date,
                batch_status: data.batch_status,
                is_manual: true
            }));

        const dataToSend = {
            ...formData,
            account_id: formData.account_id || null,
            sales_invoice_id: formData.sales_invoice_id || null,
            party_id: selectedCustomerId,
            items: [...itemsArray, ...manualItemsArray] // Include items in the same request
        };

        if (editingReturn) {
            await dispatch(updateSalesReturn({ id: editingReturn.id, data: dataToSend }));
        } else {
            await dispatch(addSalesReturn(dataToSend));
        }

        handleClose();
    };

    const handleDeleteClick = (item) => {
        setItemToDelete(item);
        setDeleteDialogOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (itemToDelete) {
            await dispatch(deleteSalesReturn(itemToDelete.id));
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
            accessorKey: "party_id",
            header: "العميل",
            size: 150,
            Cell: ({ row }) => {
                // Try finding party by party_id directly (new schema)
                const party = parties.find(p => p.id === row.original.party_id);
                // Fallback to invoice party if old data
                if (!party && row.original.sales_invoice_id) {
                    const invoice = invoices.find(inv => inv.id === row.original.sales_invoice_id);
                    const invParty = parties.find(p => p.id === invoice?.party_id);
                    return invParty?.name || "غير معروف";
                }
                return party?.name || "غير معروف";
            }
        },
        {
            accessorKey: "sales_invoice_id",
            header: "رقم الفاتورة",
            size: 120,
        },
        {
            accessorKey: "warehouse.name",
            header: "المخزن",
            size: 150,
        },
        {
            accessorKey: "employee.name",
            header: "الموظف",
            size: 150,
            Cell: ({ row }) => row.original.employee?.name || "—"
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
            accessorKey: "return_type",
            header: "نوع الإرجاع",
            size: 100,
            Cell: ({ cell }) => {
                const types = {
                    cash: 'نقدي',
                    credit: 'آجل',
                    exchange: 'استبدال'
                };
                return types[cell.getValue()] || cell.getValue();
            }
        },
        {
            accessorKey: "account_id",
            header: "الخزينة/البنك",
            size: 150,
            Cell: ({ row }) => {
                const account = accounts.find(acc => acc.id === row.original.account_id);
                return account?.name || "—";
            }
        },
        {
            accessorKey: "tax_amount",
            header: "الضريبة",
            size: 100,
            Cell: ({ cell }) => formatCurrency(cell.getValue())
        },
        {
            accessorKey: "total_amount",
            header: "الإجمالي",
            size: 120,
            Cell: ({ cell }) => formatCurrency(cell.getValue())
        },
        {
            accessorKey: "notes",
            header: "ملاحظات",
            size: 200,
        },
    ], [invoices, parties, accounts]);

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
                    فشل في تحميل مرتجعات المبيعات: {error}
                </Alert>
                <Button
                    variant="contained"
                    onClick={() => dispatch(fetchSalesReturns())}
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
                    مرتجعات المبيعات
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
            <Dialog open={open} onClose={handleClose} maxWidth="xl" fullWidth>
                <DialogTitle>
                    {editingReturn ? "تعديل مرتجع" : "إضافة مرتجع جديد"}
                </DialogTitle>
                <DialogContent>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1, pb: 2 }}>
                        <Box sx={{ display: 'flex', gap: 2 }}>
                            <TextField
                                select
                                label="العميل"
                                value={selectedCustomerId || ""}
                                onChange={(e) => handleCustomerChange(e.target.value)}
                                fullWidth
                                required
                            >
                                {customers.map((customer) => (
                                    <MenuItem key={customer.id} value={customer.id}>
                                        {customer.name}
                                    </MenuItem>
                                ))}
                            </TextField>
                            <TextField
                                select
                                label="رقم فاتورة المبيعات"
                                value={formData.sales_invoice_id || ""}
                                onChange={(e) => handleInvoiceChange(e.target.value)}
                                fullWidth
                                required
                            >
                                {invoices
                                    .filter(inv => !selectedCustomerId || inv.party_id === selectedCustomerId)
                                    .map((invoice) => (
                                        <MenuItem key={invoice.id} value={invoice.id}>
                                            {invoice.id} - {invoice.customer_name || `فاتورة ${invoice.id}`}
                                        </MenuItem>
                                    ))}
                            </TextField>
                        </Box>

                        <Box sx={{ display: "flex", gap: 2 }}>
                            <TextField
                                select
                                label="المخزن"
                                value={formData.warehouse_id || ""}
                                onChange={(e) => setFormData({ ...formData, warehouse_id: e.target.value })}
                                fullWidth
                                required
                            >
                                {warehouses.map((warehouse) => (
                                    <MenuItem key={warehouse.id} value={warehouse.id}>
                                        {warehouse.name}
                                    </MenuItem>
                                ))}
                            </TextField>

                            <TextField
                                select
                                label="الموظف"
                                value={formData.employee_id || ""}
                                onChange={(e) => setFormData({ ...formData, employee_id: e.target.value })}
                                fullWidth
                            >
                                <MenuItem value="">اختر الموظف</MenuItem>
                                {employees.map((employee) => (
                                    <MenuItem key={employee.id} value={employee.id}>
                                        {employee.name}
                                    </MenuItem>
                                ))}
                            </TextField>

                            <TextField
                                select
                                label="نوع الإرجاع"
                                value={formData.return_type}
                                onChange={(e) => setFormData({ ...formData, return_type: e.target.value })}
                                fullWidth
                                required
                            >
                                <MenuItem value="cash">نقدي</MenuItem>
                                <MenuItem value="credit">آجل</MenuItem>
                                <MenuItem value="exchange">استبدال</MenuItem>
                            </TextField>
                        </Box>

                        {formData.return_type === 'cash' && (
                            <TextField
                                select
                                label="الخزينة/البنك"
                                value={formData.account_id || ""}
                                onChange={(e) => setFormData({ ...formData, account_id: e.target.value })}
                                fullWidth
                                required
                            >
                                {accounts.map((account) => (
                                    <MenuItem key={account.id} value={account.id}>
                                        {account.name}
                                    </MenuItem>
                                ))}
                            </TextField>
                        )}

                        <TextField
                            label="تاريخ المرتجع"
                            type="date"
                            value={formData.return_date}
                            onChange={(e) => setFormData({ ...formData, return_date: e.target.value })}
                            fullWidth
                            InputLabelProps={{ shrink: true }}
                        />

                        {/* Invoice Items Table */}
                        {formData.sales_invoice_id && (
                            <Box>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                                    <Typography variant="h6">عناصر المرتجع</Typography>
                                    <TextField
                                        select
                                        label="إضافة منتج يدوي"
                                        size="small"
                                        sx={{ width: 250 }}
                                        value=""
                                        onChange={(e) => handleAddManualProduct(e.target.value)}
                                    >
                                        {products.map((product) => (
                                            <MenuItem key={product.id} value={product.id}>
                                                {product.name}
                                            </MenuItem>
                                        ))}
                                    </TextField>
                                </Box>
                                <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 2, overflowX: 'auto', border: '1px solid #e0e0e0', maxHeight: 500 }}>
                                    <Table size="small" stickyHeader sx={{ minWidth: 1000 }}>
                                        <TableHead sx={{ bgcolor: '#f5f5f5' }}>
                                            <TableRow>
                                                <TableCell padding="checkbox" sx={{ fontWeight: 'bold', bgcolor: '#f5f5f5' }}>
                                                    <Checkbox disabled />
                                                </TableCell>
                                                <TableCell sx={{ fontWeight: 'bold', minWidth: 200, bgcolor: '#f5f5f5' }}>المنتج</TableCell>
                                                <TableCell sx={{ fontWeight: 'bold', minWidth: 100, bgcolor: '#f5f5f5' }}>الكمية المتاحة</TableCell>
                                                <TableCell sx={{ fontWeight: 'bold', minWidth: 120, bgcolor: '#f5f5f5' }}>السعر</TableCell>
                                                <TableCell sx={{ fontWeight: 'bold', minWidth: 120, bgcolor: '#f5f5f5' }}>الكمية المرتجعة</TableCell>
                                                <TableCell sx={{ fontWeight: 'bold', minWidth: 150, bgcolor: '#f5f5f5' }}>حالة المرتجع</TableCell>
                                                <TableCell sx={{ fontWeight: 'bold', minWidth: 150, bgcolor: '#f5f5f5' }}>رقم الباتش</TableCell>
                                                <TableCell sx={{ fontWeight: 'bold', minWidth: 150, bgcolor: '#f5f5f5' }}>تاريخ الصلاحية</TableCell>
                                                <TableCell sx={{ fontWeight: 'bold', minWidth: 120, bgcolor: '#f5f5f5' }}>حالة الباتش</TableCell>
                                                <TableCell sx={{ fontWeight: 'bold', minWidth: 50, bgcolor: '#f5f5f5' }}>إجراء</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {/* Invoice Items */}
                                            {(invoiceItems || []).map((item) => (
                                                <TableRow key={item.id} hover sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
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
                                                            value={selectedItems[item.id]?.price ?? item.price}
                                                            onChange={(e) => handleItemPriceChange(item.id, e.target.value)}
                                                            disabled={!selectedItems[item.id]?.isSelected}
                                                            fullWidth
                                                        />
                                                    </TableCell>
                                                    <TableCell>
                                                        <TextField
                                                            type="number"
                                                            size="small"
                                                            value={selectedItems[item.id]?.quantity || ""}
                                                            onChange={(e) => handleItemQuantityChange(item.id, e.target.value)}
                                                            disabled={!selectedItems[item.id]?.isSelected}
                                                            inputProps={{ max: item.quantity, min: 1 }}
                                                            fullWidth
                                                        />
                                                    </TableCell>
                                                    <TableCell>
                                                        <TextField
                                                            select
                                                            size="small"
                                                            value={selectedItems[item.id]?.return_condition || "good"}
                                                            onChange={(e) => handleItemConditionChange(item.id, e.target.value)}
                                                            disabled={!selectedItems[item.id]?.isSelected}
                                                            fullWidth
                                                        >
                                                            <MenuItem value="good">سليم</MenuItem>
                                                            <MenuItem value="damaged">تالف</MenuItem>
                                                            <MenuItem value="expired">منتهي الصلاحية</MenuItem>
                                                        </TextField>
                                                    </TableCell>
                                                    {/* Batch Fields */}
                                                    <TableCell>
                                                        <TextField
                                                            size="small"
                                                            placeholder="اختياري"
                                                            value={selectedItems[item.id]?.batch_number || ""}
                                                            onChange={(e) => setSelectedItems(prev => ({ ...prev, [item.id]: { ...prev[item.id], batch_number: e.target.value } }))}
                                                            disabled={!selectedItems[item.id]?.isSelected}
                                                            fullWidth
                                                        />
                                                    </TableCell>
                                                    <TableCell>
                                                        <TextField
                                                            type="date"
                                                            size="small"
                                                            value={selectedItems[item.id]?.expiry_date || ""}
                                                            onChange={(e) => setSelectedItems(prev => ({ ...prev, [item.id]: { ...prev[item.id], expiry_date: e.target.value } }))}
                                                            disabled={!selectedItems[item.id]?.isSelected}
                                                            fullWidth
                                                        />
                                                    </TableCell>
                                                    <TableCell>
                                                        <TextField
                                                            select
                                                            size="small"
                                                            value={selectedItems[item.id]?.batch_status || "unknown"}
                                                            onChange={(e) => setSelectedItems(prev => ({ ...prev, [item.id]: { ...prev[item.id], batch_status: e.target.value } }))}
                                                            disabled={!selectedItems[item.id]?.isSelected}
                                                            fullWidth
                                                        >
                                                            <MenuItem value="known">معروف</MenuItem>
                                                            <MenuItem value="unknown">غير معروف</MenuItem>
                                                            <MenuItem value="unreadable">غير مقروء</MenuItem>
                                                        </TextField>
                                                    </TableCell>
                                                    <TableCell></TableCell>
                                                </TableRow>
                                            ))}
                                            {/* Manual Items */}
                                            {Object.entries(selectedItems)
                                                .filter(([_, data]) => data.isManual)
                                                .map(([id, data]) => (
                                                    <TableRow key={id} hover sx={{ bgcolor: '#fffde7' }}>
                                                        <TableCell padding="checkbox">
                                                            <Checkbox
                                                                checked={!!data.isSelected}
                                                                onChange={(e) => handleItemSelectionChange(id, e.target.checked)}
                                                            />
                                                        </TableCell>
                                                        <TableCell sx={{ fontWeight: 500 }}>
                                                            {data.product?.name || data.product_id}
                                                            <Typography variant="caption" display="block" color="text.secondary">(يدوي)</Typography>
                                                        </TableCell>
                                                        <TableCell>-</TableCell>
                                                        <TableCell>
                                                            <TextField
                                                                type="number"
                                                                size="small"
                                                                value={data.price}
                                                                onChange={(e) => {
                                                                    const val = e.target.value;
                                                                    setSelectedItems(prev => ({
                                                                        ...prev,
                                                                        [id]: { ...prev[id], price: Number(val) }
                                                                    }));
                                                                }}
                                                                disabled={!data.isSelected}
                                                            />
                                                        </TableCell>
                                                        <TableCell>
                                                            <TextField
                                                                type="number"
                                                                size="small"
                                                                value={data.quantity}
                                                                onChange={(e) => handleItemQuantityChange(id, e.target.value)}
                                                                disabled={!data.isSelected}
                                                                inputProps={{ min: 1 }}
                                                                fullWidth
                                                            />
                                                        </TableCell>
                                                        <TableCell>
                                                            <TextField
                                                                select
                                                                size="small"
                                                                value={data.return_condition || "good"}
                                                                onChange={(e) => handleItemConditionChange(id, e.target.value)}
                                                                disabled={!data.isSelected}
                                                                fullWidth
                                                            >
                                                                <MenuItem value="good">سليم</MenuItem>
                                                                <MenuItem value="damaged">تالف</MenuItem>
                                                                <MenuItem value="expired">منتهي الصلاحية</MenuItem>
                                                            </TextField>
                                                        </TableCell>
                                                        {/* Batch Fields */}
                                                        <TableCell>
                                                            <TextField
                                                                size="small"
                                                                placeholder="اختياري"
                                                                value={data.batch_number || ""}
                                                                onChange={(e) => setSelectedItems(prev => ({ ...prev, [id]: { ...prev[id], batch_number: e.target.value } }))}
                                                                disabled={!data.isSelected}
                                                                fullWidth
                                                            />
                                                        </TableCell>
                                                        <TableCell>
                                                            <TextField
                                                                type="date"
                                                                size="small"
                                                                value={data.expiry_date || ""}
                                                                onChange={(e) => setSelectedItems(prev => ({ ...prev, [id]: { ...prev[id], expiry_date: e.target.value } }))}
                                                                disabled={!data.isSelected}
                                                                fullWidth
                                                            />
                                                        </TableCell>
                                                        <TableCell>
                                                            <TextField
                                                                select
                                                                size="small"
                                                                value={data.batch_status || "unknown"}
                                                                onChange={(e) => setSelectedItems(prev => ({ ...prev, [id]: { ...prev[id], batch_status: e.target.value } }))}
                                                                disabled={!data.isSelected}
                                                                fullWidth
                                                            >
                                                                <MenuItem value="known">معروف</MenuItem>
                                                                <MenuItem value="unknown">غير معروف</MenuItem>
                                                                <MenuItem value="unreadable">غير مقروء</MenuItem>
                                                            </TextField>
                                                        </TableCell>
                                                        <TableCell>
                                                            <IconButton
                                                                color="error"
                                                                size="small"
                                                                onClick={() => {
                                                                    setSelectedItems(prev => {
                                                                        const next = { ...prev };
                                                                        delete next[id];
                                                                        return next;
                                                                    });
                                                                }}
                                                            >
                                                                <DeleteIcon />
                                                            </IconButton>
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                            {(invoiceItems || []).length === 0 && Object.keys(selectedItems).filter(k => selectedItems[k].isManual).length === 0 && (
                                                <TableRow>
                                                    <TableCell colSpan={10} align="center">
                                                        لا توجد عناصر لهذه الفاتورة. يمكنك إضافة منتجات يدوياً.
                                                    </TableCell>
                                                </TableRow>
                                            )}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </Box>
                        )}

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
