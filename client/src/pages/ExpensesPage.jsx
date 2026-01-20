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
    Autocomplete,
} from "@mui/material";
import { MaterialReactTable } from "material-react-table";
import { defaultTableProps } from "../config/tableConfig";
import { useDispatch, useSelector } from "react-redux";
import {
    fetchExpenses,
    addExpense,
    updateExpense,
    deleteExpense,
} from "../features/expenses/expensesSlice";
import { fetchAccounts } from "../features/accounts/accountsSlice";
import { fetchCities } from "../features/cities/citiesSlice";
import { fetchEmployees } from "../features/employees/employeesSlice";
import { fetchParties } from "../features/parties/partiesSlice";
import { fetchDoctors } from "../features/doctors/doctorsSlice";

export default function ExpensesPage() {
    const dispatch = useDispatch();
    const { items: expenses, loading } = useSelector((state) => state.expenses);
    const { items: accounts } = useSelector((state) => state.accounts);
    const { items: cities } = useSelector((state) => state.cities);
    const { list: employees } = useSelector((state) => state.employees);
    const { items: parties } = useSelector((state) => state.parties);
    const { list: doctors } = useSelector((state) => state.doctors);

    const [open, setOpen] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState({
        expense_date: new Date().toISOString().split("T")[0],
        description: "",
        amount: "",
        debit_account_id: "",
        credit_account_id: "",
        city_id: "",
        employee_id: "",
        doctor_id: "",
        party_id: "",
    });

    useEffect(() => {
        dispatch(fetchExpenses());
        dispatch(fetchAccounts());
        dispatch(fetchCities());
        dispatch(fetchEmployees());
        dispatch(fetchParties());
        dispatch(fetchDoctors());
    }, [dispatch]);

    const handleOpen = (expense = null) => {
        if (expense) {
            setEditingId(expense.id);
            setFormData({
                expense_date: expense.expense_date,
                description: expense.description,
                amount: expense.amount,
                debit_account_id: expense.debit_account_id,
                credit_account_id: expense.credit_account_id,
                city_id: expense.city_id || "",
                employee_id: expense.employee_id || "",
                doctor_id: expense.doctor_id || "",
                party_id: expense.party_id || "",
            });
        } else {
            setEditingId(null);
            setFormData({
                expense_date: new Date().toISOString().split("T")[0],
                description: "",
                amount: "",
                debit_account_id: "",
                credit_account_id: "",
                city_id: "",
                employee_id: "",
                doctor_id: "",
                party_id: "",
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

    const handleSubmit = () => {
        const payload = { ...formData };
        // Convert empty strings to null for optional foreign keys
        if (payload.city_id === "") payload.city_id = null;
        if (payload.employee_id === "") payload.employee_id = null;
        if (payload.doctor_id === "") payload.doctor_id = null;
        if (payload.party_id === "") payload.party_id = null;

        if (editingId) {
            dispatch(updateExpense({ id: editingId, data: payload }));
        } else {
            dispatch(addExpense(payload));
        }
        handleClose();
    };

    const handleDelete = (id) => {
        if (window.confirm("Are you sure you want to delete this expense?")) {
            dispatch(deleteExpense(id));
        }
    };

    const columns = [
        { accessorKey: "id", header: "الرقم التعريفي" },
        { accessorKey: "expense_date", header: "التاريخ" },
        { accessorKey: "description", header: "الوصف" },
        { accessorKey: "amount", header: "المبلغ" },
        { accessorKey: "debitAccount.name", header: "مدفوع لحساب" },
        { accessorKey: "creditAccount.name", header: "مدفوع من حساب" },
        {
            header: "المدينة",
            accessorFn: (row) => row.city?.name ?? "غير متوفر",
        },
        {
            header: "الموظف",
            accessorFn: (row) => row.employee?.name ?? "غير متوفر",
        },
        {
            header: "الدكتور",
            accessorFn: (row) => row.doctor?.name ?? "غير متوفر",
        },
        {
            header: "الطرف",
            accessorFn: (row) => row.party?.name ?? "غير متوفر",
        },
        {
            header: "إجراءات",
            Cell: ({ row }) => (
                <Box>
                    <Button onClick={() => handleOpen(row.original)}>تعديل</Button>
                    <Button color="error" onClick={() => handleDelete(row.original.id)}>
                        حذف
                    </Button>
                </Box>
            ),
        },
    ];

    if (loading === true) return <CircularProgress />;

    return (
        <Box p={2}>
            <Button variant="contained" onClick={() => handleOpen()} sx={{ mb: 2 }}>
                إضافة مصروف
            </Button>
            <MaterialReactTable {...defaultTableProps} columns={columns} data={expenses} />

            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>{editingId ? "تعديل المصروف" : "إضافة مصروف"}</DialogTitle>
                <DialogContent>
                    <TextField
                        margin="dense"
                        label="التاريخ"
                        type="date"
                        name="expense_date"
                        fullWidth
                        value={formData.expense_date}
                        onChange={handleChange}
                    />
                    <TextField
                        margin="dense"
                        label="الوصف"
                        name="description"
                        fullWidth
                        value={formData.description}
                        onChange={handleChange}
                    />
                    <TextField
                        margin="dense"
                        label="المبلغ"
                        type="number"
                        name="amount"
                        fullWidth
                        value={formData.amount}
                        onChange={handleChange}
                    />
                    <Autocomplete
                        options={accounts}
                        getOptionLabel={(option) => option.name || ""}
                        value={accounts.find((acc) => acc.id === formData.debit_account_id) || null}
                        onChange={(_, newValue) => {
                            setFormData({ ...formData, debit_account_id: newValue ? newValue.id : "" });
                        }}
                        renderInput={(params) => (
                            <TextField {...params} margin="dense" label="مدفوع لحساب" fullWidth />
                        )}
                    />
                    <Autocomplete
                        options={accounts}
                        getOptionLabel={(option) => option.name || ""}
                        value={accounts.find((acc) => acc.id === formData.credit_account_id) || null}
                        onChange={(_, newValue) => {
                            setFormData({ ...formData, credit_account_id: newValue ? newValue.id : "" });
                        }}
                        renderInput={(params) => (
                            <TextField {...params} margin="dense" label="مدفوع من حساب" fullWidth />
                        )}
                    />
                    <Autocomplete
                        options={cities}
                        getOptionLabel={(option) => option.name || ""}
                        value={cities.find((city) => city.id === formData.city_id) || null}
                        onChange={(_, newValue) => {
                            setFormData({ ...formData, city_id: newValue ? newValue.id : "" });
                        }}
                        renderInput={(params) => (
                            <TextField {...params} margin="dense" label="المدينة" fullWidth />
                        )}
                    />
                    <Autocomplete
                        options={employees}
                        getOptionLabel={(option) => option.name || ""}
                        value={employees.find((emp) => emp.id === formData.employee_id) || null}
                        onChange={(_, newValue) => {
                            setFormData({ ...formData, employee_id: newValue ? newValue.id : "" });
                        }}
                        renderInput={(params) => (
                            <TextField {...params} margin="dense" label="الموظف" fullWidth />
                        )}
                    />
                    <Autocomplete
                        options={doctors}
                        getOptionLabel={(option) => option.name || ""}
                        value={doctors.find((doctor) => doctor.id === formData.doctor_id) || null}
                        onChange={(_, newValue) => {
                            setFormData({ ...formData, doctor_id: newValue ? newValue.id : "" });
                        }}
                        renderInput={(params) => (
                            <TextField {...params} margin="dense" label="الدكتور" fullWidth />
                        )}
                    />
                    <Autocomplete
                        options={parties}
                        getOptionLabel={(option) => {
                            if (!option) return "";
                            return `${option.name || ""} ${option.City?.name ? `(${option.City.name})` : ""}`.trim();
                        }}
                        value={parties.find((party) => party.id === formData.party_id) || null}
                        onChange={(_, newValue) => {
                            setFormData({ ...formData, party_id: newValue ? newValue.id : "" });
                        }}
                        renderInput={(params) => (
                            <TextField {...params} margin="dense" label="الطرف" fullWidth />
                        )}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>إلغاء</Button>
                    <Button onClick={handleSubmit} variant="contained">
                        حفظ
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}
