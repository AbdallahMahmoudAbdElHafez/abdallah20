import React, { useMemo, useState, useEffect } from "react";
import { MaterialReactTable } from "material-react-table";
import { Box, Button, IconButton, Tooltip } from "@mui/material";
import { Edit as EditIcon, Delete as DeleteIcon, Add as AddIcon } from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { fetchCompanies, deleteCompany } from "../features/companies/companiesSlice";
import CompanyDialog from "../components/CompanyDialog";

const CompaniesPage = () => {
    const dispatch = useDispatch();
    const { items: companies, loading } = useSelector((state) => state.companies);
    const [openDialog, setOpenDialog] = useState(false);
    const [editingCompany, setEditingCompany] = useState(null);

    useEffect(() => {
        dispatch(fetchCompanies());
    }, [dispatch]);

    const handleAdd = () => {
        setEditingCompany(null);
        setOpenDialog(true);
    };

    const handleEdit = (row) => {
        setEditingCompany(row.original);
        setOpenDialog(true);
    };

    const handleDelete = async (row) => {
        if (window.confirm("هل أنت متأكد من حذف هذه الشركة؟")) {
            await dispatch(deleteCompany(row.original.id));
        }
    };

    const columns = useMemo(
        () => [
            {
                accessorKey: "id",
                header: "M",
                size: 50,
            },
            {
                accessorKey: "company_name",
                header: "اسم الشركة",
            },
            {
                accessorKey: "company_type",
                header: "نوع الشركة",
            },
            {
                accessorKey: "phone",
                header: "الهاتف",
            },
            {
                accessorKey: "city.name", // Assuming include city in response
                header: "المدينة",
                Cell: ({ row }) => row.original.City?.name || row.original.city?.name || '-',
            },
            {
                accessorKey: "is_active",
                header: "الحالة",
                Cell: ({ cell }) => (cell.getValue() ? "نشط" : "غير نشط"),
            },
        ],
        []
    );

    return (
        <Box sx={{ p: 2 }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
                <h1>الشركات</h1>
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={handleAdd}
                >
                    إضافة شركة
                </Button>
            </Box>

            <MaterialReactTable
                columns={columns}
                data={companies || []}
                state={{ isLoading: loading }}
                enableRowActions
                positionActionsColumn="last"
                renderRowActions={({ row }) => (
                    <Box sx={{ display: "flex", gap: "1rem" }}>
                        <Tooltip title="تعديل">
                            <IconButton onClick={() => handleEdit(row)}>
                                <EditIcon />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="حذف">
                            <IconButton color="error" onClick={() => handleDelete(row)}>
                                <DeleteIcon />
                            </IconButton>
                        </Tooltip>
                    </Box>
                )}
            />

            <CompanyDialog
                open={openDialog}
                onClose={() => setOpenDialog(false)}
                companyToEdit={editingCompany}
            />
        </Box>
    );
};

export default CompaniesPage;
