import React, { useEffect, useState } from "react";
import {
    Box,
    Button,
    TextField,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Typography,
    IconButton,
    Switch,
    FormControlLabel,
    MenuItem,
} from "@mui/material";
import { MaterialReactTable } from "material-react-table";
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from "@mui/icons-material";
import axiosClient from "../api/axiosClient";
import { defaultTableProps } from "../config/tableConfig";

export default function ServiceTypesPage() {
    const [types, setTypes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [accounts, setAccounts] = useState([]);

    // Dialog State
    const [dialogOpen, setDialogOpen] = useState(false);
    const [selectedType, setSelectedType] = useState(null);
    const [formData, setFormData] = useState({
        name: "",
        account_id: "",
        affects_job_cost: true,
    });

    useEffect(() => {
        fetchTypes();
        fetchAccounts();
    }, []);

    const fetchTypes = async () => {
        try {
            const res = await axiosClient.get("/service-types");
            setTypes(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const fetchAccounts = async () => {
        try {
            const res = await axiosClient.get("/accounts");
            setAccounts(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleCreate = () => {
        setSelectedType(null);
        setFormData({ name: "", account_id: "", affects_job_cost: true });
        setDialogOpen(true);
    };

    const handleEdit = (row) => {
        setSelectedType(row);
        setFormData({
            name: row.name,
            account_id: row.account_id || "",
            affects_job_cost: row.affects_job_cost !== false,
        });
        setDialogOpen(true);
    };

    const handleSave = async () => {
        try {
            if (selectedType) {
                await axiosClient.put(`/service-types/${selectedType.id}`, formData);
            } else {
                await axiosClient.post("/service-types", formData);
            }
            setDialogOpen(false);
            fetchTypes();
        } catch (err) {
            alert("Error: " + (err.response?.data?.error || err.message));
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("هل تريد حذف هذا النوع؟")) {
            try {
                await axiosClient.delete(`/service-types/${id}`);
                fetchTypes();
            } catch (err) {
                alert("Error: " + (err.response?.data?.error || err.message));
            }
        }
    };

    const columns = [
        { accessorKey: "id", header: "#", size: 60 },
        { accessorKey: "name", header: "اسم نوع الخدمة" },
        {
            accessorKey: "account_id",
            header: "الحساب المرتبط",
            Cell: ({ cell }) => accounts.find((a) => a.id === cell.getValue())?.name || "-",
        },
        {
            accessorKey: "affects_job_cost",
            header: "يؤثر على التكلفة",
            Cell: ({ cell }) => (cell.getValue() ? "نعم" : "لا"),
        },
        {
            header: "إجراءات",
            Cell: ({ row }) => (
                <Box sx={{ display: "flex", gap: 1 }}>
                    <IconButton onClick={() => handleEdit(row.original)} color="primary">
                        <EditIcon />
                    </IconButton>
                    <IconButton color="error" onClick={() => handleDelete(row.original.id)}>
                        <DeleteIcon />
                    </IconButton>
                </Box>
            ),
        },
    ];

    return (
        <Box p={2}>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                <Typography variant="h5">أنواع الخدمات</Typography>
                <Button variant="contained" startIcon={<AddIcon />} onClick={handleCreate}>
                    إضافة نوع جديد
                </Button>
            </Box>

            <MaterialReactTable {...defaultTableProps} columns={columns} data={types} state={{ isLoading: loading }} />

            <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} fullWidth maxWidth="sm">
                <DialogTitle>{selectedType ? "تعديل نوع خدمة" : "إضافة نوع خدمة"}</DialogTitle>
                <DialogContent>
                    <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
                        <TextField
                            label="اسم نوع الخدمة"
                            fullWidth
                            required
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        />
                        <TextField
                            select
                            label="الحساب المرتبط (اختياري)"
                            fullWidth
                            value={formData.account_id}
                            onChange={(e) => setFormData({ ...formData, account_id: e.target.value })}
                        >
                            <MenuItem value="">بدون حساب</MenuItem>
                            {accounts.map((a) => (
                                <MenuItem key={a.id} value={a.id}>
                                    {a.name}
                                </MenuItem>
                            ))}
                        </TextField>
                        <FormControlLabel
                            control={
                                <Switch
                                    checked={formData.affects_job_cost}
                                    onChange={(e) => setFormData({ ...formData, affects_job_cost: e.target.checked })}
                                />
                            }
                            label="يؤثر على تكلفة أمر التشغيل"
                        />
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDialogOpen(false)}>إلغاء</Button>
                    <Button variant="contained" onClick={handleSave}>
                        حفظ
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}
