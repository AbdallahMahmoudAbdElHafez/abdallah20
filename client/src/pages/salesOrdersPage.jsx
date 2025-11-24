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
    IconButton,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Paper,
} from "@mui/material";
import { MaterialReactTable } from "material-react-table";
import { useDispatch, useSelector } from "react-redux";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import {
    fetchSalesOrders,
    addSalesOrder,
    updateSalesOrder,
    deleteSalesOrder,
} from "../features/salesOrders/salesOrdersSlice";
import { fetchSalesOrderItems } from "../features/salesOrderItems/salesOrderItemsSlice";
import { fetchParties } from "../features/parties/partiesSlice";
import { fetchWarehouses } from "../features/warehouses/warehousesSlice";
import { fetchEmployees } from "../features/employees/employeesSlice";
import { fetchProducts } from "../features/products/productsSlice";

export default function SalesOrdersPage() {
    const dispatch = useDispatch();
    const { items: orders, loading } = useSelector((state) => state.salesOrders);
    const { items: parties } = useSelector((state) => state.parties);
    const { items: warehouses } = useSelector((state) => state.warehouses);
    const { list: employees } = useSelector((state) => state.employees);
    const { items: products } = useSelector((state) => state.products);

    const [open, setOpen] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState({
        party_id: "",
        warehouse_id: "",
        employee_id: "",
        order_date: new Date().toISOString().split("T")[0],
        status: "pending",
        notes: "",
        items: [],
        subtotal: 0,
        additional_discount_percent: 0,
        additional_discount: 0,
        vat_rate: 0,
        vat_amount: 0,
        tax_rate: 0,
        tax_amount: 0,
        total_amount: 0,
    });

    useEffect(() => {
        dispatch(fetchSalesOrders());
        dispatch(fetchParties());
        dispatch(fetchWarehouses());
        dispatch(fetchEmployees());
        dispatch(fetchProducts());
    }, [dispatch]);

    // Calculation Logic
    useEffect(() => {
        const itemsSubtotal = formData.items.reduce((sum, item) => {
            const qty = Number(item.quantity) || 0;
            const price = Number(item.price) || 0;
            const discount = Number(item.discount) || 0;
            return sum + (qty * price) - discount;
        }, 0);

        const discountPercent = Number(formData.additional_discount_percent) || 0;
        const additionalDiscount = (itemsSubtotal * discountPercent) / 100;

        const taxableAmount = itemsSubtotal - additionalDiscount;

        const vatRate = Number(formData.vat_rate) || 0;
        const vatAmount = (taxableAmount * vatRate) / 100;

        const taxRate = Number(formData.tax_rate) || 0;
        const taxAmount = (taxableAmount * taxRate) / 100;

        const total = taxableAmount + vatAmount + taxAmount;

        setFormData(prev => ({
            ...prev,
            subtotal: itemsSubtotal.toFixed(2),
            additional_discount: additionalDiscount.toFixed(2),
            vat_amount: vatAmount.toFixed(2),
            tax_amount: taxAmount.toFixed(2),
            total_amount: total.toFixed(2)
        }));
    }, [
        formData.items,
        formData.additional_discount_percent,
        formData.vat_rate,
        formData.tax_rate
    ]);

    const handleOpen = async (order = null) => {
        if (order) {
            setEditingId(order.id);
            const itemsRes = await dispatch(fetchSalesOrderItems({ sales_order_id: order.id })).unwrap();

            let percent = 0;
            if (Number(order.subtotal) > 0) {
                percent = (Number(order.additional_discount) / Number(order.subtotal)) * 100;
            }

            setFormData({
                party_id: order.party_id,
                warehouse_id: order.warehouse_id || "",
                employee_id: order.employee_id || "",
                order_date: order.order_date,
                status: order.status,
                notes: order.notes || "",
                items: itemsRes.map(item => ({
                    ...item,
                    product_id: item.product_id,
                    quantity: item.quantity,
                    price: item.price,
                    discount: item.discount,
                    tax_percent: item.tax_percent,
                })),
                subtotal: order.subtotal,
                additional_discount_percent: percent.toFixed(2),
                additional_discount: order.additional_discount,
                vat_rate: order.vat_rate,
                vat_amount: order.vat_amount,
                tax_rate: order.tax_rate,
                tax_amount: order.tax_amount,
                total_amount: order.total_amount,
            });
        } else {
            setEditingId(null);
            setFormData({
                party_id: "",
                warehouse_id: "",
                employee_id: "",
                order_date: new Date().toISOString().split("T")[0],
                status: "pending",
                notes: "",
                items: [],
                subtotal: 0,
                additional_discount_percent: 0,
                additional_discount: 0,
                vat_rate: 0,
                vat_amount: 0,
                tax_rate: 0,
                tax_amount: 0,
                total_amount: 0,
            });
        }
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setEditingId(null);
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleItemChange = (index, field, value) => {
        const newItems = [...formData.items];
        newItems[index][field] = value;

        if (field === 'product_id') {
            const product = products.find(p => p.id === value);
            if (product) {
                newItems[index].price = product.price;
            }
        }

        const qty = Number(newItems[index].quantity) || 0;
        const price = Number(newItems[index].price) || 0;
        const discount = Number(newItems[index].discount) || 0;
        const taxPercent = Number(newItems[index].tax_percent) || 0;

        const subtotal = (qty * price) - discount;
        const taxAmount = (subtotal * taxPercent) / 100;
        newItems[index].tax_amount = taxAmount.toFixed(2);

        setFormData({ ...formData, items: newItems });
    };

    const addItem = () => {
        setFormData({
            ...formData,
            items: [
                ...formData.items,
                {
                    product_id: "",
                    quantity: 1,
                    price: 0,
                    discount: 0,
                    tax_percent: 0,
                    tax_amount: 0,
                    bonus: 0,
                    warehouse_id: formData.warehouse_id
                },
            ],
        });
    };

    const removeItem = (index) => {
        const newItems = formData.items.filter((_, i) => i !== index);
        setFormData({ ...formData, items: newItems });
    };

    const handleSubmit = async () => {
        const payload = { ...formData };

        // Sanitize optional fields
        if (payload.warehouse_id === "") payload.warehouse_id = null;
        if (payload.employee_id === "") payload.employee_id = null;

        // Remove the helper field before sending
        delete payload.additional_discount_percent;

        if (editingId) {
            await dispatch(updateSalesOrder({ id: editingId, data: payload }));
        } else {
            await dispatch(addSalesOrder(payload));
        }
        dispatch(fetchSalesOrders());
        handleClose();
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this order?")) {
            await dispatch(deleteSalesOrder(id));
            dispatch(fetchSalesOrders());
        }
    };

    const columns = [
        { accessorKey: "id", header: "ID" },
        { accessorKey: "order_date", header: "Date" },
        {
            header: "Party",
            accessorFn: (row) => row.party?.name ?? "N/A",
        },
        { accessorKey: "status", header: "Status" },
        { accessorKey: "subtotal", header: "Subtotal" },
        { accessorKey: "total_amount", header: "Total" },
        {
            header: "Actions",
            Cell: ({ row }) => (
                <Box>
                    <Button onClick={() => handleOpen(row.original)}>Edit</Button>
                    <Button color="error" onClick={() => handleDelete(row.original.id)}>
                        Delete
                    </Button>
                </Box>
            ),
        },
    ];

    if (loading === true) return <CircularProgress />;

    return (
        <Box p={2}>
            <Button variant="contained" onClick={() => handleOpen()} sx={{ mb: 2 }}>
                Add Sales Order
            </Button>
            <MaterialReactTable columns={columns} data={orders} />

            <Dialog open={open} onClose={handleClose} maxWidth="lg" fullWidth>
                <DialogTitle>{editingId ? "Edit Sales Order" : "Add Sales Order"}</DialogTitle>
                <DialogContent>
                    <Box display="flex" gap={2} mb={2} mt={1}>
                        <TextField
                            select
                            label="Party"
                            name="party_id"
                            fullWidth
                            value={formData.party_id}
                            onChange={handleChange}
                        >
                            {parties.map((p) => (
                                <MenuItem key={p.id} value={p.id}>{p.name}</MenuItem>
                            ))}
                        </TextField>
                        <TextField
                            label="Date"
                            type="date"
                            name="order_date"
                            fullWidth
                            value={formData.order_date}
                            onChange={handleChange}
                        />
                    </Box>
                    <Box display="flex" gap={2} mb={2}>
                        <TextField
                            select
                            label="Warehouse"
                            name="warehouse_id"
                            fullWidth
                            value={formData.warehouse_id}
                            onChange={handleChange}
                        >
                            <MenuItem value=""><em>None</em></MenuItem>
                            {warehouses.map((w) => (
                                <MenuItem key={w.id} value={w.id}>{w.name}</MenuItem>
                            ))}
                        </TextField>
                        <TextField
                            select
                            label="Employee"
                            name="employee_id"
                            fullWidth
                            value={formData.employee_id}
                            onChange={handleChange}
                        >
                            <MenuItem value=""><em>None</em></MenuItem>
                            {employees.map((e) => (
                                <MenuItem key={e.id} value={e.id}>{e.name}</MenuItem>
                            ))}
                        </TextField>
                    </Box>
                    <TextField
                        select
                        label="Status"
                        name="status"
                        fullWidth
                        value={formData.status}
                        onChange={handleChange}
                        sx={{ mb: 2 }}
                    >
                        {['pending', 'approved', 'partial', 'completed', 'cancelled'].map((s) => (
                            <MenuItem key={s} value={s}>{s}</MenuItem>
                        ))}
                    </TextField>
                    <TextField
                        label="Notes"
                        name="notes"
                        fullWidth
                        multiline
                        rows={2}
                        value={formData.notes}
                        onChange={handleChange}
                        sx={{ mb: 2 }}
                    />

                    <Typography variant="h6">Items</Typography>
                    <Paper variant="outlined" sx={{ mb: 2 }}>
                        <Table size="small">
                            <TableHead>
                                <TableRow>
                                    <TableCell width="30%">Product</TableCell>
                                    <TableCell>Qty</TableCell>
                                    <TableCell>Price</TableCell>
                                    <TableCell>Discount</TableCell>
                                    <TableCell>Tax %</TableCell>
                                    <TableCell>Bonus</TableCell>
                                    <TableCell>Total</TableCell>
                                    <TableCell>Action</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {formData.items.map((item, index) => (
                                    <TableRow key={index}>
                                        <TableCell>
                                            <TextField
                                                select
                                                value={item.product_id}
                                                onChange={(e) => handleItemChange(index, "product_id", e.target.value)}
                                                fullWidth
                                                size="small"
                                            >
                                                {products.map((p) => (
                                                    <MenuItem key={p.id} value={p.id}>{p.name}</MenuItem>
                                                ))}
                                            </TextField>
                                        </TableCell>
                                        <TableCell>
                                            <TextField
                                                type="number"
                                                value={item.quantity}
                                                onChange={(e) => handleItemChange(index, "quantity", e.target.value)}
                                                size="small"
                                                sx={{ width: 80 }}
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <TextField
                                                type="number"
                                                value={item.price}
                                                onChange={(e) => handleItemChange(index, "price", e.target.value)}
                                                size="small"
                                                sx={{ width: 100 }}
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <TextField
                                                type="number"
                                                value={item.discount}
                                                onChange={(e) => handleItemChange(index, "discount", e.target.value)}
                                                size="small"
                                                sx={{ width: 80 }}
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <TextField
                                                type="number"
                                                value={item.tax_percent}
                                                onChange={(e) => handleItemChange(index, "tax_percent", e.target.value)}
                                                size="small"
                                                sx={{ width: 80 }}
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <TextField
                                                type="number"
                                                value={item.bonus}
                                                onChange={(e) => handleItemChange(index, "bonus", e.target.value)}
                                                size="small"
                                                sx={{ width: 80 }}
                                            />
                                        </TableCell>
                                        <TableCell>
                                            {((item.quantity * item.price) - item.discount + Number(item.tax_amount)).toFixed(2)}
                                        </TableCell>
                                        <TableCell>
                                            <IconButton onClick={() => removeItem(index)} color="error">
                                                <DeleteIcon />
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                        <Button startIcon={<AddIcon />} onClick={addItem} sx={{ m: 1 }}>
                            Add Item
                        </Button>
                    </Paper>

                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, alignItems: 'flex-end' }}>
                        <Box sx={{ display: 'flex', gap: 2 }}>
                            <Typography>Subtotal:</Typography>
                            <Typography fontWeight="bold">{formData.subtotal}</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                            <TextField
                                label="Discount %"
                                name="additional_discount_percent"
                                type="number"
                                size="small"
                                value={formData.additional_discount_percent}
                                onChange={handleChange}
                                sx={{ width: 100 }}
                            />
                            <Typography>Amount: {formData.additional_discount}</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                            <TextField
                                label="VAT %"
                                name="vat_rate"
                                type="number"
                                size="small"
                                value={formData.vat_rate}
                                onChange={handleChange}
                                sx={{ width: 100 }}
                            />
                            <Typography>Amount: {formData.vat_amount}</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                            <TextField
                                label="Tax %"
                                name="tax_rate"
                                type="number"
                                size="small"
                                value={formData.tax_rate}
                                onChange={handleChange}
                                sx={{ width: 100 }}
                            />
                            <Typography>Amount: {formData.tax_amount}</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', gap: 2 }}>
                            <Typography variant="h6">Total:</Typography>
                            <Typography variant="h6" fontWeight="bold">{formData.total_amount}</Typography>
                        </Box>
                    </Box>

                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button onClick={handleSubmit} variant="contained">
                        Save
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}
