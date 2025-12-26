import React, { useEffect, useState } from "react";
import { Box, Button, Typography, Paper } from "@mui/material";
import { MaterialReactTable } from "material-react-table";
import { useDispatch, useSelector } from "react-redux";
import { fetchDoctors, addDoctor, updateDoctor, deleteDoctor } from "../features/doctors/doctorsSlice";
import DoctorDialog from "../components/DoctorDialog";
import { defaultTableProps } from "../config/tableConfig";

export default function DoctorsPage() {
    const dispatch = useDispatch();
    const { list, loading } = useSelector((state) => state.doctors);

    const [dialogOpen, setDialogOpen] = useState(false);
    const [selectedDoctor, setSelectedDoctor] = useState(null);

    useEffect(() => {
        dispatch(fetchDoctors());
    }, [dispatch]);

    const handleOpenCreate = () => {
        setSelectedDoctor(null);
        setDialogOpen(true);
    };

    const handleOpenEdit = (doctor) => {
        setSelectedDoctor(doctor);
        setDialogOpen(true);
    };

    const handleSave = (formData) => {
        if (selectedDoctor) {
            dispatch(updateDoctor({ id: selectedDoctor.id, data: formData }));
        } else {
            dispatch(addDoctor(formData));
        }
        setDialogOpen(false);
    };

    const handleDelete = (id) => {
        if (window.confirm("هل أنت متأكد من حذف هذا الطبيب؟")) {
            dispatch(deleteDoctor(id));
        }
    };

    const columns = [
        { accessorKey: "id", header: "ID", size: 50 },
        { accessorKey: "name", header: "الاسم" },
        { accessorKey: "phone", header: "الهاتف" },
        { accessorKey: "email", header: "البريد الإلكتروني" },
        {
            accessorFn: (row) => row.city?.name || "-",
            header: "المدينة"
        },
        { accessorKey: "address", header: "العنوان" },
        {
            header: "إجراءات",
            Cell: ({ row }) => (
                <Box sx={{ display: "flex", gap: 1 }}>
                    <Button
                        size="small"
                        variant="outlined"
                        onClick={() => handleOpenEdit(row.original)}
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
            ),
        },
    ];

    return (
        <Box p={3}>
            <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3, alignItems: "center" }}>
                <Typography variant="h5" fontWeight="bold">إدارة الأطباء</Typography>
                <Button variant="contained" color="primary" onClick={handleOpenCreate}>
                    إضافة طبيب جديد
                </Button>
            </Box>

            <Paper elevation={2}>
                <MaterialReactTable
                    {...defaultTableProps}
                    columns={columns}
                    data={list}
                    state={{ isLoading: loading }}
                />
            </Paper>

            <DoctorDialog
                open={dialogOpen}
                onClose={() => setDialogOpen(false)}
                onSave={handleSave}
                doctor={selectedDoctor}
            />
        </Box>
    );
}
