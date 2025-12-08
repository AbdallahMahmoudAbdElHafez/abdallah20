import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchEntryTypes, addEntryType, updateEntryType, deleteEntryType } from "../features/entryTypes/entryTypesSlice";
import { MaterialReactTable } from "material-react-table";
import { Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Snackbar, Alert, Box, IconButton } from "@mui/material";
import { Delete, Edit } from "@mui/icons-material";

export default function EntryTypesPage() {
    const dispatch = useDispatch();
    const { items, loading } = useSelector((state) => state.entryTypes);
    const [openDialog, setOpenDialog] = useState(false);
    const [editRow, setEditRow] = useState(null);
    const [name, setName] = useState("");
    const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

    useEffect(() => {
        dispatch(fetchEntryTypes());
    }, [dispatch]);

    const handleOpenDialog = (row = null) => {
        if (row) {
            setEditRow(row);
            setName(row.name);
        } else {
            setEditRow(null);
            setName("");
        }
        setOpenDialog(true);
    };

    const handleSave = () => {
        if (editRow) {
            dispatch(updateEntryType({ id: editRow.id, data: { name } }))
                .unwrap()
                .then(() => setSnackbar({ open: true, message: "تم تحديث نوع القيد بنجاح!", severity: "success" }));
        } else {
            dispatch(addEntryType({ name }))
                .unwrap()
                .then(() => setSnackbar({ open: true, message: "تم إضافة نوع القيد بنجاح!", severity: "success" }));
        }
        setOpenDialog(false);
    };

    const handleDelete = (id) => {
        dispatch(deleteEntryType(id))
            .unwrap()
            .then(() => setSnackbar({ open: true, message: "تم حذف نوع القيد بنجاح!", severity: "info" }));
    };

    const columns = useMemo(() => [{ accessorKey: "name", header: "اسم نوع القيد" }], []);

    return (
        <Box p={4} sx={{ direction: 'rtl' }}>
            <Button variant="contained" sx={{ mb: 2 }} onClick={() => handleOpenDialog()}>إضافة نوع قيد جديد</Button>

            <MaterialReactTable
                columns={columns}
                data={items}
                state={{ isLoading: loading }}
                enablePagination
                enableSorting
                enableGlobalFilter
                enableRowActions
                renderRowActions={({ row }) => (
                    <Box sx={{ display: "flex", gap: 1 }}>
                        <IconButton color="info" onClick={() => handleOpenDialog(row.original)}>
                            <Edit />
                        </IconButton>
                        <IconButton color="error" onClick={() => handleDelete(row.original.id)}>
                            <Delete />
                        </IconButton>
                    </Box>
                )}
            />

            <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
                <DialogTitle>{editRow ? "تعديل نوع القيد" : "إضافة نوع قيد جديد"}</DialogTitle>
                <DialogContent>
                    <Box display="flex" flexDirection="column" gap={2} mt={1} minWidth={300}>
                        <TextField label="اسم نوع القيد" value={name} onChange={(e) => setName(e.target.value)} />
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDialog(false)}>إلغاء</Button>
                    <Button variant="contained" onClick={handleSave}>حفظ</Button>
                </DialogActions>
            </Dialog>

            <Snackbar open={snackbar.open} autoHideDuration={3000} onClose={() => setSnackbar({ ...snackbar, open: false })}>
                <Alert severity={snackbar.severity} onClose={() => setSnackbar({ ...snackbar, open: false })}>{snackbar.message}</Alert>
            </Snackbar>
        </Box>
    );
}
