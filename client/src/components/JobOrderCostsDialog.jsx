import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    fetchJobOrderCostsByJobOrder,
    addJobOrderCost,
    updateJobOrderCost,
    deleteJobOrderCost,
} from "../features/jobOrderCosts/jobOrderCostsSlice";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Box,
    TextField,
    MenuItem,
    FormControl,
    InputLabel,
    Select,
    Typography,
} from "@mui/material";
import { MaterialReactTable } from "material-react-table";

const costTypeLabels = {
    material: "مواد",
    labor: "عمالة",
    transport: "نقل",
    other: "أخرى",
};

export default function JobOrderCostsDialog({ open, onClose, jobOrderId }) {
    const dispatch = useDispatch();
    const { items, loading } = useSelector((s) => s.jobOrderCosts);

    const [formOpen, setFormOpen] = useState(false);
    const [editId, setEditId] = useState(null);
    const [form, setForm] = useState({
        cost_type: "material",
        amount: "",
        notes: "",
    });

    useEffect(() => {
        if (open && jobOrderId) {
            dispatch(fetchJobOrderCostsByJobOrder(jobOrderId));
        }
    }, [open, jobOrderId, dispatch]);

    const handleOpenForm = (cost = null) => {
        if (cost) {
            setForm({
                cost_type: cost.cost_type,
                amount: cost.amount,
                notes: cost.notes || "",
            });
            setEditId(cost.id);
        } else {
            setForm({
                cost_type: "material",
                amount: "",
                notes: "",
            });
            setEditId(null);
        }
        setFormOpen(true);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const data = {
            job_order_id: jobOrderId,
            cost_type: form.cost_type,
            amount: parseFloat(form.amount),
            notes: form.notes || null,
        };

        if (editId) {
            dispatch(updateJobOrderCost({ id: editId, data }));
        } else {
            dispatch(addJobOrderCost(data));
        }
        setFormOpen(false);
    };

    const handleDelete = (id) => {
        if (confirm("هل أنت متأكد من الحذف؟")) {
            dispatch(deleteJobOrderCost(id));
        }
    };

    const totalCost = items.reduce((sum, item) => sum + parseFloat(item.amount || 0), 0);

    const columns = [
        { accessorKey: "id", header: "ID", size: 60 },
        {
            accessorKey: "cost_type",
            header: "نوع التكلفة",
            Cell: ({ cell }) => costTypeLabels[cell.getValue()] || cell.getValue(),
        },
        {
            accessorKey: "amount",
            header: "المبلغ",
            Cell: ({ cell }) => parseFloat(cell.getValue()).toFixed(2),
        },
        { accessorKey: "notes", header: "ملاحظات" },
    ];

    return (
        <>
            <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
                <DialogTitle>
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                        <span>تكاليف أمر التشغيل</span>
                        <Button variant="contained" size="small" onClick={() => handleOpenForm()}>
                            إضافة تكلفة
                        </Button>
                    </Box>
                </DialogTitle>
                <DialogContent dividers>
                    {loading && <Typography>جاري التحميل...</Typography>}
                    <MaterialReactTable
                        columns={columns}
                        data={items}
                        enableColumnActions={false}
                        enableSorting={false}
                        enablePagination={false}
                        renderRowActions={({ row }) => (
                            <Box display="flex" gap={1}>
                                <Button
                                    size="small"
                                    variant="outlined"
                                    color="warning"
                                    onClick={() => handleOpenForm(row.original)}
                                >
                                    تعديل
                                </Button>
                                <Button
                                    size="small"
                                    variant="outlined"
                                    color="error"
                                    onClick={() => handleDelete(row.original.id)}
                                >
                                    حذف
                                </Button>
                            </Box>
                        )}
                    />
                    <Box mt={2} display="flex" justifyContent="flex-end">
                        <Typography variant="h6" fontWeight="bold">
                            إجمالي التكاليف: {totalCost.toFixed(2)}
                        </Typography>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={onClose}>إغلاق</Button>
                </DialogActions>
            </Dialog>

            {/* Form Dialog */}
            <Dialog open={formOpen} onClose={() => setFormOpen(false)} maxWidth="sm" fullWidth>
                <DialogTitle>{editId ? "تعديل التكلفة" : "إضافة تكلفة جديدة"}</DialogTitle>
                <DialogContent dividers>
                    <Box display="flex" flexDirection="column" gap={2} mt={1}>
                        <FormControl fullWidth>
                            <InputLabel>نوع التكلفة</InputLabel>
                            <Select
                                value={form.cost_type}
                                label="نوع التكلفة"
                                onChange={(e) => setForm({ ...form, cost_type: e.target.value })}
                            >
                                <MenuItem value="material">مواد</MenuItem>
                                <MenuItem value="labor">عمالة</MenuItem>
                                <MenuItem value="transport">نقل</MenuItem>
                                <MenuItem value="other">أخرى</MenuItem>
                            </Select>
                        </FormControl>

                        <TextField
                            label="المبلغ"
                            type="number"
                            value={form.amount}
                            onChange={(e) => setForm({ ...form, amount: e.target.value })}
                            required
                            inputProps={{ step: "0.01" }}
                        />

                        <TextField
                            label="ملاحظات"
                            multiline
                            rows={3}
                            value={form.notes}
                            onChange={(e) => setForm({ ...form, notes: e.target.value })}
                        />
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setFormOpen(false)}>إلغاء</Button>
                    <Button onClick={handleSubmit} variant="contained">
                        {editId ? "تحديث" : "حفظ"}
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}
